interface AppEnv {
  VITE_API_BASE_URL: string;
  VITE_APP_NAME: string;
}

function readEnv(): AppEnv {
  const base = import.meta.env.VITE_API_BASE_URL;
  const name = import.meta.env.VITE_APP_NAME;

  if (!base || typeof base !== 'string') {
    console.warn(
      'VITE_API_BASE_URL not set, falling back to http://localhost:4000'
    );
  }

  return {
    VITE_API_BASE_URL: base ?? 'http://localhost:4000',
    VITE_APP_NAME: name ?? 'SSN Admin',
  };
}

export const env: AppEnv = readEnv();
