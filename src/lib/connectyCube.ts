import ConnectyCube from 'connectycube';
import { env } from '@/config/env';

let isInitialized = false;

export interface ConnectyCubeConfig {
  appId: number;
  authKey: string;
  apiKey: string;
}

export function initializeConnectyCube() {
  if (isInitialized) {
    console.log('ConnectyCube already initialized');
    return;
  }

  const rawAppId = env.VITE_CONNECTYCUBE_APP_ID;
  const appId = parseInt(rawAppId, 10);
  const authKey = env.VITE_CONNECTYCUBE_AUTH_KEY || '';
  const apiKey = env.VITE_CONNECTYCUBE_API_KEY || '';

  console.log('ConnectyCube config:', { 
    rawAppId, 
    appId, 
    appIdType: typeof appId,
    authKey: authKey ? '***' : 'missing', 
    apiKey: apiKey ? '***' : 'missing' 
  });

  if (!rawAppId || isNaN(appId) || appId === 0) {
    console.error('Invalid ConnectyCube appId:', rawAppId, 'parsed as:', appId);
    throw new Error(`Invalid ConnectyCube appId: "${rawAppId}". Please check your VITE_CONNECTYCUBE_APP_ID environment variable.`);
  }

  if (!authKey) {
    console.error('Missing ConnectyCube authKey');
    throw new Error('Missing ConnectyCube authKey. Please check your VITE_CONNECTYCUBE_AUTH_KEY environment variable.');
  }

  if (!apiKey) {
    console.error('Missing ConnectyCube apiKey');
    throw new Error('Missing ConnectyCube apiKey. Please check your VITE_CONNECTYCUBE_API_KEY environment variable.');
  }

  const config = {
    appId: appId,
    authKey: authKey,
    authSecret: apiKey,
  };

  console.log('Initializing ConnectyCube with config:', { appId: config.appId });
  try {
    ConnectyCube.init(config);
    isInitialized = true;
    console.log('ConnectyCube initialized successfully with appId:', appId);
  } catch (error) {
    console.error('Failed to initialize ConnectyCube:', error);
    throw new Error(`ConnectyCube initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getConnectyCube() {
  if (!isInitialized) {
    initializeConnectyCube();
  }
  return ConnectyCube;
}
