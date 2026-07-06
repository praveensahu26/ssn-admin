export const USER_STORAGE_KEY = 'ssn.auth.user';
export const ACCESS_TOKEN_STORAGE_KEY = 'ssn.auth.accessToken';
export const REFRESH_TOKEN_STORAGE_KEY = 'ssn.auth.refreshToken';
export const RESET_EMAIL_STORAGE_KEY = 'ssn.passwordReset.email';
export const AUTH_EXPIRED_EVENT = 'ssn.auth.expired';

type AuthStorage = Storage;

const AUTH_KEYS = [USER_STORAGE_KEY, ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY];

export function getAuthStorage(): AuthStorage {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ? localStorage : sessionStorage;
}

export function clearAuthStorage() {
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string) {
  const storage = getAuthStorage();
  storage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function setRefreshToken(token: string) {
  const storage = getAuthStorage();
  storage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
}

export function notifyAuthExpired() {
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}
