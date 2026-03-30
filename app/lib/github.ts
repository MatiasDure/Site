import type {
  AvailableGitHubContributionGrid,
  GitHubActivityLevel,
  GitHubContributionDay,
  GitHubContributionGrid,
} from '@/app/types';

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const GITHUB_FETCH_REVALIDATE_SECONDS = 600;
const GITHUB_ACTIVITY_LEVEL_THRESHOLDS = [0, 1, 2, 3, 5] as const;
const GITHUB_UNAVAILABLE_MESSAGE = 'GitHub contribution activity is unavailable right now.';

const GITHUB_CONTRIBUTION_QUERY = `
  query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

interface GitHubContributionCalendarResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: number;
          weeks?: Array<{
            contributionDays?: Array<{
              contributionCount?: number;
              contributionLevel?: string;
              date?: string;
              weekday?: number;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message?: string }>;
}

function getUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getPastYearRange() {
  const endedAtDate = getUtcDay(new Date());
  const startedAtDate = addUtcDays(endedAtDate, -364);

  return {
    startedAtDate,
    endedAtDate,
    startedAt: toIsoDate(startedAtDate),
    endedAt: toIsoDate(endedAtDate),
  };
}

function createUnavailableGitHubContributionGrid(
  startedAt: string,
  endedAt: string,
  message = GITHUB_UNAVAILABLE_MESSAGE,
): GitHubContributionGrid {
  return {
    startedAt,
    endedAt,
    status: 'unavailable',
    days: [],
    totalContributions: 0,
    message,
  };
}

function getActivityLevel(contributionCount: number): GitHubActivityLevel {
  if (contributionCount >= GITHUB_ACTIVITY_LEVEL_THRESHOLDS[4]) {
    return 'very-high';
  }

  if (contributionCount >= GITHUB_ACTIVITY_LEVEL_THRESHOLDS[3]) {
    return 'high';
  }

  if (contributionCount >= GITHUB_ACTIVITY_LEVEL_THRESHOLDS[2]) {
    return 'medium';
  }

  if (contributionCount >= GITHUB_ACTIVITY_LEVEL_THRESHOLDS[1]) {
    return 'low';
  }

  return 'none';
}

function buildActivityData(days: GitHubContributionDay[]): string {
  const activityDates: string[] = [];

  for (const day of days) {
    for (let index = 0; index < day.contributionCount; index += 1) {
      activityDates.push(day.date);
    }
  }

  return activityDates.join(',');
}

function normalizeContributionDays(
  rawDays: Array<{
    contributionCount?: number;
    contributionLevel?: string;
    date?: string;
    weekday?: number;
  }>,
  startedAtDate: Date,
  endedAtDate: Date,
): GitHubContributionDay[] | null {
  const rawDayMap = new Map<string, { contributionCount: number }>();

  for (const rawDay of rawDays) {
    if (!rawDay.date || typeof rawDay.contributionCount !== 'number') {
      return null;
    }

    if (rawDayMap.has(rawDay.date)) {
      return null;
    }

    rawDayMap.set(rawDay.date, {
      contributionCount: rawDay.contributionCount,
    });
  }

  const normalizedDays: GitHubContributionDay[] = [];

  for (
    let currentDate = new Date(startedAtDate);
    currentDate <= endedAtDate;
    currentDate = addUtcDays(currentDate, 1)
  ) {
    const date = toIsoDate(currentDate);
    const rawDay = rawDayMap.get(date);

    if (!rawDay) {
      return null;
    }

    normalizedDays.push({
      date,
      contributionCount: rawDay.contributionCount,
      activityLevel: getActivityLevel(rawDay.contributionCount),
      weekday: currentDate.getUTCDay(),
    });
  }

  return normalizedDays;
}

function toIsoDateTimeBoundary(date: string, boundary: 'start' | 'end'): string {
  return boundary === 'start' ? `${date}T00:00:00Z` : `${date}T23:59:59Z`;
}

export async function getGitHubContributionGrid(): Promise<GitHubContributionGrid> {
  const { GITHUB_TOKEN, GITHUB_USERNAME } = process.env;
  const { startedAt, endedAt, startedAtDate, endedAtDate } = getPastYearRange();

  if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
    return createUnavailableGitHubContributionGrid(startedAt, endedAt);
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: GITHUB_FETCH_REVALIDATE_SECONDS },
      body: JSON.stringify({
        query: GITHUB_CONTRIBUTION_QUERY,
        variables: {
          login: GITHUB_USERNAME,
          from: toIsoDateTimeBoundary(startedAt, 'start'),
          to: toIsoDateTimeBoundary(endedAt, 'end'),
        },
      }),
    });

    if (!response.ok) {
      return createUnavailableGitHubContributionGrid(startedAt, endedAt);
    }

    const data = (await response.json()) as GitHubContributionCalendarResponse;
    if (data.errors?.length) {
      return createUnavailableGitHubContributionGrid(startedAt, endedAt);
    }

    const weeks =
      data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
    const contributionDays = weeks.flatMap((week) => week.contributionDays ?? []);

    if (contributionDays.length === 0) {
      return createUnavailableGitHubContributionGrid(startedAt, endedAt);
    }

    const days = normalizeContributionDays(contributionDays, startedAtDate, endedAtDate);
    if (!days) {
      return createUnavailableGitHubContributionGrid(startedAt, endedAt);
    }

    const totalContributions = days.reduce(
      (sum, day) => sum + day.contributionCount,
      0,
    );

    const availableGrid: AvailableGitHubContributionGrid = {
      startedAt,
      endedAt,
      status: 'available',
      days,
      totalContributions,
      activityData: buildActivityData(days),
      activityLevels: GITHUB_ACTIVITY_LEVEL_THRESHOLDS.join(','),
      firstDayOfWeek: 1,
    };

    return availableGrid;
  } catch {
    return createUnavailableGitHubContributionGrid(startedAt, endedAt);
  }
}