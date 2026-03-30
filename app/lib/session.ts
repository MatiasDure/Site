import 'server-only';

import NextAuth, {
  getServerSession,
  type NextAuthOptions,
  type Session,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';
import { syncProjectsToDatabase } from '@/app/lib/project-sync';
import type { AppSession, AppSessionUser, AppUser } from '@/app/types';
import { getDatabase } from '@/db/client';

interface AppToken extends JWT {
  appUser?: AppSessionUser;
}

interface UpsertUserInput {
  email: string;
  name: string;
  googleId: string;
  image: string | null;
}

const AUTH_FALLBACK_SECRET = 'development-auth-secret';
const isDevelopment = process.env.NODE_ENV !== 'production';

function getEnvValue(name: string) {
  const value = process.env[name];

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

const googleClientId = getEnvValue('GOOGLE_CLIENT_ID');
const googleClientSecret = getEnvValue('GOOGLE_CLIENT_SECRET');
const authSecret = getEnvValue('AUTH_SECRET') ?? (isDevelopment ? AUTH_FALLBACK_SECRET : undefined);

const isGoogleProviderConfigured = Boolean(
  googleClientId && googleClientSecret && authSecret
);

function createUserId(googleId: string) {
  return `user:google:${googleId}`;
}

function mapDatabaseUserToAppUser(databaseUser: {
  id: string;
  email: string;
  name: string;
  google_id: string;
  image: string | null;
}): AppUser {
  return {
    id: databaseUser.id,
    email: databaseUser.email,
    name: databaseUser.name,
    googleId: databaseUser.google_id,
    image: databaseUser.image,
  };
}

function mapAppUserToSessionUser(appUser: AppUser): AppSessionUser {
  return {
    id: appUser.id,
    email: appUser.email,
    name: appUser.name,
    googleId: appUser.googleId,
    image: appUser.image,
  };
}

function upsertUser(input: UpsertUserInput): AppUser {
  const database = getDatabase();
  const now = new Date().toISOString();
  const upsertStatement = database.prepare(`
    INSERT INTO User (id, email, name, google_id, image, created_at, updated_at)
    VALUES (@id, @email, @name, @googleId, @image, @createdAt, @updatedAt)
    ON CONFLICT(google_id) DO UPDATE SET
      email = excluded.email,
      name = excluded.name,
      image = excluded.image,
      updated_at = excluded.updated_at
  `);
  const selectStatement = database.prepare(`
    SELECT id, email, name, google_id, image
    FROM User
    WHERE google_id = ?
    LIMIT 1
  `);

  const transaction = database.transaction((payload: UpsertUserInput) => {
    upsertStatement.run({
      id: createUserId(payload.googleId),
      email: payload.email,
      name: payload.name,
      googleId: payload.googleId,
      image: payload.image,
      createdAt: now,
      updatedAt: now,
    });

    return selectStatement.get(payload.googleId) as {
      id: string;
      email: string;
      name: string;
      google_id: string;
      image: string | null;
    };
  });

  return mapDatabaseUserToAppUser(transaction(input));
}

function getUserByEmail(email: string): AppUser | null {
  const database = getDatabase();
  const result = database
    .prepare(`
      SELECT id, email, name, google_id, image
      FROM User
      WHERE email = ?
      LIMIT 1
    `)
    .get(email) as
    | {
        id: string;
        email: string;
        name: string;
        google_id: string;
        image: string | null;
      }
    | undefined;

  if (!result) {
    return null;
  }

  return mapDatabaseUserToAppUser(result);
}

function getGoogleId(accountProviderId?: string | null, profile?: Record<string, unknown>) {
  if (accountProviderId) {
    return accountProviderId;
  }

  const profileSubject = profile?.sub;
  return typeof profileSubject === 'string' ? profileSubject : null;
}

function getDisplayName(name?: string | null, email?: string | null) {
  if (name && name.trim().length > 0) {
    return name;
  }

  if (email && email.trim().length > 0) {
    return email;
  }

  return 'Google user';
}

async function enrichTokenWithUser(token: AppToken, details: {
  email: string;
  name: string;
  googleId: string;
  image: string | null;
}) {
  try {
    await syncProjectsToDatabase();
  } catch (error) {
    console.error('Project synchronization failed during auth bootstrap.', error);
  }

  const user = upsertUser(details);
  token.appUser = mapAppUserToSessionUser(user);

  return token;
}

function readSessionUser(session: Session | null): AppSessionUser | null {
  const candidate = session?.user as Partial<AppSessionUser> | undefined;

  if (!candidate?.id || !candidate.email || !candidate.name || !candidate.googleId) {
    return null;
  }

  return {
    id: candidate.id,
    email: candidate.email,
    name: candidate.name,
    googleId: candidate.googleId,
    image: candidate.image ?? null,
  };
}

const providers = isGoogleProviderConfigured
  ? [
      GoogleProvider({
        clientId: googleClientId ?? '',
        clientSecret: googleClientSecret ?? '',
      }),
    ]
  : [];

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: 'jwt',
  },
  providers,
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== 'google') {
        return false;
      }

      const googleId = getGoogleId(account.providerAccountId, profile as Record<string, unknown> | undefined);
      return Boolean(googleId && user.email);
    },
    async jwt({ token, account, profile, user }) {
      const nextToken = token as AppToken;

      if (account?.provider === 'google') {
        const googleId = getGoogleId(account.providerAccountId, profile as Record<string, unknown> | undefined);

        if (googleId && user.email) {
          return enrichTokenWithUser(nextToken, {
            email: user.email,
            name: getDisplayName(user.name, user.email),
            googleId,
            image: user.image ?? null,
          });
        }
      }

      if (!nextToken.appUser && typeof token.email === 'string') {
        const existingUser = getUserByEmail(token.email);

        if (existingUser) {
          nextToken.appUser = mapAppUserToSessionUser(existingUser);
        }
      }

      return nextToken;
    },
    async session({ session, token }) {
      const appUser = (token as AppToken).appUser;

      if (!appUser) {
        return session;
      }

      return {
        ...session,
        user: {
          ...(session.user ?? {}),
          ...appUser,
        },
      };
    },
  },
};

export const isGoogleAuthConfigured = isGoogleProviderConfigured;

export async function getAppSession(): Promise<AppSession> {
  const session = await getServerSession(authOptions);
  const sessionUser = readSessionUser(session);

  if (!sessionUser) {
    return {
      user: null,
      isAuthenticated: false,
    };
  }

  return {
    user: sessionUser,
    isAuthenticated: true,
  };
}

export const authHandler = NextAuth(authOptions);