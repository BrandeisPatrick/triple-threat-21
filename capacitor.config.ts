import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.triplethreeat21.app',
  appName: 'Triple Threat 21',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#1e293b',
    preferredContentMode: 'mobile'
  },
  android: {
    backgroundColor: '#1e293b',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1e293b',
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'Default',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1e293b'
    }
  }
};

export default config;
