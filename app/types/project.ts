export type Domain = 'web' | 'app' | 'game' | 'embedded';

export interface Project {
  slug: string;
  domain: Domain;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  featured: boolean;
  demo?: string;
  repo?: string;
  htmlBody: string;
}
