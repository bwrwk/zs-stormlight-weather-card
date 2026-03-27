import type { CardConfig, ForecastItem, HassEntity, HomeAssistant, WeatherAlert, WeatherSnapshot } from './types';

function getEntity(hass: HomeAssistant | undefined, entityId?: string): HassEntity | undefined {
  if (!hass || !entityId) {
    return undefined;
  }

  return hass.states?.[entityId];
}

function readNumberEntityState(entity?: HassEntity): number | undefined {
  if (!entity) {
    return undefined;
  }

  const value = Number(entity.state);
  return Number.isFinite(value) ? value : undefined;
}

function readNumberAttribute(entity: HassEntity | undefined, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = Number(entity?.attributes?.[key]);
    if (Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
}

function readStringAttribute(entity: HassEntity | undefined, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = entity?.attributes?.[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
    }
  }

  return undefined;
}

export function normalizeForecastData(raw: any): ForecastItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((item) => ({
    datetime: item?.datetime,
    temperature: Number.isFinite(Number(item?.temperature)) ? Number(item.temperature) : undefined,
    templow: Number.isFinite(Number(item?.templow)) ? Number(item.templow) : undefined,
    condition: item?.condition ? String(item.condition) : undefined,
    precipitation: Number.isFinite(Number(item?.precipitation)) ? Number(item.precipitation) : undefined,
    precipitation_probability: Number.isFinite(Number(item?.precipitation_probability)) ? Number(item.precipitation_probability) : undefined,
    wind_speed: Number.isFinite(Number(item?.wind_speed)) ? Number(item.wind_speed) : undefined,
    is_daytime: item?.is_daytime === undefined ? undefined : Boolean(item.is_daytime),
  }));
}

export function extractForecastResponse(raw: any, entityId: string): ForecastItem[] {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    for (const entry of raw) {
      const extracted = extractForecastResponse(entry, entityId);
      if (extracted.length) {
        return extracted;
      }
    }
    return [];
  }

  if (typeof raw !== 'object') {
    return [];
  }

  const directEntityForecast = raw?.[entityId]?.forecast;
  if (Array.isArray(directEntityForecast)) {
    return normalizeForecastData(directEntityForecast);
  }

  if (Array.isArray(raw.forecast)) {
    return normalizeForecastData(raw.forecast);
  }

  for (const value of Object.values(raw)) {
    const extracted = extractForecastResponse(value, entityId);
    if (extracted.length) {
      return extracted;
    }
  }

  return [];
}

function deriveAlertSeverity(entity: HassEntity): WeatherAlert['severity'] {
  const raw = String(
    entity.attributes?.severity
      || entity.attributes?.level
      || entity.state
      || '',
  ).toLowerCase();

  if (['critical', 'severe', 'extreme', 'danger', 'on'].includes(raw)) {
    return 'critical';
  }

  if (['warning', 'watch', 'moderate', 'problem'].includes(raw)) {
    return 'warning';
  }

  return 'info';
}

function normalizeAlerts(entities: HassEntity[]): WeatherAlert[] {
  return entities
    .filter((entity) => !['off', 'false', '0', 'idle', 'unknown', 'unavailable'].includes(String(entity.state).toLowerCase()))
    .map((entity) => ({
      entityId: entity.entity_id,
      title: String(
        entity.attributes?.headline
          || entity.attributes?.title
          || entity.attributes?.friendly_name
          || entity.entity_id,
      ),
      severity: deriveAlertSeverity(entity),
      description: String(
        entity.attributes?.description
          || entity.attributes?.message
          || entity.attributes?.event
          || '',
      ).trim() || undefined,
    }));
}

export function createWeatherSnapshot(hass: HomeAssistant, config: CardConfig): WeatherSnapshot {
  const weatherEntity = getEntity(hass, config.entity);
  const overrides = config.entities || {};
  const forecastEntity = getEntity(hass, overrides.forecast_entity);

  const humidityEntity = getEntity(hass, overrides.humidity);
  const pressureEntity = getEntity(hass, overrides.pressure);
  const windSpeedEntity = getEntity(hass, overrides.wind_speed);
  const windBearingEntity = getEntity(hass, overrides.wind_bearing);
  const apparentEntity = getEntity(hass, overrides.apparent_temperature);
  const visibilityEntity = getEntity(hass, overrides.visibility);
  const uvEntity = getEntity(hass, overrides.uv_index);
  const cloudEntity = getEntity(hass, overrides.cloud_coverage);
  const precipitationEntity = getEntity(hass, overrides.precipitation);
  const sunriseEntity = getEntity(hass, overrides.sunrise);
  const sunsetEntity = getEntity(hass, overrides.sunset);
  const alertEntities = (overrides.alerts || []).map((entityId) => getEntity(hass, entityId)).filter(Boolean) as HassEntity[];

  const forecastSource = normalizeForecastData(
    forecastEntity?.attributes?.[overrides.forecast_attribute || 'forecast']
      ?? weatherEntity?.attributes?.forecast,
  );

  const lastUpdated = forecastSource[0]?.datetime || weatherEntity?.attributes?.last_updated;
  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  return {
    entityId: config.entity,
    state: weatherEntity?.state || 'unknown',
    condition: weatherEntity?.state || 'cloudy',
    temperature: readNumberAttribute(weatherEntity, ['temperature']) ?? readNumberEntityState(weatherEntity),
    apparentTemperature: readNumberEntityState(apparentEntity) ?? readNumberAttribute(weatherEntity, ['apparent_temperature', 'feels_like']),
    humidity: readNumberEntityState(humidityEntity) ?? readNumberAttribute(weatherEntity, ['humidity']),
    pressure: readNumberEntityState(pressureEntity) ?? readNumberAttribute(weatherEntity, ['pressure']),
    windSpeed: readNumberEntityState(windSpeedEntity) ?? readNumberAttribute(weatherEntity, ['wind_speed']),
    windBearing: readNumberEntityState(windBearingEntity) ?? readNumberAttribute(weatherEntity, ['wind_bearing']),
    visibility: readNumberEntityState(visibilityEntity) ?? readNumberAttribute(weatherEntity, ['visibility']),
    uvIndex: readNumberEntityState(uvEntity) ?? readNumberAttribute(weatherEntity, ['uv_index']),
    cloudCoverage: readNumberEntityState(cloudEntity) ?? readNumberAttribute(weatherEntity, ['cloud_coverage']),
    precipitation: readNumberEntityState(precipitationEntity) ?? readNumberAttribute(weatherEntity, ['precipitation', 'precipitation_amount']),
    sunrise: sunriseEntity?.state || readStringAttribute(weatherEntity, ['sunrise']),
    sunset: sunsetEntity?.state || readStringAttribute(weatherEntity, ['sunset']),
    friendlyName: config.location || String(weatherEntity?.attributes?.friendly_name || config.title || 'Hogwarts'),
    attribution: readStringAttribute(weatherEntity, ['attribution']),
    forecast: forecastSource,
    alerts: normalizeAlerts(alertEntities),
    lastUpdatedLabel,
  };
}
