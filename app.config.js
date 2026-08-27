// app.config.js — Configuration dynamique Expo
// Les variables d'environnement sont lues depuis le fichier .env
// Voir : https://docs.expo.dev/guides/environment-variables/

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'Meli-App',
  slug: 'Meli-App',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'meliapp',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.annemarie05.meliapp',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
  },
  android: {
    package: 'com.annemarie05.meliapp',
    adaptiveIcon: {
      backgroundColor: '#14171C',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    usesCleartextTraffic: true,
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'CAMERA',
      'INTERNET',
      'VIBRATE',
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID || '',
      },
    },
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 220,
        resizeMode: 'contain',
        backgroundColor: '#14171C',
        dark: {
          backgroundColor: '#14171C',
        },
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Meli a besoin de la caméra pour scanner le QR code du véhicule.',
        recordAudioAndroid: false,
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Meli utilise votre position pour afficher les véhicules, suivre les courses et enregistrer les trajets.',
        locationAlwaysAndWhenInUsePermission:
          'Meli utilise votre position pour suivre les courses en cours.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: false,
  },
  // Variables supplémentaires accessibles via Constants.expoConfig.extra
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    appEnv: process.env.EXPO_PUBLIC_ENV ?? 'development',
    eas: {
      projectId: '554d865e-e7fa-44a9-b397-239409f3b0e1',
    },
  },
};

export default config;
