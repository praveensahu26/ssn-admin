export const USER_STORAGE_KEY = 'ssn.auth.user';
export const ACCESS_TOKEN_STORAGE_KEY = 'ssn.auth.accessToken';
export const REFRESH_TOKEN_STORAGE_KEY = 'ssn.auth.refreshToken';
export const RESET_EMAIL_STORAGE_KEY = 'ssn.passwordReset.email';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}
