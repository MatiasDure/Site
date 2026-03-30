'use client';

import "@mariohamann/activity-graph"

interface GitHubActivityGraphClientProps {
  activityData: string;
  activityLevels: string;
  endedAt: string;
  firstDayOfWeek: 1;
  startedAt: string;
}

export default function GitHubActivityGraphClient({
  activityData,
  activityLevels,
  endedAt,
  firstDayOfWeek,
  startedAt,
}: GitHubActivityGraphClientProps) {

  return (
    <activity-graph></activity-graph>
  );
}

