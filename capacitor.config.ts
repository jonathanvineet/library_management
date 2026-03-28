import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.library.hub',
  appName: 'LibraryHub',
  webDir: 'next/out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  backgroundColor: '#0a0e27'
};

export default config;
