export interface AppUser {
  id: string;
  email: string;
  name: string;
  googleId: string;
  image: string | null;
}

export interface AppSessionUser {
  id: string;
  email: string;
  name: string;
  googleId: string;
  image: string | null;
}

export interface AppSession {
  user: AppSessionUser | null;
  isAuthenticated: boolean;
}