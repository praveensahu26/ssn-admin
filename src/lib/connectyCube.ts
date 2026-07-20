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
    return;
  }

  const rawAppId = env.VITE_CONNECTYCUBE_APP_ID;
  const appId = parseInt(rawAppId, 10);
  const authKey = env.VITE_CONNECTYCUBE_AUTH_KEY || '';
  const apiKey = env.VITE_CONNECTYCUBE_API_KEY || '';


  if (!rawAppId || isNaN(appId) || appId === 0) {
    throw new Error(`Invalid ConnectyCube appId: "${rawAppId}". Please check your VITE_CONNECTYCUBE_APP_ID environment variable.`);
  }

  if (!authKey) {
    throw new Error('Missing ConnectyCube authKey. Please check your VITE_CONNECTYCUBE_AUTH_KEY environment variable.');
  }

  if (!apiKey) {
    throw new Error('Missing ConnectyCube apiKey. Please check your VITE_CONNECTYCUBE_API_KEY environment variable.');
  }

  const config = {
    appId: appId,
    authKey: authKey,
    authSecret: apiKey,
  };

  try {
    ConnectyCube.init(config);
    isInitialized = true;
  } catch (error) {
    throw new Error(`ConnectyCube initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getConnectyCube() {
  if (!isInitialized) {
    initializeConnectyCube();
  }
  return ConnectyCube;
}
