export type HassEntity = {
  entity_id: string;
  state: string;
  attributes?: Record<string, any>;
};

export type HomeAssistant = {
  states: Record<string, HassEntity>;
  themes?: {
    darkMode?: boolean;
    themes?: Record<string, Record<string, string>>;
  };
  config?: {
    unit_system?: {
      length?: string;
      temperature?: string;
      speed?: string;
      pressure?: string;
    };
    language?: string;
  };
  locale?: {
    language?: string;
  };
  language?: string;
  callApi?: (method: string, path: string, parameters?: any) => Promise<any>;
};

export type ForecastItem = {
  datetime?: string;
  temperature?: number;
  templow?: number;
  condition?: string;
  precipitation?: number;
  precipitation_probability?: number;
  wind_speed?: number;
  is_daytime?: boolean;
};

export type WeatherAlert = {
  entityId: string;
  title: string;
  severity: 'info' | 'warning' | 'critical';
  description?: string;
};

export type FactKey =
  | 'humidity'
  | 'wind'
  | 'pressure'
  | 'precipitation'
  | 'visibility'
  | 'uv'
  | 'cloud_coverage'
  | 'sunrise'
  | 'sunset';

export type QuoteCharacter =
  | 'kaladin'
  | 'shallan'
  | 'adolin'
  | 'dalinar'
  | 'navani'
  | 'rock';

export type CardStyleConfig = {
  preset?: 'urithiru_archive' | 'stormfront_warning' | 'navani_notebook';
  ha_theme?: string;
  accent_color?: string;
  ink_color?: string;
  paper_color?: string;
  background?: string;
  density?: 'compact' | 'comfortable' | 'airy';
  paper_texture?: boolean;
  animated_hero?: boolean;
  show_masthead?: boolean;
  show_almanac?: boolean;
  show_forecast?: boolean;
  show_alerts?: boolean;
  debug?: boolean;
};

export type LayoutConfig = {
  mode?: 'frontpage' | 'bulletin';
  forecast_mode?: 'auto' | 'hourly' | 'daily';
  forecast_items?: number;
  facts?: FactKey[];
};

export type ContentConfig = {
  headline_mode?: 'auto' | 'custom' | 'none';
  headline_template?: string;
  condition_labels?: 'pl' | 'en' | 'auto';
  show_quotes?: boolean;
  quote_rotation?: 'forecast' | 'twice_daily' | 'hybrid';
  quote_characters?: QuoteCharacter[];
};

export type EntityOverrides = {
  forecast_entity?: string;
  forecast_attribute?: string;
  apparent_temperature?: string;
  humidity?: string;
  pressure?: string;
  wind_speed?: string;
  wind_bearing?: string;
  visibility?: string;
  uv_index?: string;
  cloud_coverage?: string;
  precipitation?: string;
  sunrise?: string;
  sunset?: string;
  alerts?: string[];
};

export type TapActionConfig = {
  action?: 'more-info' | 'none';
};

export type CardConfig = {
  type: string;
  entity: string;
  title?: string;
  subtitle?: string;
  location?: string;
  style?: CardStyleConfig;
  layout?: LayoutConfig;
  content?: ContentConfig;
  entities?: EntityOverrides;
  tap_action?: TapActionConfig;
};

export type PresentedFact = {
  key: FactKey;
  label: string;
  value: string;
};

export type WeatherSnapshot = {
  entityId: string;
  state: string;
  condition: string;
  temperature?: number;
  apparentTemperature?: number;
  humidity?: number;
  pressure?: number;
  windSpeed?: number;
  windBearing?: number;
  visibility?: number;
  uvIndex?: number;
  cloudCoverage?: number;
  precipitation?: number;
  sunrise?: string;
  sunset?: string;
  friendlyName: string;
  attribution?: string;
  forecast: ForecastItem[];
  alerts: WeatherAlert[];
  lastUpdatedLabel: string;
};
