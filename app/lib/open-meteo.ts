import type { UnavailableWeatherSnapshot, WeatherSnapshot } from '@/app/types';

const OPEN_METEO_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';
const WEATHER_FETCH_REVALIDATE_SECONDS = 600;
const ENSCHEDE_LATITUDE = 52.2215;
const ENSCHEDE_LONGITUDE = 6.8937;
const ENSCHEDE_LOCATION_LABEL = 'Enschede, The Netherlands';

const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snowfall',
  73: 'Moderate snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

interface OpenMeteoCurrentWeatherResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    is_day?: number;
    wind_speed_10m?: number;
  };
}

function createUnavailableWeatherSnapshot(
  reason: UnavailableWeatherSnapshot['reason']
): UnavailableWeatherSnapshot {
  return {
    locationLabel: ENSCHEDE_LOCATION_LABEL,
    status: 'unavailable',
    reason,
  };
}

function getFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function getWeatherLabel(weatherCode: number): string {
  return WEATHER_LABELS[weatherCode] ?? 'Unknown conditions';
}

function buildWeatherUrl(): string {
  const url = new URL(OPEN_METEO_ENDPOINT);

  url.searchParams.set('latitude', String(ENSCHEDE_LATITUDE));
  url.searchParams.set('longitude', String(ENSCHEDE_LONGITUDE));
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m'
  );
  url.searchParams.set('timezone', 'auto');

  return url.toString();
}

export async function getWeatherSnapshot(): Promise<WeatherSnapshot> {
  try {
    const response = await fetch(buildWeatherUrl(), {
      next: { revalidate: WEATHER_FETCH_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return createUnavailableWeatherSnapshot('upstream-error');
    }

    const data = (await response.json()) as OpenMeteoCurrentWeatherResponse;
    const current = data.current;

    if (!current) {
      return createUnavailableWeatherSnapshot('invalid-response');
    }

    const temperatureC = getFiniteNumber(current.temperature_2m);
    const apparentTemperatureC = getFiniteNumber(current.apparent_temperature);
    const weatherCode = getFiniteNumber(current.weather_code);
    const windSpeedKmh = getFiniteNumber(current.wind_speed_10m);

    if (temperatureC === null || weatherCode === null || current.is_day === undefined) {
      return createUnavailableWeatherSnapshot('invalid-response');
    }

    return {
      locationLabel: ENSCHEDE_LOCATION_LABEL,
      status: 'available',
      temperatureC,
      apparentTemperatureC,
      weatherCode,
      isDay: current.is_day === 1,
      windSpeedKmh,
      weatherLabel: getWeatherLabel(weatherCode),
    };
  } catch {
    return createUnavailableWeatherSnapshot('upstream-error');
  }
}