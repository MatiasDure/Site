export type Domain = 'web' | 'app' | 'game' | 'embedded';

export interface ProjectLikeSnapshot {
  projectId: string;
  totalLikes: number;
  likedByViewer: boolean;
}

export interface MarkdownProjectSource {
  domain: Domain;
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  tags: string[];
  imageUrl: string;
  demoUrl: string | null;
  repoUrl: string | null;
  htmlBody: string;
}

export interface PersistedProjectRecord extends MarkdownProjectSource {
  id: string;
}

export interface Project {
  id?: string;
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
  totalLikes?: number;
  likedByViewer?: boolean;
}
