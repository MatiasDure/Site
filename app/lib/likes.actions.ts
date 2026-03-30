'use server';

import { toggleProjectLike } from '@/app/lib/likes';
import { getAppSession } from '@/app/lib/session';

export async function toggleProjectLikeAction(projectId: string) {
  const session = await getAppSession();

  if (!session.isAuthenticated || !session.user) {
    throw new Error('Sign in with Google before liking a project.');
  }

  return toggleProjectLike(projectId, session.user.id);
}