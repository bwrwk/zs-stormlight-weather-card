import { getTranslations, type LocaleKey } from './i18n';
import type { ForecastItem, QuoteCharacter, WeatherSnapshot } from './types';

type QuoteWeatherTag = 'any' | 'storm' | 'rain' | 'wind' | 'sun' | 'cold' | 'cloud';

type QuoteEntry = {
  character: QuoteCharacter;
  weather: QuoteWeatherTag[];
  text: Record<LocaleKey, string>;
};

export type SelectedQuote = {
  character: QuoteCharacter;
  characterLabel: string;
  text: string;
  rotationLabel: string;
};

const QUOTES: QuoteEntry[] = [
  {
    character: 'kaladin',
    weather: ['storm', 'wind', 'rain'],
    text: {
      pl: 'Wiatr nigdy nie pyta, czy jesteś gotów. Możesz tylko stanąć pewnie i oddychać razem z nim.',
      en: 'The wind never asks whether you are ready. You just plant your feet and breathe with it.',
    },
  },
  {
    character: 'kaladin',
    weather: ['cloud', 'cold', 'any'],
    text: {
      pl: 'Nawet najcięższe niebo w końcu pęka. Trzeba tylko wytrzymać do światła.',
      en: 'Even the heaviest sky breaks eventually. You only have to hold until the light returns.',
    },
  },
  {
    character: 'shallan',
    weather: ['sun', 'cloud', 'any'],
    text: {
      pl: 'Pogoda też nosi maski. Czasem trzeba spojrzeć dwa razy, by zobaczyć, czy chmura nie udaje światła.',
      en: 'Weather wears masks too. Sometimes you need a second glance to see whether a cloud is pretending to be light.',
    },
  },
  {
    character: 'shallan',
    weather: ['rain', 'storm'],
    text: {
      pl: 'Deszcz poprawia kontury świata. Wszystko staje się bardziej dramatyczne, a więc odrobinę bardziej szczere.',
      en: 'Rain sharpens the world\'s lines. Everything turns more dramatic, and therefore a bit more honest.',
    },
  },
  {
    character: 'adolin',
    weather: ['sun', 'wind', 'any'],
    text: {
      pl: 'Dobra pogoda jest jak dobrze skrojony mundur. Nie wygrywa za ciebie bitwy, ale pomaga wejść w nią z podniesioną głową.',
      en: 'Good weather is like a well-cut uniform. It does not win the battle for you, but it helps you step into it proudly.',
    },
  },
  {
    character: 'adolin',
    weather: ['storm', 'rain'],
    text: {
      pl: 'Jeśli nadciąga burza, przynajmniej nadciąga z rozmachem. Szanuję to.',
      en: 'If a storm is coming, at least it arrives with style. I can respect that.',
    },
  },
  {
    character: 'dalinar',
    weather: ['storm', 'wind', 'any'],
    text: {
      pl: 'Burza nie jest wrogiem ani sprzymierzeńcem. Jest próbą. To my wybieramy, jak ją przejdziemy.',
      en: 'The storm is neither enemy nor ally. It is a test. We decide how we walk through it.',
    },
  },
  {
    character: 'dalinar',
    weather: ['sun', 'cloud', 'any'],
    text: {
      pl: 'Spokojne niebo także wymaga dyscypliny. Łatwo zmarnować jasny dzień, jeśli uzna się go za rzecz należną.',
      en: 'A calm sky requires discipline too. Bright days are easy to waste when we treat them as owed to us.',
    },
  },
  {
    character: 'navani',
    weather: ['storm', 'rain', 'wind'],
    text: {
      pl: 'Każda burza zostawia wzór. Jeśli umiemy go odczytać, ostrzeżenie staje się wiedzą.',
      en: 'Every storm leaves a pattern. If we can read it, warning becomes knowledge.',
    },
  },
  {
    character: 'navani',
    weather: ['sun', 'cloud', 'any'],
    text: {
      pl: 'Lubię pogodę, którą da się zmierzyć, a jeszcze bardziej tę, która po pomiarze wciąż potrafi zaskoczyć.',
      en: 'I admire weather that can be measured, and even more the kind that still surprises after measurement.',
    },
  },
  {
    character: 'rock',
    weather: ['cold', 'wind', 'rain'],
    text: {
      pl: 'Gdy wiatr gryzie, trzeba mieć gorący garnek i lepszych przyjaciół. Najlepiej jedno i drugie.',
      en: 'When the wind bites, you need a hot pot and better friends. Best to have both.',
    },
  },
  {
    character: 'rock',
    weather: ['sun', 'any'],
    text: {
      pl: 'Słońce jest dobre. Pod takim niebem nawet zupa wie, że trzeba się bardziej postarać.',
      en: 'Sun is good. Under that kind of sky even the stew knows it ought to do its best.',
    },
  },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function classifyWeather(condition: string): QuoteWeatherTag {
  if (['lightning', 'lightning_rainy', 'pouring'].includes(condition)) {
    return 'storm';
  }

  if (['rainy', 'hail', 'snowy_rainy'].includes(condition)) {
    return 'rain';
  }

  if (['windy', 'windy_variant'].includes(condition)) {
    return 'wind';
  }

  if (['sunny', 'clear_night'].includes(condition)) {
    return 'sun';
  }

  if (['snowy', 'fog'].includes(condition)) {
    return 'cold';
  }

  return 'cloud';
}

function createForecastSignature(forecast: ForecastItem[]): string {
  return forecast
    .slice(0, 4)
    .map((item) => [item.datetime || '', item.condition || '', item.temperature ?? '', item.templow ?? ''].join(':'))
    .join('|');
}

function createRotationKey(
  snapshot: WeatherSnapshot,
  forecast: ForecastItem[],
  rotation: 'forecast' | 'twice_daily' | 'hybrid',
): string {
  const now = new Date();
  const halfdayBucket = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours() < 12 ? 'daywatch' : 'nightwatch'}`;
  const forecastSignature = `${snapshot.condition}|${snapshot.temperature ?? ''}|${createForecastSignature(forecast)}`;

  if (rotation === 'forecast') {
    return forecastSignature;
  }

  if (rotation === 'twice_daily') {
    return halfdayBucket;
  }

  return `${forecastSignature}|${halfdayBucket}`;
}

export function selectQuote(options: {
  language: LocaleKey;
  snapshot: WeatherSnapshot;
  forecast: ForecastItem[];
  rotation?: 'forecast' | 'twice_daily' | 'hybrid';
  characters?: QuoteCharacter[];
}): SelectedQuote | undefined {
  const language = options.language;
  const t = getTranslations(language);
  const rotation = options.rotation || 'hybrid';
  const weatherTag = classifyWeather(options.snapshot.condition);
  const allowedCharacters = options.characters?.length ? options.characters : undefined;

  const pool = QUOTES.filter((quote) => {
    const characterMatch = !allowedCharacters || allowedCharacters.includes(quote.character);
    const weatherMatch = quote.weather.includes('any') || quote.weather.includes(weatherTag);
    return characterMatch && weatherMatch;
  });

  const finalPool = pool.length ? pool : QUOTES.filter((quote) => !allowedCharacters || allowedCharacters.includes(quote.character));
  if (!finalPool.length) {
    return undefined;
  }

  const seed = createRotationKey(options.snapshot, options.forecast, rotation);
  const selected = finalPool[hashString(seed) % finalPool.length];

  return {
    character: selected.character,
    characterLabel: t.characterNames[selected.character] || selected.character,
    text: selected.text[language],
    rotationLabel: t.quoteRotation[rotation],
  };
}
