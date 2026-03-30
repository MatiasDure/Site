"use client";

import { useSyncExternalStore } from "react";
import {
  ActivityCalendar,
  type Activity,
  type ColorScheme,
  type DayName,
  type ThemeInput,
} from "react-activity-calendar";
import { THEME_ATTRIBUTE } from "@/app/lib/theme.constants";
import type { GitHubContributionDay } from "@/app/types";

interface GitHubActivityGraphClientProps {
  days: GitHubContributionDay[];
}

const ACTIVITY_LEVEL_MAP = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  "very-high": 4,
} as const;

const CONTRIBUTION_THEME: ThemeInput = {
  light: [
    "var(--contribution-level-0)",
    "var(--contribution-level-1)",
    "var(--contribution-level-2)",
    "var(--contribution-level-3)",
    "var(--contribution-level-4)",
  ],
  dark: [
    "var(--contribution-level-0)",
    "var(--contribution-level-1)",
    "var(--contribution-level-2)",
    "var(--contribution-level-3)",
    "var(--contribution-level-4)",
  ],
};

const CONTRIBUTION_WEEKDAY_LABELS: DayName[] = ["mon", "wed", "fri"];

function mapDaysToActivities(days: GitHubContributionDay[]): Activity[] {
  return days.map((day) => ({
    date: day.date,
    count: day.contributionCount,
    level: ACTIVITY_LEVEL_MAP[day.activityLevel],
  }));
}

function getResolvedColorScheme(): ColorScheme {
  if (typeof document === "undefined") {
    return "light";
  }

  const theme = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return theme === "dark" ? "dark" : "light";
}

function subscribeToThemeChange(onStoreChange: () => void): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  const observer = new MutationObserver(() => {
    onStoreChange();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [THEME_ATTRIBUTE],
  });

  return () => {
    observer.disconnect();
  };
}

export default function GitHubActivityGraphClient({ days }: GitHubActivityGraphClientProps) {
  const colorScheme = useSyncExternalStore<ColorScheme>(
    subscribeToThemeChange,
    getResolvedColorScheme,
    () => "light",
  );

  return (
    <ActivityCalendar
      blockMargin={4}
      blockRadius={4}
      blockSize={12}
      className="contribution-graph"
      colorScheme={colorScheme}
      data={mapDaysToActivities(days)}
      fontSize={12}
      labels={{
        totalCount: "{{count}} contributions in {{year}}",
        legend: {
          less: "Less",
          more: "More",
        },
      }}
      maxLevel={4}
      showTotalCount={false}
      showWeekdayLabels={CONTRIBUTION_WEEKDAY_LABELS}
      theme={CONTRIBUTION_THEME}
      weekStart={1}
    />
  );
}


