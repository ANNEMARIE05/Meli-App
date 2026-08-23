/**
 * constants/env.ts
 *
 * Point d'accès centralisé aux variables d'environnement.
 *
 * ⚠️  Seules les variables préfixées EXPO_PUBLIC_ sont disponibles ici
 *     (elles sont intégrées dans le bundle par Metro au moment du build).
 *
 * Usage :
 *   import { ENV } from '@/constants/env';
 *   console.log(ENV.API_URL);
 */

export const ENV = {
  /** URL de base de l'API backend */
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.meli.app',

  /** Timeout des requêtes API en ms */
  API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT ?? 10000),

  /** Durée de session en secondes */
  SESSION_TIMEOUT: Number(process.env.EXPO_PUBLIC_SESSION_TIMEOUT ?? 3600),

  /** Environnement courant */
  APP_ENV: (process.env.EXPO_PUBLIC_ENV ?? 'development') as 'development' | 'staging' | 'production',

  /** Mode debug activé */
  DEBUG: process.env.EXPO_PUBLIC_DEBUG === 'true',

  /** Raccourcis utiles */
  IS_DEV: process.env.EXPO_PUBLIC_ENV === 'development',
  IS_PROD: process.env.EXPO_PUBLIC_ENV === 'production',
} as const;
