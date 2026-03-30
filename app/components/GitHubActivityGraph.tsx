import type { AvailableGitHubContributionGrid } from '@/app/types';

import GitHubActivityGraphClient from './GitHubActivityGraphClient';

interface GitHubActivityGraphProps {
  grid: AvailableGitHubContributionGrid;
}

const CONTRIBUTION_COUNT_FORMATTER = new Intl.NumberFormat('en');
const RANGE_FORMATTER = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatContributionSummary(totalContributions: number): string {
  const formattedTotal = CONTRIBUTION_COUNT_FORMATTER.format(totalContributions);
  const contributionLabel = totalContributions === 1 ? 'contribution' : 'contributions';

  return `${formattedTotal} ${contributionLabel} in the last 365 days`;
}

function formatRangeLabel(startedAt: string, endedAt: string): string {
  const startedAtDate = new Date(`${startedAt}T00:00:00Z`);
  const endedAtDate = new Date(`${endedAt}T00:00:00Z`);

  return `${RANGE_FORMATTER.format(startedAtDate)} - ${RANGE_FORMATTER.format(endedAtDate)}`;
}

export default function GitHubActivityGraph({ grid }: GitHubActivityGraphProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 md:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-sm font-medium text-foreground">
          {formatContributionSummary(grid.totalContributions)}
        </p>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {formatRangeLabel(grid.startedAt, grid.endedAt)}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <GitHubActivityGraphClient
          days={grid.days}
        />
      </div>
    </div>
  );
}