export type GitHubContributionStatus = 'available' | 'unavailable';

export type GitHubActivityLevel = 'none' | 'low' | 'medium' | 'high' | 'very-high';

export interface GitHubContributionDay {
  date: string;
  contributionCount: number;
  activityLevel: GitHubActivityLevel;
  weekday: number;
}

interface GitHubContributionGridBase {
  startedAt: string;
  endedAt: string;
  status: GitHubContributionStatus;
}

export interface AvailableGitHubContributionGrid extends GitHubContributionGridBase {
  status: 'available';
  days: GitHubContributionDay[];
  totalContributions: number;
  activityData: string;
  activityLevels: string;
  firstDayOfWeek: 1;
}

export interface UnavailableGitHubContributionGrid extends GitHubContributionGridBase {
  status: 'unavailable';
  days: [];
  totalContributions: 0;
  message: string;
}

export type GitHubContributionGrid =
  | AvailableGitHubContributionGrid
  | UnavailableGitHubContributionGrid;