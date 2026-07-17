interface AppEnv {
  VITE_API_BASE_URL: string;
  VITE_APP_NAME: string;
  VITE_CONNECTYCUBE_APP_ID: string;
  VITE_CONNECTYCUBE_AUTH_KEY: string;
  VITE_CONNECTYCUBE_API_KEY: string;
}

function readEnv(): AppEnv {
  const base = import.meta.env.VITE_API_BASE_URL?.trim();
  const name = import.meta.env.VITE_APP_NAME;

  if (!base || typeof base !== 'string') {
    console.warn(
      'VITE_API_BASE_URL not set, falling back to http://localhost:8000/v1'
    );
  }

  return {
    VITE_API_BASE_URL: base || 'http://localhost:8000/v1',
    VITE_APP_NAME: name ?? 'SSN Admin',
    VITE_CONNECTYCUBE_APP_ID: import.meta.env.VITE_CONNECTYCUBE_APP_ID || '',
    VITE_CONNECTYCUBE_AUTH_KEY: import.meta.env.VITE_CONNECTYCUBE_AUTH_KEY || '',
    VITE_CONNECTYCUBE_API_KEY: import.meta.env.VITE_CONNECTYCUBE_API_KEY || '',
  };
}

export const env: AppEnv = readEnv();

