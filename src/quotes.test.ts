import { describe, expect, it } from 'vitest';
import { selectQuote } from './quotes';
import type { WeatherSnapshot } from './types';

const snapshot: WeatherSnapshot = {
  entityId: 'weather.home',
  state: 'rainy',
  condition: 'rainy',
  temperature: 11,
  apparentTemperature: 9,
  humidity: 77,
  pressure: 1008,
  windSpeed: 21,
  windBearing: 230,
  visibility: 7,
  uvIndex: 1.2,
  cloudCoverage: 82,
  precipitation: 3.4,
  sunrise: '2026-03-27T06:00:00+01:00',
  sunset: '2026-03-27T18:20:00+01:00',
  friendlyName: 'Urithiru',
  attribution: '',
  forecast: [],
  alerts: [],
  lastUpdatedLabel: 'Mar 27, 2026, 8:00 AM',
};

describe('selectQuote', () => {
  it('returns a deterministic quote for a chosen character pool', () => {
    const quote = selectQuote({
      language: 'pl',
      snapshot,
      forecast: [
        {
          datetime: '2026-03-27T12:00:00+01:00',
          temperature: 10,
          condition: 'rainy',
        },
      ],
      rotation: 'forecast',
      characters: ['navani'],
    });

    expect(quote?.character).toBe('navani');
    expect(quote?.text).toContain('wzór');
  });
});
