# ZS Stormlight Weather Card

Karta pogodowa do Home Assistanta inspirowana klimatem "Archiwum burzowego światła".

## Status

Pierwsza wersja repo zawiera:

- trzy presety wizualne inspirowane Roshar em
- pełną obsługę języka polskiego i angielskiego
- prognozę opartą o `weather.*` i `weather.get_forecasts`
- sekcję ostrzeżeń pogodowych
- rotujące cytaty inspirowane stylem Kaladina, Shallan, Adolina, Dalinara, Navani i Skały
- konfigurację YAML oraz wizualny editor głównych opcji

## Presety

- `urithiru_archive`
- `stormfront_warning`
- `navani_notebook`

`urithiru_archive` to najbardziej zbalansowany wariant startowy.

`stormfront_warning` jest bardziej dramatyczny i najlepiej wygląda przy animowanej warstwie burzy.

`navani_notebook` ma bardziej techniczny, badawczy charakter.

## Cytaty

Karta korzysta z autorskich cytatów inspirowanych stylem postaci, a nie z dosłownych cytatów z książek.

Możesz sterować ich działaniem przez:

- `content.show_quotes`
- `content.quote_rotation`
- `content.quote_characters`

Dostępne tryby rotacji:

- `forecast` - zmiana, gdy zmienia się podpis prognozy
- `twice_daily` - zmiana dwa razy dziennie
- `hybrid` - zmiana przy prognozie lub zmianie pory dnia

## Przykład

```yaml
type: custom:zs-stormlight-weather-card
entity: weather.home
title: Archiwum Burzowego Światła
subtitle: Raport pogodowy Rosharu
location: Urithiru i okolice
style:
  preset: urithiru_archive
  density: comfortable
  paper_texture: true
  animated_hero: true
  show_masthead: true
  show_almanac: true
  show_forecast: true
  show_alerts: true
layout:
  forecast_mode: auto
  forecast_items: 5
  facts:
    - humidity
    - wind
    - pressure
    - precipitation
content:
  headline_mode: auto
  condition_labels: pl
  show_quotes: true
  quote_rotation: hybrid
  quote_characters:
    - kaladin
    - shallan
    - dalinar
    - navani
entities:
  forecast_entity: sensor.weather_home_daily
  forecast_attribute: forecast
  humidity: sensor.outdoor_humidity
  pressure: sensor.outdoor_pressure
  wind_speed: sensor.wind_speed
  wind_bearing: sensor.wind_bearing
  apparent_temperature: sensor.feels_like
  sunrise: sensor.sun_next_rising
  sunset: sensor.sun_next_setting
  alerts:
    - binary_sensor.weather_warning
```

## Dane

Podstawowym źródłem jest `weather.*`.

- `entity: weather.home` dostarcza bieżące warunki i domyślne dane prognozy.
- Karta próbuje też pobrać prognozę przez usługę Home Assistanta `weather.get_forecasts`.
- Jeżeli Twoja integracja nie zwraca prognozy bezpośrednio, użyj `entities.forecast_entity`.

## Development

```bash
npm install
npm test
npm run build
```
