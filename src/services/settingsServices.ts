import { apiClient, unwrap } from './apiClient';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  bio: string | null;
  gender: string | null;
  avatar: string | null;
  coverPhoto: string | null;
  location: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string | null;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: string | null;
  mobile?: string;
}

export interface AccountInfo {
  email: string;
  mobile: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const settingsServices = {
  getProfile: () => unwrap<{ user: AdminProfile }>(apiClient.get('/settings/profile')),

  updateProfile: (payload: UpdateProfilePayload) =>
    unwrap<{ user: AdminProfile }>(apiClient.put('/settings/profile', payload)),

  getAccountInfo: () => unwrap<{ account: AccountInfo }>(apiClient.get('/settings/account')),

  changePassword: (payload: ChangePasswordPayload) => unwrap(apiClient.put('/settings/account/change-password', payload)),
};
