import { authHandler } from '@/app/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export { authHandler as GET, authHandler as POST };