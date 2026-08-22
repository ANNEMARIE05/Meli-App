import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { driver, owner } from '@/constants/data';

export type UserRole = 'owner' | 'driver';

type User = {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  role: UserRole;
};

type AuthContextValue = {
  ready: boolean;
  onboarded: boolean;
  user: User | null;
  login: (input: { email: string; password: string; role: UserRole; remember?: boolean }) => Promise<void>;
  register: (input: {
    company: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const STORAGE = {
  onboarded: 'meli.onboarded',
  session: 'meli.session',
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [onboardedValue, sessionValue] = await Promise.all([
          AsyncStorage.getItem(STORAGE.onboarded),
          AsyncStorage.getItem(STORAGE.session),
        ]);
        setOnboarded(onboardedValue === '1');
        if (sessionValue) {
          setUser(JSON.parse(sessionValue) as User);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      onboarded,
      user,
      async login({ email, role, remember }) {
        const nextUser: User =
          role === 'driver'
            ? {
                fullName: driver.fullName,
                company: driver.company,
                email: email || 'karim.diallo@transcorp.ci',
                role,
              }
            : {
                fullName: owner.fullName,
                company: owner.company,
                email: email || owner.email,
                phone: owner.phone,
                role,
              };
        setUser(nextUser);
        if (remember) {
          await AsyncStorage.setItem(STORAGE.session, JSON.stringify(nextUser));
        } else {
          await AsyncStorage.removeItem(STORAGE.session);
        }
      },
      async register({ company, fullName, email, phone }) {
        const nextUser: User = {
          fullName,
          company,
          email,
          phone,
          role: 'owner',
        };
        setUser(nextUser);
        await AsyncStorage.setItem(STORAGE.session, JSON.stringify(nextUser));
      },
      async logout() {
        setUser(null);
        await AsyncStorage.removeItem(STORAGE.session);
      },
      async completeOnboarding() {
        setOnboarded(true);
        await AsyncStorage.setItem(STORAGE.onboarded, '1');
      },
    }),
    [onboarded, ready, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
