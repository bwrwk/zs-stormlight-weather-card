import { LitElement, css, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getEditorLanguage, getLanguage, getTranslations } from './i18n';
import { PRESET_STYLES, getDensityValues } from './presets';
import { buildFacts, buildHeadline, formatAlertSeverity, formatForecastTemperature, formatTime } from './presenters';
import type { CardConfig, FactKey, ForecastItem, HomeAssistant } from './types';
import { selectQuote } from './quotes';
import { createWeatherSnapshot, extractForecastResponse } from './weather';

declare global {
  interface Window {
    customCards?: Array<Record<string, any>>;
  }
}

const CARD_TAG = 'zs-stormlight-weather-card';

const DEFAULT_CONFIG: CardConfig = {
  type: `custom:${CARD_TAG}`,
  entity: '',
  title: 'Stormlight Weather Archive',
  subtitle: 'Roshar weather report',
  location: '',
  style: {
    preset: 'urithiru_archive',
    density: 'comfortable',
    paper_texture: true,
    animated_hero: false,
    show_masthead: true,
    show_almanac: true,
    show_forecast: true,
    show_alerts: true,
    debug: false,
  },
  layout: {
    mode: 'frontpage',
    forecast_mode: 'daily',
    forecast_items: 5,
    facts: ['humidity', 'wind', 'pressure', 'precipitation'],
  },
  content: {
    headline_mode: 'auto',
    headline_template: '',
    condition_labels: 'auto',
    show_quotes: true,
    quote_rotation: 'hybrid',
    quote_characters: ['kaladin', 'shallan', 'adolin', 'dalinar', 'navani', 'rock'],
  },
  entities: {},
  tap_action: {
    action: 'more-info',
  },
};

function mergeConfig(config: CardConfig): CardConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    style: { ...DEFAULT_CONFIG.style, ...(config.style || {}) },
    layout: { ...DEFAULT_CONFIG.layout, ...(config.layout || {}) },
    content: { ...DEFAULT_CONFIG.content, ...(config.content || {}) },
    entities: { ...DEFAULT_CONFIG.entities, ...(config.entities || {}) },
    tap_action: { ...DEFAULT_CONFIG.tap_action, ...(config.tap_action || {}) },
  };
}

function getConditionIcon(condition: string): string {
  switch (condition) {
    case 'sunny':
      return '\u263c';
    case 'partlycloudy':
      return '\u26c5';
    case 'rainy':
    case 'pouring':
      return '\u2614';
    case 'lightning':
    case 'lightning_rainy':
      return '\u2607';
    case 'snowy':
    case 'snowy_rainy':
      return '\u2744';
    case 'fog':
      return '\u3030';
    case 'windy':
    case 'windy_variant':
      return '\ud83c\udf01';
    default:
      return '\u2601';
  }
}

function formatForecastLabel(item: ForecastItem, mode: 'auto' | 'hourly' | 'daily'): string {
  if (!item.datetime) {
    return 'Watch';
  }

  const date = new Date(item.datetime);
  if (Number.isNaN(date.getTime())) {
    return 'Watch';
  }

  if (mode === 'hourly') {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString([], {
    weekday: 'short',
  });
}

function resolveForecastMode(configuredMode: 'auto' | 'hourly' | 'daily', items: ForecastItem[]): 'hourly' | 'daily' {
  if (configuredMode === 'hourly' || configuredMode === 'daily') {
    return configuredMode;
  }

  const first = items[0]?.datetime ? new Date(items[0].datetime) : undefined;
  const second = items[1]?.datetime ? new Date(items[1].datetime) : undefined;

  if (!first || !second || Number.isNaN(first.getTime()) || Number.isNaN(second.getTime())) {
    return 'daily';
  }

  const diff = Math.abs(second.getTime() - first.getTime());
  return diff <= 1000 * 60 * 60 * 6 ? 'hourly' : 'daily';
}

class ZSDailyProphetCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    serviceForecast: { attribute: false, state: true },
    forecastLoading: { attribute: false, state: true },
    forecastSource: { attribute: false, state: true },
    forecastServiceStatus: { attribute: false, state: true },
  };

  static getStubConfig() {
    return {
      type: `custom:${CARD_TAG}`,
      entity: 'weather.home',
      title: 'Archiwum Burzowego ĹšwiatĹ‚a',
      subtitle: 'Raport pogodowy Rosharu',
      location: 'Urithiru i okolice',
      style: {
        preset: 'urithiru_archive',
      },
    };
  }

  static getConfigForm() {
    const t = getTranslations(getEditorLanguage());

    return {
      schema: [
        {
          name: 'entity',
          required: true,
          selector: {
            entity: {
              filter: [{ domain: 'weather' }],
            },
          },
        },
        { name: 'title', selector: { text: {} } },
        { name: 'subtitle', selector: { text: {} } },
        { name: 'location', selector: { text: {} } },
        {
          type: 'expandable',
          name: 'style',
          title: t.labels.style,
          schema: [
            {
              name: 'preset',
              selector: {
                select: {
                  options: [
                    { value: 'urithiru_archive', label: 'Urithiru Archive' },
                    { value: 'stormfront_warning', label: 'Stormfront Warning' },
                    { value: 'navani_notebook', label: 'Navani Notebook' },
                  ],
                },
              },
            },
            { name: 'ha_theme', selector: { theme: {} } },
            { name: 'accent_color', selector: { text: {} } },
            { name: 'ink_color', selector: { text: {} } },
            { name: 'paper_color', selector: { text: {} } },
            { name: 'background', selector: { text: {} } },
            {
              name: 'density',
              selector: {
                select: {
                  options: [
                    { value: 'compact', label: 'Compact' },
                    { value: 'comfortable', label: 'Comfortable' },
                    { value: 'airy', label: 'Airy' },
                  ],
                },
              },
            },
            { name: 'paper_texture', selector: { boolean: {} } },
            { name: 'animated_hero', selector: { boolean: {} } },
            { name: 'show_masthead', selector: { boolean: {} } },
            { name: 'show_almanac', selector: { boolean: {} } },
            { name: 'show_forecast', selector: { boolean: {} } },
            { name: 'show_alerts', selector: { boolean: {} } },
            { name: 'debug', selector: { boolean: {} } },
          ],
        },
        {
          type: 'expandable',
          name: 'layout',
          title: t.labels.layout,
          schema: [
            {
              name: 'mode',
              selector: {
                select: {
                  options: [
                    { value: 'frontpage', label: 'Frontpage' },
                    { value: 'bulletin', label: 'Bulletin' },
                  ],
                },
              },
            },
            {
              name: 'forecast_mode',
              selector: {
                select: {
                  options: [
                    { value: 'auto', label: 'Auto' },
                    { value: 'hourly', label: 'Hourly' },
                    { value: 'daily', label: 'Daily' },
                  ],
                },
              },
            },
            {
              name: 'forecast_items',
              selector: {
                number: {
                  min: 1,
                  max: 12,
                  step: 1,
                  mode: 'slider',
                },
              },
            },
            {
              name: 'facts',
              selector: {
                select: {
                  multiple: true,
                  mode: 'list',
                  options: [
                    { value: 'humidity', label: t.facts.humidity },
                    { value: 'wind', label: t.facts.wind },
                    { value: 'pressure', label: t.facts.pressure },
                    { value: 'precipitation', label: t.facts.precipitation },
                    { value: 'visibility', label: t.facts.visibility },
                    { value: 'uv', label: t.facts.uv },
                    { value: 'cloud_coverage', label: t.facts.cloud_coverage },
                    { value: 'sunrise', label: t.facts.sunrise },
                    { value: 'sunset', label: t.facts.sunset },
                  ],
                },
              },
            },
          ],
        },
        {
          type: 'expandable',
          name: 'content',
          title: t.labels.content,
          schema: [
            {
              name: 'headline_mode',
              selector: {
                select: {
                  options: [
                    { value: 'auto', label: 'Auto' },
                    { value: 'custom', label: 'Custom' },
                    { value: 'none', label: 'None' },
                  ],
                },
              },
            },
            { name: 'headline_template', selector: { text: {} } },
            {
              name: 'condition_labels',
              selector: {
                select: {
                  options: [
                    { value: 'auto', label: 'Auto' },
                    { value: 'pl', label: 'Polish' },
                    { value: 'en', label: 'English' },
                  ],
                },
              },
            },
            { name: 'show_quotes', selector: { boolean: {} } },
            {
              name: 'quote_rotation',
              selector: {
                select: {
                  options: [
                    { value: 'forecast', label: 'Forecast' },
                    { value: 'twice_daily', label: 'Twice daily' },
                    { value: 'hybrid', label: 'Hybrid' },
                  ],
                },
              },
            },
            {
              name: 'quote_characters',
              selector: {
                select: {
                  multiple: true,
                  mode: 'list',
                  options: [
                    { value: 'kaladin', label: t.characterNames.kaladin },
                    { value: 'shallan', label: t.characterNames.shallan },
                    { value: 'adolin', label: t.characterNames.adolin },
                    { value: 'dalinar', label: t.characterNames.dalinar },
                    { value: 'navani', label: t.characterNames.navani },
                    { value: 'rock', label: t.characterNames.rock },
                  ],
                },
              },
            },
          ],
        },
        {
          type: 'expandable',
          name: 'entities',
          title: t.labels.entities,
          schema: [
            { name: 'forecast_entity', selector: { entity: {} } },
            { name: 'forecast_attribute', selector: { text: {} } },
            { name: 'apparent_temperature', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'humidity', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'pressure', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'wind_speed', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'wind_bearing', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'visibility', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'uv_index', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'cloud_coverage', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'precipitation', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
            { name: 'sunrise', selector: { entity: {} } },
            { name: 'sunset', selector: { entity: {} } },
            {
              name: 'alerts',
              selector: {
                entity: {
                  multiple: true,
                  filter: [{ domain: 'binary_sensor' }, { domain: 'sensor' }],
                },
              },
            },
          ],
        },
        {
          type: 'expandable',
          name: 'tap_action',
          title: t.labels.tap_action,
          schema: [
            {
              name: 'action',
              selector: {
                select: {
                  options: [
                    { value: 'more-info', label: 'More info' },
                    { value: 'none', label: 'None' },
                  ],
                },
              },
            },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => t.labels[schema.name] || schema.name,
      computeHelper: (schema: { name: string }) => t.helpers[schema.name],
    };
  }

  static styles = css`
    :host {
      display: block;
      --zs-prophet-card-bg: linear-gradient(180deg, rgba(118,91,56,0.96), rgba(68,49,28,0.98));
      --zs-prophet-paper: linear-gradient(180deg, #f3e8c9 0%, #e8d7b1 54%, #d3ba8b 100%);
      --zs-prophet-ink: #2e2215;
      --zs-prophet-muted: rgba(46, 34, 21, 0.64);
      --zs-prophet-accent: #8f6230;
      --zs-prophet-accent-soft: rgba(143, 98, 48, 0.18);
      --zs-prophet-border: #8f6b3d;
      --zs-prophet-alert: #8d2b1f;
      --zs-prophet-shadow: rgba(34, 22, 10, 0.24);
      --zs-prophet-title: "Cinzel Decorative", "Cinzel", Georgia, serif;
      --zs-prophet-copy: "Cormorant Garamond", Georgia, serif;
      --zs-prophet-card-padding: 22px;
      --zs-prophet-gap: 18px;
      --zs-prophet-hero-padding: 20px;
    }

    ha-card {
      position: relative;
      overflow: hidden;
      border-radius: 30px;
      padding: var(--zs-prophet-card-padding);
      background: var(--zs-prophet-card-bg);
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 50%, transparent);
      box-shadow: 0 24px 44px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.06);
      color: var(--zs-prophet-ink);
      cursor: pointer;
    }

    .frame {
      position: relative;
      display: grid;
      gap: var(--zs-prophet-gap);
      background: var(--zs-prophet-paper);
      border-radius: 24px;
      padding: var(--zs-prophet-card-padding);
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 42%, transparent);
      box-shadow: inset 0 0 0 1px rgba(255, 248, 230, 0.26), 0 16px 32px var(--zs-prophet-shadow);
    }

    .frame::after {
      content: "";
      position: absolute;
      inset: 12px;
      border-radius: 18px;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 24%, transparent);
      pointer-events: none;
      opacity: 0.8;
    }

    .frame::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.5;
      background:
        radial-gradient(circle at 15% 12%, rgba(255,255,255,0.38), transparent 22%),
        linear-gradient(135deg, rgba(255,255,255,0.08), transparent 38%, rgba(88,57,28,0.04) 90%);
      mix-blend-mode: screen;
    }

    .paper-texture::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.18;
      background-image:
        radial-gradient(rgba(79, 51, 23, 0.28) 0.55px, transparent 0.7px),
        radial-gradient(rgba(255, 251, 239, 0.45) 0.55px, transparent 0.8px);
      background-size: 18px 18px, 24px 24px;
      background-position: 0 0, 11px 9px;
    }

    .masthead {
      display: grid;
      gap: 10px;
      padding-bottom: 16px;
      border-bottom: 1px solid color-mix(in srgb, var(--zs-prophet-border) 48%, transparent);
    }

    .archive-header {
      display: grid;
      grid-template-columns: 84px minmax(0, 1fr) auto;
      gap: 16px;
      align-items: center;
    }

    .archive-sigil {
      position: relative;
      width: 84px;
      height: 84px;
      border-radius: 50%;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 50%, transparent);
      background:
        radial-gradient(circle at center, rgba(255,255,255,0.28), transparent 38%),
        radial-gradient(circle at center, color-mix(in srgb, var(--zs-prophet-accent) 26%, transparent) 0 18%, transparent 19% 100%);
      box-shadow: inset 0 0 0 10px rgba(255, 255, 255, 0.04);
      overflow: hidden;
    }

    .archive-sigil::before,
    .archive-sigil::after {
      content: "";
      position: absolute;
      inset: 14px;
      border-radius: 50%;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 40%, transparent);
    }

    .archive-sigil::after {
      inset: 28px;
      background: color-mix(in srgb, var(--zs-prophet-accent) 64%, transparent);
      border: none;
      clip-path: polygon(50% 0%, 61% 32%, 100% 50%, 61% 68%, 50% 100%, 39% 68%, 0% 50%, 39% 32%);
      opacity: 0.9;
    }

    .archive-copy {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .archive-meta {
      display: grid;
      gap: 6px;
      justify-items: end;
      text-align: right;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      font-size: 0.94rem;
    }

    .archive-meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 36%, transparent);
      background: color-mix(in srgb, var(--zs-prophet-accent-soft) 100%, transparent);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.78rem;
    }

    .bureau-header {
      display: grid;
      gap: 12px;
      padding: 0 0 14px;
      border-bottom: 1px solid color-mix(in srgb, var(--zs-prophet-border) 52%, transparent);
    }

    .bureau-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 10px 16px;
      align-items: center;
    }

    .bureau-stamp {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--zs-prophet-accent-soft) 100%, transparent);
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 40%, transparent);
      font-family: var(--zs-prophet-copy);
      font-size: 0.88rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--zs-prophet-muted);
    }

    .bureau-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(180px, 0.9fr);
      gap: 12px;
      align-items: end;
    }

    .bureau-title {
      display: grid;
      gap: 4px;
    }

    .bureau-title .title {
      font-size: clamp(1.75rem, 4vw, 2.8rem);
      line-height: 0.98;
      letter-spacing: 0.06em;
    }

    .bureau-title .subtitle {
      font-size: 1rem;
    }

    .bureau-meta {
      display: grid;
      gap: 6px;
      justify-items: end;
      text-align: right;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      font-size: 0.96rem;
    }

    .animated-header {
      position: relative;
      display: grid;
      gap: 12px;
      padding: 0 0 16px;
      border-bottom: 1px solid color-mix(in srgb, var(--zs-prophet-border) 50%, transparent);
      overflow: hidden;
    }

    .animated-header::before {
      content: "";
      position: absolute;
      inset: -12% -8% auto -8%;
      height: 120px;
      background:
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.28), transparent 28%),
        radial-gradient(circle at 80% 35%, rgba(255,214,143,0.22), transparent 24%);
      filter: blur(12px);
      opacity: 0.9;
      pointer-events: none;
    }

    .animated-ribbon {
      position: relative;
      display: inline-flex;
      justify-self: start;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 44%, transparent);
      background: linear-gradient(180deg, rgba(255,248,229,0.14), rgba(255,248,229,0.04));
      font-family: var(--zs-prophet-copy);
      font-size: 0.86rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--zs-prophet-muted);
    }

    .animated-grid {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      align-items: start;
    }

    .animated-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      align-items: center;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
    }

    .animated-header .title {
      font-size: clamp(1.85rem, 4.8vw, 3rem);
      line-height: 0.96;
      letter-spacing: 0.06em;
    }

    .eyebrow,
    .subtitle,
    .edition-row,
    .lede,
    .quote-kicker,
    .quote-meta,
    .fact-label,
    .section-meta,
    .forecast-name,
    .forecast-extra {
      font-family: var(--zs-prophet-copy);
    }

    .eyebrow {
      font-size: 0.84rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--zs-prophet-muted);
    }

    .title,
    .headline,
    .temperature,
    .fact-value,
    .section-title {
      font-family: var(--zs-prophet-title);
    }

    .title {
      font-size: clamp(2rem, 5vw, 3.4rem);
      line-height: 0.95;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .subtitle {
      font-size: 1.08rem;
      color: var(--zs-prophet-muted);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.95fr);
      gap: 18px;
      align-items: stretch;
    }

    .bureau-layout .hero {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .lead,
    .hero-side {
      padding: var(--zs-prophet-hero-padding);
      border-radius: 22px;
      border: 1px solid rgba(104, 73, 39, 0.12);
    }

    .lead {
      display: grid;
      gap: 12px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08)),
        color-mix(in srgb, var(--zs-prophet-accent-soft) 100%, transparent);
    }

    .story-kicker {
      display: inline-flex;
      justify-self: start;
      padding: 7px 12px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 30%, transparent);
      background: rgba(255, 255, 255, 0.12);
      font-size: 0.75rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--zs-prophet-muted);
      font-family: var(--zs-prophet-copy);
    }

    .lead-copy {
      display: grid;
      gap: 12px;
      min-width: 0;
    }

    .quote-card {
      display: grid;
      gap: 8px;
      margin-top: 4px;
      padding: 14px 16px;
      border-radius: 16px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05)),
        color-mix(in srgb, var(--zs-prophet-accent-soft) 100%, transparent);
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 26%, transparent);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
    }

    .quote-kicker {
      font-size: 0.74rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--zs-prophet-muted);
    }

    .quote-body {
      font-family: var(--zs-prophet-copy);
      font-size: 1.08rem;
      line-height: 1.45;
      font-style: italic;
    }

    .quote-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      font-size: 0.82rem;
      color: var(--zs-prophet-muted);
    }

    .bureau-hero {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.95fr);
      gap: 14px;
      align-items: stretch;
    }

    .animated-hero {
      display: block;
    }

    .bureau-story,
    .bureau-reading-card,
    .bureau-facts {
      padding: var(--zs-prophet-hero-padding);
      border-radius: 18px;
      border: 1px solid rgba(104, 73, 39, 0.12);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04)),
        rgba(255,255,255,0.08);
    }

    .animated-stage {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) 220px;
      gap: 18px;
      padding: 20px;
      border-radius: 28px;
      border: 1px solid rgba(104, 73, 39, 0.16);
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04)),
        radial-gradient(circle at top left, rgba(255,224,165,0.18), transparent 32%),
        linear-gradient(180deg, rgba(236, 214, 171, 0.78), rgba(213, 181, 122, 0.58));
      min-height: 420px;
    }

    .animated-stage::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.2), transparent 30%),
        radial-gradient(circle at 82% 16%, rgba(255,244,217,0.34), transparent 18%);
      pointer-events: none;
    }

    .animated-stage.condition-rainy::after,
    .animated-stage.condition-pouring::after,
    .animated-stage.condition-lightning_rainy::after {
      content: "";
      position: absolute;
      inset: -20% 0 0 0;
      background-image: linear-gradient(180deg, rgba(126, 119, 155, 0.22), rgba(126, 119, 155, 0));
      pointer-events: none;
    }

    .animated-sky {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .animated-cloud {
      position: absolute;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(255,255,255,0.44), rgba(255,255,255,0.05));
      filter: blur(4px);
      opacity: 0.9;
    }

    .animated-cloud.a {
      width: 170px;
      height: 58px;
      top: 58px;
      left: 18px;
      animation: drift 14s ease-in-out infinite alternate;
    }

    .animated-cloud.b {
      width: 110px;
      height: 42px;
      top: 132px;
      left: 140px;
      animation: drift 17s ease-in-out infinite alternate-reverse;
      opacity: 0.75;
    }

    .animated-rain {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
    }

    .animated-stage.condition-rainy .animated-rain,
    .animated-stage.condition-pouring .animated-rain,
    .animated-stage.condition-lightning_rainy .animated-rain {
      opacity: 1;
    }

    .animated-rain::before,
    .animated-rain::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: linear-gradient(110deg, transparent 0 46%, rgba(120, 124, 162, 0.24) 47%, transparent 49%, transparent 100%);
      background-size: 28px 28px;
      animation: rainFall 1.15s linear infinite;
    }

    .animated-rain::after {
      animation-duration: 1.55s;
      opacity: 0.7;
      transform: translateX(10px);
    }

    .animated-story {
      position: relative;
      z-index: 1;
      align-self: end;
      display: grid;
      gap: 12px;
      padding: 18px;
      border-radius: 22px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.08)),
        rgba(255, 248, 230, 0.18);
      backdrop-filter: blur(6px);
    }

    .animated-reading-card {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 14px;
      justify-items: center;
      align-content: center;
      padding: 18px;
      border-radius: 24px;
      border: 1px solid rgba(104, 73, 39, 0.16);
      background:
        radial-gradient(circle at 50% 20%, rgba(255,255,255,0.26), transparent 26%),
        linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05)),
        rgba(255,255,255,0.08);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.16);
    }

    .animated-reading-card::before,
    .animated-reading-card::after {
      content: "";
      position: absolute;
      inset: auto;
      border-radius: 999px;
      pointer-events: none;
    }

    .animated-reading-card::before {
      width: 180px;
      height: 54px;
      top: 42px;
      left: 12px;
      background: radial-gradient(circle, rgba(255,255,255,0.3), rgba(255,255,255,0));
      filter: blur(10px);
      animation: drift 10s ease-in-out infinite alternate;
      opacity: 0.7;
    }

    .animated-reading-card::after {
      width: 120px;
      height: 120px;
      right: -16px;
      bottom: 24px;
      background: radial-gradient(circle, rgba(255,205,129,0.18), rgba(255,205,129,0));
      filter: blur(16px);
      opacity: 0.85;
      animation: pulseGlow 9s ease-in-out infinite;
    }

    .animated-reading {
      display: grid;
      gap: 10px;
      justify-items: center;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .animated-summary {
      display: grid;
      gap: 8px;
      padding-top: 10px;
      border-top: 1px dashed color-mix(in srgb, var(--zs-prophet-border) 38%, transparent);
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      text-align: center;
    }

    .animated-reading-card.animated .icon-medallion {
      animation: floatSeal 5.8s ease-in-out infinite;
    }

    .animated-reading-card.animated .animated-summary {
      animation: shimmer 7s linear infinite;
      background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
      background-size: 180% 100%;
      background-repeat: no-repeat;
    }

    .bureau-story {
      display: grid;
      gap: 12px;
    }

    .bureau-side {
      display: grid;
      grid-template-rows: auto auto;
      gap: 14px;
      min-width: 0;
    }

    .bureau-reading-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 14px;
      align-items: start;
      min-width: 0;
    }

    .bureau-facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .edition-row,
    .section-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 10px 14px;
      align-items: center;
    }

    .edition-row,
    .section-meta,
    .lede,
    .forecast-extra,
    .forecast-name {
      color: var(--zs-prophet-muted);
    }

    .headline {
      font-size: clamp(1.3rem, 3vw, 2rem);
      line-height: 1.05;
      text-wrap: balance;
    }

    .lede {
      font-size: 1.08rem;
      line-height: 1.18;
    }

    .hero-side {
      position: relative;
      display: block;
      background:
        radial-gradient(circle at 50% 28%, rgba(255,255,255,0.42), transparent 32%),
        linear-gradient(180deg, rgba(250,240,215,0.82), rgba(227,208,168,0.75));
      overflow: hidden;
      min-height: 260px;
    }

    .storm-reading-card {
      display: grid;
      gap: 14px;
      justify-items: center;
      align-content: center;
      min-height: 100%;
    }

    .bureau-reading-card .icon-medallion {
      width: 108px;
      height: 108px;
      margin: 0;
      align-self: start;
    }

    .bureau-reading {
      display: grid;
      gap: 8px;
      align-content: start;
      min-width: 0;
    }

    .storm-reading-card > .bureau-reading {
      width: 100%;
      justify-items: center;
      text-align: center;
    }

    .archive-reading-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 14px;
      align-items: center;
      width: 100%;
    }

    .storm-reading-card,
    .storm-facts-card {
      position: relative;
      overflow: hidden;
    }

    .storm-reading-card::before,
    .storm-facts-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, color-mix(in srgb, var(--zs-prophet-accent) 18%, transparent), transparent 40%),
        linear-gradient(180deg, rgba(255,255,255,0.12), transparent 28%);
      pointer-events: none;
    }

    .current-label,
    .facts-label {
      position: relative;
      z-index: 1;
      font-family: var(--zs-prophet-copy);
      font-size: 0.74rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--zs-prophet-muted);
    }

    .bureau-layout .temperature,
    .bureau-layout .condition,
    .bureau-layout .apparent {
      text-align: left;
    }

    .bureau-layout .temperature {
      font-size: clamp(2.5rem, 6vw, 4.1rem);
    }

    .bureau-summary {
      display: grid;
      gap: 6px;
      padding-top: 10px;
      border-top: 1px dashed color-mix(in srgb, var(--zs-prophet-border) 35%, transparent);
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
    }

    .hero-side.animated::before {
      content: "";
      position: absolute;
      inset: auto -10% 18% -10%;
      height: 84px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(255,255,255,0.38), rgba(255,255,255,0));
      animation: drift 11s ease-in-out infinite alternate;
      opacity: 0.75;
    }

    .icon-medallion {
      width: 124px;
      height: 124px;
      margin: 0 auto;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background:
        radial-gradient(circle at 50% 35%, rgba(255,255,255,0.86), rgba(214,180,122,0.75) 64%, rgba(120,79,37,0.84) 100%);
      border: 2px solid color-mix(in srgb, var(--zs-prophet-border) 72%, white);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.56), 0 16px 26px rgba(88, 57, 28, 0.18);
      font-size: 3rem;
    }

    .temperature {
      font-size: clamp(2.8rem, 7vw, 4.8rem);
      line-height: 0.92;
      text-align: center;
    }

    .condition,
    .apparent {
      font-family: var(--zs-prophet-copy);
      text-align: center;
    }

    .condition {
      font-size: 1.2rem;
      text-transform: capitalize;
    }

    .apparent {
      font-size: 1rem;
      color: var(--zs-prophet-muted);
    }

    .facts,
    .forecast,
    .almanac {
      display: grid;
      gap: 12px;
    }

    .facts {
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    }

    .forecast {
      grid-template-columns: repeat(auto-fit, minmax(94px, 1fr));
    }

    .almanac {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .fact,
    .forecast-item,
    .almanac-item,
    .alert {
      border-radius: 16px;
      border: 1px solid rgba(104, 73, 39, 0.12);
    }

    .fact,
    .almanac-item {
      padding: 12px 14px;
      background: rgba(255, 248, 230, 0.28);
    }

    .forecast-item {
      padding: 14px 12px;
      text-align: center;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.14)),
        rgba(255, 248, 230, 0.16);
    }

    .bureau-layout .forecast {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .bureau-layout .forecast-item {
      text-align: left;
      border-radius: 14px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06)),
        rgba(255,255,255,0.08);
    }

    .animated-layout .forecast {
      grid-template-columns: repeat(auto-fit, minmax(126px, 1fr));
    }

    .animated-layout .forecast-item {
      border-radius: 20px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04)),
        radial-gradient(circle at top, rgba(255,223,166,0.12), transparent 40%),
        rgba(255,255,255,0.05);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
    }

    .forecast-main {
      display: grid;
      gap: 6px;
    }

    .forecast-meta {
      display: grid;
      gap: 4px;
      margin-top: 8px;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      font-size: 0.92rem;
    }

    .forecast-condition {
      text-transform: capitalize;
    }

    .alert-list {
      display: grid;
      gap: 10px;
    }

    .bureau-layout .alert-list {
      gap: 8px;
    }

    .alert {
      padding: 14px 16px;
      background: linear-gradient(180deg, rgba(166,56,40,0.12), rgba(141,43,31,0.18));
      color: var(--zs-prophet-alert);
    }

    .bureau-layout .alert {
      border-radius: 14px;
    }

    .animated-layout .alert {
      border-radius: 18px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
    }

    .alert.info {
      background: linear-gradient(180deg, rgba(98,86,61,0.1), rgba(98,86,61,0.16));
      color: var(--zs-prophet-ink);
    }

    .alert.warning {
      background: linear-gradient(180deg, rgba(184,118,38,0.12), rgba(160,95,22,0.18));
      color: #7a4312;
    }

    .alert.critical {
      background: linear-gradient(180deg, rgba(166,56,40,0.12), rgba(141,43,31,0.18));
      color: var(--zs-prophet-alert);
    }

    .alert-kicker,
    .alert-description {
      font-family: var(--zs-prophet-copy);
    }

    .alert-kicker {
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.84rem;
      opacity: 0.85;
    }

    .alert-title {
      font-family: var(--zs-prophet-title);
      font-size: 1.1rem;
      line-height: 1.05;
    }

    .alert-description {
      margin-top: 6px;
      font-size: 0.98rem;
      line-height: 1.15;
    }

    .fact-label {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--zs-prophet-muted);
    }

    .fact-value {
      margin-top: 4px;
      font-size: 1.2rem;
    }

    .section {
      display: grid;
      gap: 12px;
    }

    .section-header {
      padding-top: 4px;
      border-top: 1px solid color-mix(in srgb, var(--zs-prophet-border) 38%, transparent);
    }

    .section-title {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 1rem;
    }

    .forecast-temp {
      margin: 8px 0;
      font-family: var(--zs-prophet-title);
      font-size: 1.35rem;
    }

    .empty {
      padding: 24px 16px;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      text-align: center;
    }

    .urithiru-layout .lead {
      background:
        linear-gradient(180deg, rgba(240,247,250,0.54), rgba(181,202,215,0.18)),
        linear-gradient(135deg, rgba(127,169,195,0.12), transparent 58%);
      border-color: rgba(84, 117, 139, 0.2);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
    }

    .urithiru-layout .storm-facts-card {
      background:
        linear-gradient(180deg, rgba(226,235,240,0.78), rgba(184,199,209,0.32)),
        linear-gradient(90deg, rgba(127,169,195,0.1), transparent 48%);
      border-color: rgba(84, 117, 139, 0.18);
    }

    .urithiru-layout .hero-side {
      background:
        radial-gradient(circle at top, rgba(210,232,246,0.38), transparent 30%),
        linear-gradient(180deg, rgba(90,117,136,0.28), rgba(45,61,74,0.1)),
        linear-gradient(180deg, rgba(224,232,238,0.92), rgba(163,178,190,0.86));
      border-color: rgba(84, 117, 139, 0.24);
    }

    .urithiru-layout .storm-reading-card {
      padding: 6px;
      background:
        linear-gradient(180deg, rgba(236,243,247,0.82), rgba(172,188,200,0.28)),
        linear-gradient(135deg, rgba(127,169,195,0.18), transparent 52%);
      border-left: 4px solid color-mix(in srgb, var(--zs-prophet-accent) 72%, white);
      border-radius: 18px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.38);
    }

    .urithiru-layout .storm-reading-card > .bureau-reading {
      padding: 0;
      justify-items: start;
      text-align: left;
    }

    .urithiru-layout .archive-reading-grid {
      padding: 0 14px 14px;
    }

    .urithiru-layout .storm-reading-card .icon-medallion {
      width: 110px;
      height: 110px;
      margin: 0;
    }

    .urithiru-layout .current-label,
    .urithiru-layout .facts-label {
      color: color-mix(in srgb, var(--zs-prophet-accent) 68%, var(--zs-prophet-ink));
    }

    .urithiru-layout .icon-medallion {
      background:
        radial-gradient(circle at 50% 30%, rgba(255,255,255,0.92), rgba(195,217,231,0.8) 56%, rgba(79,109,132,0.92) 100%);
      border-color: color-mix(in srgb, var(--zs-prophet-border) 74%, white);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.62), 0 18px 30px rgba(48, 70, 88, 0.18);
      color: #1a3342;
    }

    .urithiru-layout .fact,
    .urithiru-layout .almanac-item {
      background: rgba(229, 238, 244, 0.62);
      border-color: rgba(84, 117, 139, 0.16);
    }

    .urithiru-layout .forecast-item {
      background:
        linear-gradient(180deg, rgba(236,243,247,0.72), rgba(174,192,203,0.24)),
        rgba(255,255,255,0.12);
      border-color: rgba(84, 117, 139, 0.18);
    }

    .stormfront-layout .frame {
      background:
        linear-gradient(180deg, rgba(17,26,38,0.92), rgba(9,15,24,0.96)),
        linear-gradient(135deg, rgba(127,214,255,0.06), transparent 44%);
      color: #dceaf7;
    }

    .stormfront-layout .frame::before {
      background:
        radial-gradient(circle at 18% 12%, rgba(125,215,255,0.18), transparent 18%),
        radial-gradient(circle at 82% 24%, rgba(255,255,255,0.14), transparent 16%),
        linear-gradient(135deg, rgba(125,215,255,0.08), transparent 38%, rgba(255,255,255,0.03) 90%);
      mix-blend-mode: screen;
    }

    .stormfront-layout .animated-header,
    .stormfront-layout .animated-ribbon,
    .stormfront-layout .animated-meta,
    .stormfront-layout .eyebrow,
    .stormfront-layout .subtitle,
    .stormfront-layout .edition-row,
    .stormfront-layout .lede,
    .stormfront-layout .quote-kicker,
    .stormfront-layout .quote-meta,
    .stormfront-layout .fact-label,
    .stormfront-layout .section-meta,
    .stormfront-layout .forecast-name,
    .stormfront-layout .forecast-extra,
    .stormfront-layout .forecast-meta,
    .stormfront-layout .apparent,
    .stormfront-layout .condition,
    .stormfront-layout .animated-summary {
      color: rgba(220, 234, 247, 0.8);
    }

    .stormfront-layout .title,
    .stormfront-layout .headline,
    .stormfront-layout .temperature,
    .stormfront-layout .fact-value,
    .stormfront-layout .section-title {
      color: #f4fbff;
    }

    .stormfront-layout .animated-stage {
      border-color: rgba(98, 185, 223, 0.28);
      background:
        radial-gradient(circle at 12% 12%, rgba(127,214,255,0.16), transparent 24%),
        radial-gradient(circle at 88% 18%, rgba(255,255,255,0.08), transparent 20%),
        linear-gradient(180deg, rgba(32,48,68,0.82), rgba(9,16,27,0.96));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 36px rgba(2,7,12,0.34);
    }

    .stormfront-layout .animated-story {
      background:
        linear-gradient(180deg, rgba(17,30,45,0.72), rgba(10,17,29,0.54)),
        linear-gradient(135deg, rgba(127,214,255,0.08), transparent 60%);
      border: 1px solid rgba(98, 185, 223, 0.16);
      backdrop-filter: blur(10px);
    }

    .stormfront-layout .storm-facts-card {
      background:
        linear-gradient(180deg, rgba(16,28,42,0.72), rgba(10,16,26,0.48)),
        linear-gradient(135deg, rgba(127,214,255,0.12), transparent 58%);
      border: 1px solid rgba(98, 185, 223, 0.16);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .stormfront-layout .facts-label,
    .stormfront-layout .current-label,
    .stormfront-layout .story-kicker {
      color: #8fdfff;
      background: rgba(127,214,255,0.08);
      border-color: rgba(127,214,255,0.22);
    }

    .stormfront-layout .animated-reading-card {
      border-color: rgba(98, 185, 223, 0.28);
      background:
        radial-gradient(circle at 50% 18%, rgba(159,226,255,0.22), transparent 22%),
        linear-gradient(180deg, rgba(15,27,41,0.86), rgba(9,16,26,0.62)),
        linear-gradient(135deg, rgba(127,214,255,0.08), transparent 60%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 34px rgba(2,7,12,0.28);
    }

    .stormfront-layout .animated-reading-card::after {
      background: radial-gradient(circle, rgba(127,214,255,0.26), rgba(127,214,255,0));
    }

    .stormfront-layout .icon-medallion {
      background:
        radial-gradient(circle at 50% 28%, rgba(255,255,255,0.94), rgba(166,231,255,0.74) 48%, rgba(61,116,149,0.94) 100%);
      border-color: rgba(143,223,255,0.84);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.62), 0 0 30px rgba(127,214,255,0.22);
      color: #0f2333;
    }

    .stormfront-layout .fact,
    .stormfront-layout .forecast-item,
    .stormfront-layout .almanac-item,
    .stormfront-layout .alert {
      background:
        linear-gradient(180deg, rgba(15,27,41,0.72), rgba(8,14,24,0.54)),
        linear-gradient(135deg, rgba(127,214,255,0.05), transparent 58%);
      border-color: rgba(98, 185, 223, 0.16);
    }

    .stormfront-layout .quote-card {
      background:
        linear-gradient(180deg, rgba(17,30,45,0.82), rgba(9,17,29,0.6)),
        linear-gradient(135deg, rgba(127,214,255,0.08), transparent 60%);
      border-color: rgba(98, 185, 223, 0.16);
    }

    .navani-layout .bureau-story,
    .navani-layout .bureau-reading-card,
    .navani-layout .bureau-facts,
    .navani-layout .fact,
    .navani-layout .forecast-item,
    .navani-layout .almanac-item,
    .navani-layout .quote-card {
      background:
        linear-gradient(180deg, rgba(250,242,225,0.82), rgba(228,206,166,0.5)),
        repeating-linear-gradient(0deg, rgba(109,82,39,0.06) 0 1px, transparent 1px 28px),
        repeating-linear-gradient(90deg, rgba(109,82,39,0.05) 0 1px, transparent 1px 28px);
      border-color: rgba(152, 112, 45, 0.22);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
    }

    .navani-layout .bureau-story {
      position: relative;
      overflow: hidden;
    }

    .navani-layout .bureau-story::after {
      content: "";
      position: absolute;
      inset: 16px auto 16px 16px;
      width: 3px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(198,141,60,0.8), rgba(198,141,60,0.06));
      opacity: 0.9;
    }

    .navani-layout .story-kicker {
      background: rgba(198,141,60,0.14);
      border-style: dashed;
      border-color: rgba(152, 112, 45, 0.28);
      color: #7b5421;
    }

    .navani-layout .bureau-reading-card {
      grid-template-columns: 1fr;
      justify-items: center;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .navani-layout .bureau-reading-card::before {
      content: "";
      position: absolute;
      inset: 14px;
      border: 1px dashed rgba(152, 112, 45, 0.24);
      border-radius: 14px;
      pointer-events: none;
    }

    .navani-layout .current-label,
    .navani-layout .facts-label {
      color: #8b5d21;
    }

    .navani-layout .bureau-reading {
      justify-items: center;
      text-align: center;
    }

    .navani-layout .bureau-layout .temperature,
    .navani-layout .bureau-layout .condition,
    .navani-layout .bureau-layout .apparent {
      text-align: center;
    }

    .navani-layout .icon-medallion {
      width: 100px;
      height: 100px;
      background:
        radial-gradient(circle at 50% 30%, rgba(255,255,255,0.92), rgba(255,224,167,0.82) 48%, rgba(162,104,28,0.94) 100%);
      border-color: rgba(184,131,56,0.82);
      color: #5a390d;
    }

    .navani-layout .bureau-facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .navani-layout .fact,
    .navani-layout .almanac-item {
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    }

    .navani-layout .forecast-item {
      text-align: left;
    }

    .navani-layout .forecast-item::before {
      content: "";
      display: block;
      width: 42px;
      height: 2px;
      margin-bottom: 10px;
      background: color-mix(in srgb, var(--zs-prophet-accent) 72%, white);
      opacity: 0.8;
    }

    .navani-layout .quote-body {
      font-style: normal;
    }

    .debug-panel {
      display: grid;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px dashed color-mix(in srgb, var(--zs-prophet-border) 45%, transparent);
    }

    .debug-title {
      font-family: var(--zs-prophet-title);
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .debug-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
    }

    .debug-item {
      padding: 10px 12px;
      border-radius: 14px;
      background: rgba(255, 248, 230, 0.2);
      border: 1px solid rgba(104, 73, 39, 0.1);
    }

    .debug-label,
    .debug-value {
      font-family: var(--zs-prophet-copy);
    }

    .debug-label {
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--zs-prophet-muted);
    }

    .debug-value {
      margin-top: 4px;
      font-size: 0.98rem;
      line-height: 1.15;
      word-break: break-word;
    }

    @keyframes drift {
      from { transform: translateX(-4%); }
      to { transform: translateX(7%); }
    }

    @keyframes floatSeal {
      0% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-8px) scale(1.02); }
      100% { transform: translateY(0px) scale(1); }
    }

    @keyframes pulseGlow {
      0% { opacity: 0.45; transform: scale(0.96); }
      50% { opacity: 0.9; transform: scale(1.05); }
      100% { opacity: 0.45; transform: scale(0.96); }
    }

    @keyframes shimmer {
      from { background-position: 140% 0; }
      to { background-position: -40% 0; }
    }

    @keyframes rainFall {
      from { transform: translateY(-10px); }
      to { transform: translateY(24px); }
    }

    @media (max-width: 760px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .bureau-grid,
      .bureau-hero,
      .bureau-reading-card {
        grid-template-columns: 1fr;
      }

      .archive-header {
        grid-template-columns: 1fr;
      }

      .archive-reading-grid {
        grid-template-columns: 1fr;
      }

      .archive-sigil,
      .archive-meta {
        justify-self: start;
        text-align: left;
        justify-items: start;
      }

      .bureau-meta {
        justify-items: start;
        text-align: left;
      }

      .animated-meta {
        justify-content: flex-start;
      }

      .animated-stage {
        grid-template-columns: 1fr;
        min-height: 0;
      }

      .bureau-reading-card .icon-medallion {
        margin: 0 auto;
      }

      .bureau-layout .temperature,
      .bureau-layout .condition,
      .bureau-layout .apparent {
        text-align: center;
      }

      .hero-side {
        min-height: 0;
      }

      .title {
        font-size: clamp(1.8rem, 9vw, 2.9rem);
      }
    }
  `;

  hass?: HomeAssistant;
  config!: CardConfig;
  serviceForecast: ForecastItem[] = [];
  forecastLoading = false;
  forecastSource = 'weather_entity';
  forecastServiceStatus = 'idle';
  private lastForecastFetchKey = '';
  private forecastRequestToken = 0;

  setConfig(config: CardConfig) {
    const mergedConfig = mergeConfig(config);
    if (!mergedConfig.entity?.trim()) {
      throw new Error('`entity` is required.');
    }
    this.config = mergedConfig;
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('hass') || changedProperties.has('config')) {
      void this.refreshForecastIfNeeded();
    }
  }

  getCardSize() {
    return 6;
  }

  getGridOptions() {
    return {
      columns: 12,
      min_columns: 4,
      rows: 6,
      min_rows: 5,
    };
  }

  get language() {
    const configured = this.config?.content?.condition_labels;
    if (configured && configured !== 'auto') {
      return configured;
    }

    return getLanguage(this.hass);
  }

  get t() {
    return getTranslations(this.language);
  }

  get preset() {
    return PRESET_STYLES[this.config.style?.preset || 'urithiru_archive'] || PRESET_STYLES.urithiru_archive;
  }

  get selectedThemeVariables(): Record<string, string> {
    const themeName = this.config.style?.ha_theme;
    if (!themeName) {
      return {};
    }

    return { ...(this.hass?.themes?.themes?.[themeName] || {}) };
  }

  get selectedFacts(): FactKey[] {
    return this.config.layout?.facts?.length ? this.config.layout.facts : ['humidity', 'wind', 'pressure', 'precipitation'];
  }

  get isWeatherBureau(): boolean {
    return this.config.style?.preset === 'navani_notebook';
  }

  get isAnimatedFrontPage(): boolean {
    return this.config.style?.preset === 'stormfront_warning';
  }

  get isUrithiruArchive(): boolean {
    return !this.isAnimatedFrontPage && !this.isWeatherBureau;
  }

  get presetLayoutClass(): string {
    if (this.isAnimatedFrontPage) {
      return 'stormfront-layout';
    }

    if (this.isWeatherBureau) {
      return 'navani-layout';
    }

    return 'urithiru-layout';
  }

  get effectiveForecastMode(): 'hourly' | 'daily' {
    const configured = this.config.layout?.forecast_mode || 'daily';
    return configured === 'hourly' ? 'hourly' : 'daily';
  }

  openMoreInfo() {
    if (this.config.tap_action?.action === 'none') {
      return;
    }

    const event = new Event('hass-more-info', { bubbles: true, composed: true }) as Event & {
      detail?: { entityId: string };
    };
    event.detail = { entityId: this.config.entity };
    this.dispatchEvent(event);
  }

  computeCardStyle() {
    const density = getDensityValues(this.config.style?.density);

    return {
      ...this.selectedThemeVariables,
      '--zs-prophet-card-bg': this.config.style?.background || this.preset.cardBackground,
      '--zs-prophet-paper': this.config.style?.paper_color || this.preset.paper,
      '--zs-prophet-ink': this.config.style?.ink_color || this.preset.ink,
      '--zs-prophet-muted': this.preset.muted,
      '--zs-prophet-accent': this.config.style?.accent_color || this.preset.accent,
      '--zs-prophet-accent-soft': this.preset.accentSoft,
      '--zs-prophet-border': this.config.style?.accent_color || this.preset.border,
      '--zs-prophet-alert': this.preset.alert,
      '--zs-prophet-shadow': this.preset.shadow,
      '--zs-prophet-card-padding': density.cardPadding,
      '--zs-prophet-gap': density.gap,
      '--zs-prophet-hero-padding': density.heroPadding,
    };
  }

  getForecastModeLabel(mode: 'hourly' | 'daily') {
    return this.t.forecastModeLabels[mode] || mode;
  }

  async fetchForecastFromService(forecastType: 'hourly' | 'daily'): Promise<ForecastItem[]> {
    const callApi = this.hass?.callApi;
    if (!callApi || !this.config?.entity) {
      return [];
    }

    const attempts = [
      {
        path: 'services/weather/get_forecasts?return_response',
        body: {
          target: { entity_id: [this.config.entity] },
          data: { type: forecastType },
        },
      },
      {
        path: 'services/weather/get_forecasts?return_response=true',
        body: {
          target: { entity_id: [this.config.entity] },
          data: { type: forecastType },
        },
      },
      {
        path: 'services/weather/get_forecasts?return_response',
        body: {
          entity_id: this.config.entity,
          type: forecastType,
        },
      },
    ];

    for (const attempt of attempts) {
      try {
        const response = await callApi('POST', attempt.path, attempt.body);
        const forecast = extractForecastResponse(response, this.config.entity);
        if (forecast.length) {
          return forecast;
        }
      } catch {
        continue;
      }
    }

    return [];
  }

  async refreshForecastIfNeeded() {
    if (!this.hass || !this.config) {
      return;
    }

    if (this.config.entities?.forecast_entity) {
      this.forecastSource = 'forecast_entity';
      this.forecastServiceStatus = 'skipped';
      if (this.serviceForecast.length) {
        this.serviceForecast = [];
      }
      return;
    }

    const weatherEntity = this.hass.states?.[this.config.entity] as any;
    const directForecast = weatherEntity?.attributes?.forecast;
    if (Array.isArray(directForecast) && directForecast.length) {
      this.forecastSource = 'weather_entity';
      this.forecastServiceStatus = 'skipped';
      if (this.serviceForecast.length) {
        this.serviceForecast = [];
      }
      return;
    }

    const fetchKey = [
      this.config.entity,
      this.effectiveForecastMode,
      weatherEntity?.state || '',
      weatherEntity?.attributes?.temperature ?? '',
      weatherEntity?.last_updated || '',
    ].join('|');

    if (fetchKey === this.lastForecastFetchKey) {
      return;
    }

    this.lastForecastFetchKey = fetchKey;
    const requestToken = ++this.forecastRequestToken;
    this.forecastLoading = true;
    this.forecastServiceStatus = 'loading';

    const primaryForecast = await this.fetchForecastFromService(this.effectiveForecastMode);
    const fallbackForecast = !primaryForecast.length && this.effectiveForecastMode === 'daily'
      ? await this.fetchForecastFromService('hourly')
      : [];

    if (requestToken !== this.forecastRequestToken) {
      return;
    }

    this.serviceForecast = primaryForecast.length ? primaryForecast : fallbackForecast;
    this.forecastSource = this.serviceForecast.length ? 'weather_service' : 'unavailable';
    this.forecastServiceStatus = this.serviceForecast.length ? 'ok' : 'unavailable';
    this.forecastLoading = false;
  }

  renderDebugPanel(forecastMode: 'hourly' | 'daily', forecastItems: ForecastItem[]) {
    if (this.config.style?.debug !== true) {
      return '';
    }

    const debugItems = [
      { label: this.t.debugLabels.weather_entity, value: this.config.entity || '-' },
      { label: this.t.debugLabels.forecast_entity, value: this.config.entities?.forecast_entity || '-' },
      { label: this.t.debugLabels.forecast_source, value: this.forecastSource },
      { label: this.t.debugLabels.service_status, value: this.forecastServiceStatus },
      { label: this.t.debugLabels.forecast_mode, value: forecastMode },
      { label: this.t.debugLabels.forecast_items, value: String(forecastItems.length) },
    ];

    return html`
      <section class="debug-panel">
        <div class="debug-title">${this.t.debugTitle}</div>
        <div class="debug-grid">
          ${debugItems.map((item) => html`
            <div class="debug-item">
              <div class="debug-label">${item.label}</div>
              <div class="debug-value">${item.value}</div>
            </div>
          `)}
        </div>
      </section>
    `;
  }

  renderForecastItem(item: ForecastItem, mode: 'hourly' | 'daily') {
    const conditionLabel = this.t.conditions[item.condition as keyof typeof this.t.conditions] || item.condition || '';
    const rainChance = item.precipitation_probability !== undefined ? `${this.t.chanceOfRain}: ${Math.round(item.precipitation_probability)}%` : '';
    const precipitation = item.precipitation !== undefined ? `${item.precipitation.toFixed(1)} mm` : '';
    const wind = item.wind_speed !== undefined ? `${this.t.windShort}: ${Math.round(item.wind_speed)}` : '';

    return html`
      <div class="forecast-item">
        <div class="forecast-name">${formatForecastLabel(item, mode)}</div>
        <div class="forecast-main">
          <div class="forecast-temp">${mode === 'hourly'
            ? (item.temperature !== undefined ? `${Math.round(item.temperature)}°` : '-')
            : formatForecastTemperature(item, this.language)}</div>
          <div class="forecast-extra forecast-condition">${getConditionIcon(item.condition || 'cloudy')} ${conditionLabel}</div>
        </div>
        <div class="forecast-meta">
          ${rainChance ? html`<div>${rainChance}</div>` : ''}
          ${precipitation ? html`<div>${precipitation}</div>` : ''}
          ${wind ? html`<div>${wind}</div>` : ''}
        </div>
      </div>
    `;
  }

  renderHeader(snapshot: ReturnType<typeof createWeatherSnapshot>) {
    if (this.config.style?.show_masthead === false) {
      return '';
    }

    if (!this.isWeatherBureau && !this.isAnimatedFrontPage) {
      return html`
        <div class="masthead">
          <div class="archive-header">
            <div class="archive-sigil" aria-hidden="true"></div>
            <div class="archive-copy">
              <div class="eyebrow">${this.t.eyebrow}</div>
              <div class="title">${this.config.title || this.t.defaultTitle}</div>
              ${this.config.subtitle ? html`<div class="subtitle">${this.config.subtitle}</div>` : ''}
            </div>
            <div class="archive-meta">
              <div class="archive-meta-chip">${this.t.archiveStamp}</div>
              <div>${snapshot.friendlyName}</div>
              <div>${this.t.updated}: ${snapshot.lastUpdatedLabel}</div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.isAnimatedFrontPage) {
      return html`
        <div class="animated-header">
          <div class="animated-ribbon">${this.t.eyebrow}</div>
          <div class="animated-grid">
            <div class="bureau-title">
              <div class="title">${this.config.title || this.t.defaultTitle}</div>
              ${this.config.subtitle ? html`<div class="subtitle">${this.config.subtitle}</div>` : ''}
            </div>
            <div class="animated-meta">
              <div>${this.t.updated}: ${snapshot.lastUpdatedLabel}</div>
              <div>${snapshot.friendlyName}</div>
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="bureau-header">
        <div class="bureau-bar">
          <div class="bureau-stamp">${this.t.eyebrow}</div>
          <div class="bureau-stamp">${snapshot.friendlyName}</div>
        </div>
        <div class="bureau-grid">
          <div class="bureau-title">
            <div class="title">${this.config.title || this.t.defaultTitle}</div>
            ${this.config.subtitle ? html`<div class="subtitle">${this.config.subtitle}</div>` : ''}
          </div>
          <div class="bureau-meta">
            <div>${this.t.updated}: ${snapshot.lastUpdatedLabel}</div>
            <div>${snapshot.state}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderQuoteBlock(snapshot: ReturnType<typeof createWeatherSnapshot>, forecastItems: ForecastItem[]) {
    if (this.config.content?.show_quotes === false) {
      return '';
    }

    const quote = selectQuote({
      language: this.language,
      snapshot,
      forecast: forecastItems,
      rotation: this.config.content?.quote_rotation || 'hybrid',
      characters: this.config.content?.quote_characters,
    });

    if (!quote) {
      return '';
    }

    return html`
      <aside class="quote-card">
        <div class="quote-kicker">${this.t.quoteTitle}</div>
        <div class="quote-body">"${quote.text}"</div>
        <div class="quote-meta">
          <span>${this.t.quoteInspiredBy}: ${quote.characterLabel}</span>
          <span>${quote.rotationLabel}</span>
        </div>
      </aside>
    `;
  }

  renderHero(
    snapshot: ReturnType<typeof createWeatherSnapshot>,
    headline: string,
    facts: ReturnType<typeof buildFacts>,
    conditionLabel: string,
    forecastItems: ForecastItem[],
  ) {
    if (!this.isWeatherBureau && !this.isAnimatedFrontPage) {
      return html`
        <section class="hero">
          <div class="lead">
            <div class="lead-copy">
              <div class="edition-row">
                <span>${snapshot.friendlyName}</span>
                <span>${this.t.updated}: ${snapshot.lastUpdatedLabel}</span>
              </div>
              <div class="story-kicker">${this.t.currentTitle}</div>
              ${headline ? html`<div class="headline">${headline}</div>` : ''}
              <div class="lede">${snapshot.attribution || this.config.location || snapshot.friendlyName}</div>
              ${this.renderQuoteBlock(snapshot, forecastItems)}
            </div>
            <div class="facts storm-facts-card">
              <div class="facts-label">${this.t.factsTitle}</div>
              ${facts.map((fact) => html`
                <div class="fact">
                  <div class="fact-label">${fact.label}</div>
                  <div class="fact-value">${fact.value}</div>
                </div>
              `)}
            </div>
          </div>

          <div class=${`hero-side ${this.config.style?.animated_hero ? 'animated' : ''}`}>
            <div class="storm-reading-card">
              <div class="current-label">${this.t.currentTitle}</div>
              <div class="archive-reading-grid">
                <div class="icon-medallion">${getConditionIcon(snapshot.condition)}</div>
                <div class="bureau-reading">
                  <div class="temperature">${snapshot.temperature !== undefined ? `${Math.round(snapshot.temperature)}°` : '-'}</div>
                  <div class="condition">${conditionLabel}</div>
                  <div class="apparent">
                    ${this.t.feelsLike}: ${snapshot.apparentTemperature !== undefined ? `${Math.round(snapshot.apparentTemperature)}°` : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    if (this.isAnimatedFrontPage) {
      const stageClass = `animated-stage condition-${snapshot.condition || 'cloudy'}`;
      return html`
        <section class="hero animated-hero">
          <div class=${stageClass}>
            <div class="animated-sky" aria-hidden="true">
              <div class="animated-cloud a"></div>
              <div class="animated-cloud b"></div>
              <div class="animated-rain"></div>
            </div>

            <div class="animated-story">
              <div class="edition-row">
                <span>${snapshot.friendlyName}</span>
                <span>${this.t.updated}: ${snapshot.lastUpdatedLabel}</span>
              </div>
              <div class="story-kicker">${this.t.currentTitle}</div>
              ${headline ? html`<div class="headline">${headline}</div>` : ''}
              <div class="lede">${snapshot.attribution || this.config.location || snapshot.friendlyName}</div>
              ${this.renderQuoteBlock(snapshot, forecastItems)}
              <div class="facts storm-facts-card">
                <div class="facts-label">${this.t.factsTitle}</div>
                ${facts.map((fact) => html`
                  <div class="fact">
                    <div class="fact-label">${fact.label}</div>
                    <div class="fact-value">${fact.value}</div>
                  </div>
                `)}
              </div>
            </div>

            <div class=${`animated-reading-card ${this.config.style?.animated_hero ? 'animated' : ''}`}>
              <div class="current-label">${this.t.currentTitle}</div>
              <div class="icon-medallion">${getConditionIcon(snapshot.condition)}</div>
              <div class="animated-reading">
                <div class="temperature">${snapshot.temperature !== undefined ? `${Math.round(snapshot.temperature)}°` : '-'}</div>
                <div class="condition">${conditionLabel}</div>
                <div class="apparent">
                  ${this.t.feelsLike}: ${snapshot.apparentTemperature !== undefined ? `${Math.round(snapshot.apparentTemperature)}°` : '-'}
                </div>
                <div class="animated-summary">
                  <div>${headline || conditionLabel}</div>
                  <div>${snapshot.state}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    return html`
      <section class="hero bureau-hero">
        <div class="bureau-story">
          <div class="edition-row">
            <span>${snapshot.friendlyName}</span>
            <span>${this.t.updated}: ${snapshot.lastUpdatedLabel}</span>
          </div>
          <div class="story-kicker">${this.t.currentTitle}</div>
          ${headline ? html`<div class="headline">${headline}</div>` : ''}
          <div class="lede">${snapshot.attribution || this.config.location || snapshot.friendlyName}</div>
          ${this.renderQuoteBlock(snapshot, forecastItems)}
        </div>

        <div class="bureau-side">
          <div class="bureau-reading-card">
            <div class="current-label">${this.t.currentTitle}</div>
            <div class="icon-medallion">${getConditionIcon(snapshot.condition)}</div>
            <div class="bureau-reading">
              <div class="temperature">${snapshot.temperature !== undefined ? `${Math.round(snapshot.temperature)}°` : '-'}</div>
              <div class="condition">${conditionLabel}</div>
              <div class="apparent">
                ${this.t.feelsLike}: ${snapshot.apparentTemperature !== undefined ? `${Math.round(snapshot.apparentTemperature)}°` : '-'}
              </div>
              <div class="bureau-summary">
                <div>${conditionLabel}</div>
                <div>${snapshot.friendlyName}</div>
              </div>
            </div>
          </div>

          <div class="bureau-facts storm-facts-card">
            <div class="facts-label">${this.t.factsTitle}</div>
            ${facts.map((fact) => html`
              <div class="fact">
                <div class="fact-label">${fact.label}</div>
                <div class="fact-value">${fact.value}</div>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  }

  render() {
    if (!this.config || !this.hass) {
      return html`<ha-card><div class="empty">Loading archive...</div></ha-card>`;
    }

    const snapshot = createWeatherSnapshot(this.hass, this.config);
    const facts = buildFacts(snapshot, this.selectedFacts, this.language);
    const headline = this.config.content?.headline_mode === 'none'
      ? ''
      : this.config.content?.headline_mode === 'custom' && this.config.content.headline_template
        ? this.config.content.headline_template
        : buildHeadline(snapshot, this.language);
    const combinedForecast = snapshot.forecast.length ? snapshot.forecast : this.serviceForecast;
    const forecastItems = combinedForecast.slice(0, this.config.layout?.forecast_items || 5);
    const forecastMode = resolveForecastMode(this.config.layout?.forecast_mode || 'daily', combinedForecast);
    const conditionLabel = this.t.conditions[snapshot.condition as keyof typeof this.t.conditions] || snapshot.condition;

    return html`
      <ha-card style=${styleMap(this.computeCardStyle())} @click=${() => this.openMoreInfo()}>
        <div class=${`frame ${this.config.style?.paper_texture === false ? '' : 'paper-texture'} ${this.isWeatherBureau ? 'bureau-layout' : ''} ${this.isAnimatedFrontPage ? 'animated-layout' : ''} ${this.presetLayoutClass}`}>
          ${this.renderHeader(snapshot)}

          ${this.renderHero(snapshot, headline, facts, conditionLabel, forecastItems)}

          ${this.config.style?.show_alerts === false || !snapshot.alerts.length ? '' : html`
            <section class="section">
              <div class="section-header">
                <div class="section-title">${this.t.specialEdition}</div>
              </div>
              <div class="alert-list">
                ${snapshot.alerts.map((alert) => html`
                  <div class=${`alert ${alert.severity}`}>
                    <div class="alert-kicker">${formatAlertSeverity(alert, this.language)}</div>
                    <div class="alert-title">${alert.title}</div>
                    ${alert.description ? html`<div class="alert-description">${alert.description}</div>` : ''}
                  </div>
                `)}
              </div>
            </section>
          `}

          ${this.config.style?.show_forecast === false ? '' : html`
            <section class="section">
              <div class="section-header">
              <div class="section-title">${this.t.forecastTitle}</div>
              <div class="section-meta">${this.getForecastModeLabel(forecastMode)}</div>
            </div>
              ${forecastItems.length
                ? html`<div class="forecast">${forecastItems.map((item) => this.renderForecastItem(item, forecastMode))}</div>`
                : html`<div class="empty">${this.t.noForecast}</div>`}
            </section>
          `}

          ${this.config.style?.show_almanac === false ? '' : html`
            <section class="section">
              <div class="section-header">
                <div class="section-title">${this.t.almanacTitle}</div>
                <div class="section-meta">${snapshot.state}</div>
              </div>
              <div class="almanac">
                <div class="almanac-item">
                  <div class="fact-label">${this.t.facts.sunrise}</div>
                  <div class="fact-value">${formatTime(snapshot.sunrise)}</div>
                </div>
                <div class="almanac-item">
                  <div class="fact-label">${this.t.facts.sunset}</div>
                  <div class="fact-value">${formatTime(snapshot.sunset)}</div>
                </div>
              </div>
            </section>
          `}

          ${this.renderDebugPanel(forecastMode, forecastItems)}
        </div>
      </ha-card>
    `;
  }
}

customElements.define(CARD_TAG, ZSDailyProphetCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TAG,
  name: 'ZS Stormlight Weather Card',
  preview: true,
  description: 'Stormlight Archive inspired weather card for Home Assistant',
  documentationURL: 'https://github.com/bwrwk/zs-stormlight-weather-card',
});

