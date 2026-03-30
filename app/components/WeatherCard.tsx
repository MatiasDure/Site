import type { UnavailableWeatherSnapshot, WeatherSnapshot } from '@/app/types';

interface WeatherCardProps {
  snapshot: WeatherSnapshot;
}

const WEATHER_UNAVAILABLE_LABELS: Record<UnavailableWeatherSnapshot['reason'], string> = {
  'invalid-response': 'Weather data is temporarily unavailable.',
  'missing-config': 'Weather data is not configured yet.',
  'upstream-error': 'Weather data is temporarily unavailable.',
};

const NUMBER_FORMATTER = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
});

function formatTemperature(value: number): string {
  return `${NUMBER_FORMATTER.format(value)}°C`;
}

function formatWindSpeed(value: number | null): string {
  return value === null ? 'Unavailable' : `${NUMBER_FORMATTER.format(value)} km/h`;
}

export default function WeatherCard({ snapshot }: WeatherCardProps) {
  if (snapshot.status === 'unavailable') {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">{snapshot.locationLabel}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {WEATHER_UNAVAILABLE_LABELS[snapshot.reason]}
            </p>
          </div>
          <span className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Unavailable
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">{snapshot.locationLabel}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatTemperature(snapshot.temperatureC)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{snapshot.weatherLabel}</p>
        </div>
        <span className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {snapshot.isDay ? 'Daytime' : 'Night'}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-surface-muted px-3 py-2">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Feels like</dt>
          <dd className="mt-1 font-medium text-foreground">
            {snapshot.apparentTemperatureC === null
              ? 'Unavailable'
              : formatTemperature(snapshot.apparentTemperatureC)}
          </dd>
        </div>
        <div className="rounded-lg bg-surface-muted px-3 py-2">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Wind</dt>
          <dd className="mt-1 font-medium text-foreground">
            {formatWindSpeed(snapshot.windSpeedKmh)}
          </dd>
        </div>
      </dl>
    </div>
  );
}