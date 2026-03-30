import { getFeaturedProjects } from '@/app/lib';
import { getAppSession } from '@/app/lib/session';
import { HeroSection, ActivitySection, DomainSection } from '@/app/components';
import type { Domain } from '@/app/types';

export const revalidate = 600;

const DOMAINS: Domain[] = ['web', 'app', 'game', 'embedded'];

export default async function HomePage() {
  const session = await getAppSession();
  const featuredByDomain = await Promise.all(
    DOMAINS.map((domain) => getFeaturedProjects(domain, session.user?.id ?? null))
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 text-foreground">
      <HeroSection />
      <ActivitySection />
      {DOMAINS.map((domain, i) => (
        <DomainSection
          key={domain}
          domain={domain}
          featuredProjects={featuredByDomain[i]}
          isAuthenticated={session.isAuthenticated}
        />
      ))}
    </main>
  );
}

