import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';
import type { Profile, Role } from '../types/domain';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<Profile | null>;
  signIn: (email: string, password: string) => Promise<Profile | null>;
  signUp: (email: string, password: string) => Promise<Profile | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const FALLBACK_ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@yoloracer.pet';
const FALLBACK_ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD ?? 'Admin@123';
const FALLBACK_ADMIN_NAME =
  import.meta.env.VITE_ADMIN_NAME ?? 'Command Ops';

const createProfileFromUser = (user: User): Profile => ({
  id: user.id,
  full_name:
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    'YoloRacer User',
  role: ((user.app_metadata?.role as Role | undefined) ?? 'user') as Role,
  theme_preference: 'dark',
  created_at: user.created_at ?? new Date().toISOString(),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = useCallback(
    async (userId: string | undefined): Promise<Profile | null> => {
      if (!hasSupabaseConfig || !userId) {
        return null;
      }
      try {
        setProfileLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (error) {
          console.warn('Failed to load profile', error);
          return null;
        }
        setProfile(data as Profile);
        return data as Profile;
      } finally {
        setProfileLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [hasSupabaseConfig]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }
    if (user?.id) {
      fetchProfile(user.id);
    } else {
      setProfile(null);
    }
  }, [user?.id, fetchProfile, hasSupabaseConfig]);

  const mockSignIn = useCallback(
    async (email: string, password: string): Promise<Profile | null> => {
      if (
        email === FALLBACK_ADMIN_EMAIL &&
        password === FALLBACK_ADMIN_PASSWORD
      ) {
        const mockProfile: Profile = {
          id: 'mock-admin',
          full_name: FALLBACK_ADMIN_NAME,
          role: 'admin',
          theme_preference: 'dark',
          created_at: new Date().toISOString(),
        };
        setProfile(mockProfile);
        setUser({
          id: mockProfile.id,
          app_metadata: { provider: 'email', providers: ['email'], role: 'admin' },
          user_metadata: { full_name: mockProfile.full_name },
          aud: 'authenticated',
          role: 'authenticated',
          email,
          phone: '',
          confirmed_at: mockProfile.created_at,
          email_confirmed_at: mockProfile.created_at,
          confirmation_sent_at: mockProfile.created_at,
          recovery_sent_at: null,
          last_sign_in_at: mockProfile.created_at,
          created_at: mockProfile.created_at,
          updated_at: mockProfile.created_at,
          identities: [],
          factors: [],
          phone_confirmed_at: null,
          new_phone: '',
          new_phone_confirmed_at: null,
          invited_at: null,
        } as User);
        setLoading(false);
        return mockProfile;
      }
      throw new Error('Invalid credentials');
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<Profile | null> => {
      if (!hasSupabaseConfig) {
        return mockSignIn(email, password);
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) {
        const stored = await fetchProfile(data.user.id);
        if (stored) return stored;
        const derived = createProfileFromUser(data.user);
        setProfile(derived);
        return derived;
      }
      return null;
    },
    [fetchProfile, mockSignIn, hasSupabaseConfig]
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<Profile | null> => {
      if (!hasSupabaseConfig) {
        throw new Error(
          'Sign up is disabled in demo mode. Configure Supabase to enable it.'
        );
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        const stored = await fetchProfile(data.user.id);
        if (stored) return stored;
        const derived = createProfileFromUser(data.user);
        setProfile(derived);
        return derived;
      }
      return null;
    },
    [fetchProfile, hasSupabaseConfig]
  );

  const signOut = useCallback(async () => {
    if (hasSupabaseConfig) {
      await supabase.auth.signOut();
    }
    setProfile(null);
    setUser(null);
    setSession(null);
  }, [hasSupabaseConfig]);

  const refreshProfile = useCallback(async () => {
    if (!hasSupabaseConfig) {
      return profile;
    }
    return fetchProfile(user?.id);
  }, [fetchProfile, profile, user?.id, hasSupabaseConfig]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      profile,
      profileLoading,
      refreshProfile,
      signIn,
      signUp,
      signOut,
    }),
    [
      user,
      session,
      loading,
      profile,
      profileLoading,
      refreshProfile,
      signIn,
      signUp,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

