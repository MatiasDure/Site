export type WeatherSnapshotStatus = 'available' | 'unavailable';

interface WeatherSnapshotBase {
  locationLabel: string;
  status: WeatherSnapshotStatus;
}

export interface AvailableWeatherSnapshot extends WeatherSnapshotBase {
  status: 'available';
  temperatureC: number;
  apparentTemperatureC: number | null;
  weatherCode: number;
  isDay: boolean;
  windSpeedKmh: number | null;
  weatherLabel: string;
}

export interface UnavailableWeatherSnapshot extends WeatherSnapshotBase {
  status: 'unavailable';
  reason: 'invalid-response' | 'missing-config' | 'upstream-error';
}

export type WeatherSnapshot = AvailableWeatherSnapshot | UnavailableWeatherSnapshot;