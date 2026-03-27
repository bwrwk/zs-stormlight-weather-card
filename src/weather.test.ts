import { describe, expect, it } from 'vitest';
import type { CardConfig, HomeAssistant } from './types';
import { createWeatherSnapshot, extractForecastResponse } from './weather';

describe('createWeatherSnapshot', () => {
  it('uses forecast bridge entity when weather entity has no forecast attribute', () => {
    const hass: HomeAssistant = {
      states: {
        'weather.home': {
          entity_id: 'weather.home',
          state: 'sunny',
          attributes: {
            friendly_name: 'Hogwarts',
            temperature: 22,
            humidity: 48,
          },
        },
        'sensor.weather_home_daily': {
          entity_id: 'sensor.weather_home_daily',
          state: 'ok',
          attributes: {
            forecast: [
              {
                datetime: '2026-03-26T12:00:00+01:00',
                temperature: 19,
                condition: 'rainy',
              },
            ],
          },
        },
      },
    };

    const config: CardConfig = {
      type: 'custom:zs-stormlight-weather-card',
      entity: 'weather.home',
      entities: {
        forecast_entity: 'sensor.weather_home_daily',
      },
    };

    const snapshot = createWeatherSnapshot(hass, config);

    expect(snapshot.forecast).toHaveLength(1);
    expect(snapshot.forecast[0]?.condition).toBe('rainy');
    expect(snapshot.temperature).toBe(22);
  });

  it('normalizes alert titles, descriptions and severity', () => {
    const hass: HomeAssistant = {
      states: {
        'weather.home': {
          entity_id: 'weather.home',
          state: 'sunny',
          attributes: {
            friendly_name: 'Hogwarts',
            temperature: 22,
          },
        },
        'binary_sensor.weather_warning': {
          entity_id: 'binary_sensor.weather_warning',
          state: 'on',
          attributes: {
            severity: 'warning',
            headline: 'Strong Wind Warning',
            description: 'Secure loose parchment and banners.',
          },
        },
      },
    };

    const config: CardConfig = {
      type: 'custom:zs-stormlight-weather-card',
      entity: 'weather.home',
      entities: {
        alerts: ['binary_sensor.weather_warning'],
      },
    };

    const snapshot = createWeatherSnapshot(hass, config);

    expect(snapshot.alerts).toHaveLength(1);
    expect(snapshot.alerts[0]?.title).toBe('Strong Wind Warning');
    expect(snapshot.alerts[0]?.severity).toBe('warning');
    expect(snapshot.alerts[0]?.description).toContain('parchment');
  });

  it('extracts service forecast mapping for a weather entity', () => {
    const response = {
      service_response: {
        'weather.openweathermap': {
          forecast: [
            {
              datetime: '2026-03-26T12:00:00+01:00',
              temperature: 11,
              condition: 'rainy',
            },
          ],
        },
      },
    };

    const forecast = extractForecastResponse(response, 'weather.openweathermap');

    expect(forecast).toHaveLength(1);
    expect(forecast[0]?.temperature).toBe(11);
    expect(forecast[0]?.condition).toBe('rainy');
  });
});
