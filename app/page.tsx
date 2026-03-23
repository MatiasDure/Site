import { getFeaturedProjects } from '@/app/lib';
import { HeroSection, ActivitySection, DomainSection } from '@/app/components';
import type { Domain } from '@/app/types';

export const revalidate = 600;

const DOMAINS: Domain[] = ['web', 'app', 'game', 'embedded'];

export default async function HomePage() {
  const featuredByDomain = await Promise.all(
    DOMAINS.map((domain) => getFeaturedProjects(domain))
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4">
      <HeroSection />
      <ActivitySection />
      {DOMAINS.map((domain, i) => (
        <DomainSection
          key={domain}
          domain={domain}
          featuredProjects={featuredByDomain[i]}
        />
      ))}
    </main>
  );
}

