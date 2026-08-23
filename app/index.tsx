import { Redirect, type Href } from 'expo-router';

import { SplashScreen } from '@/components/screens/splash-screen';
import { useAuth } from '@/context/auth-context';

export default function Index() {
  const { user } = useAuth();

  if (user?.role === 'owner') {
    return <Redirect href={'/owner' as Href} />;
  }
  if (user?.role === 'driver') {
    return <Redirect href={'/driver' as Href} />;
  }

  return <SplashScreen />;
}
