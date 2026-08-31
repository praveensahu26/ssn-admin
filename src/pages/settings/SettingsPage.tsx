import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Spinner } from '@/components/ui/spinner';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { inputClass, labelClass } from '@/lib/formStyles';
import { useAuthData } from '@/hooks/useAuthData';
import { settingsServices, type AdminProfile, type AccountInfo, type UpdateProfilePayload } from '@/services/settingsServices';

type SettingsTab = 'profile' | 'account';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Edit Profile' },
  { id: 'account', label: 'Account Settings' },
];

// ─── Edit Profile ───────────────────────────────────────────────────────────

function EditProfileTab() {
  const { updateUser } = useAuthData();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [form, setForm] = useState({ name: '', bio: '', gender: '', location: '', mobile: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    settingsServices
      .getProfile()
      .then((response) => {
        if (!isMounted || !response.data) return;
        const user = response.data.user;
        setProfile(user);
        setForm({
          name: user.name || '',
          bio: user.bio || '',
          gender: user.gender || '',
          location: user.location || '',
          mobile: user.mobile || '',
        });
      })
      .catch(() => {
        if (isMounted) setMessage({ type: 'error', text: 'Unable to load profile' });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await settingsServices.updateProfile({
        name: form.name,
        bio: form.bio || null,
        gender: (form.gender || undefined) as UpdateProfilePayload['gender'],
        location: form.location || null,
        mobile: form.mobile || undefined,
      });
      if (response.data) {
        setProfile(response.data.user);
        updateUser({ name: response.data.user.name });
      }
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Unable to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[560px] flex-col gap-4">
      <div className="flex items-center gap-4">
        <img
          src={profile?.avatar || '/assets/notFound.png'}
          alt="Profile"
          className="h-16 w-16 rounded-full border border-[#DCE5EF] object-cover"
        />
        <div>
          <p className="text-md-custom font-medium text-text-primary">{profile?.email}</p>
          <p className="text-sm-custom text-text-secondary">Profile photo updates aren't supported here yet.</p>
        </div>
      </div>

      <label className="flex flex-col">
        <span className={labelClass}>Name</span>
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </label>

      <label className="flex flex-col">
        <span className={labelClass}>Bio</span>
        <textarea
          className={inputClass}
          rows={3}
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
        />
      </label>

      <label className="flex flex-col">
        <span className={labelClass}>Gender</span>
        <select
          className={inputClass}
          value={form.gender}
          onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </label>

      <label className="flex flex-col">
        <span className={labelClass}>Location</span>
        <input
          className={inputClass}
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        />
      </label>

      <label className="flex flex-col">
        <span className={labelClass}>Mobile</span>
        <input
          className={inputClass}
          value={form.mobile}
          onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
        />
      </label>

      {message && (
        <p className={`text-sm-custom font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}

      <SubmitButton type="submit" isLoading={isSaving} className="self-start">
        Save Changes
      </SubmitButton>
    </form>
  );
}

// ─── Account Settings ───────────────────────────────────────────────────────

function AccountSettingsTab() {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    settingsServices
      .getAccountInfo()
      .then((response) => setAccount(response.data?.account ?? null))
      .catch(() => {});
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await settingsServices.changePassword(passwordForm);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Unable to change password' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex max-w-[560px] flex-col gap-8">
      <div>
        <h3 className="text-base-custom font-medium text-text-primary">Account Info</h3>
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-[#DCE5EF] p-4">
          <div className="flex justify-between text-sm-custom">
            <span className="text-text-secondary">Email</span>
            <span className="font-medium text-text-primary">{account?.email || '—'}</span>
          </div>
          <div className="flex justify-between text-sm-custom">
            <span className="text-text-secondary">Mobile</span>
            <span className="font-medium text-text-primary">{account?.mobile || '—'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
        <h3 className="text-base-custom font-medium text-text-primary">Change Password</h3>

        <label className="flex flex-col">
          <span className={labelClass}>Current Password</span>
          <input
            type="password"
            className={inputClass}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            required
          />
        </label>

        <label className="flex flex-col">
          <span className={labelClass}>New Password</span>
          <input
            type="password"
            className={inputClass}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            minLength={8}
            required
          />
        </label>

        <label className="flex flex-col">
          <span className={labelClass}>Confirm New Password</span>
          <input
            type="password"
            className={inputClass}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            minLength={8}
            required
          />
        </label>

        {message && (
          <p className={`text-sm-custom font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <SubmitButton type="submit" isLoading={isSaving} className="self-start">
          Change Password
        </SubmitButton>
      </form>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as SettingsTab) || 'profile';
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    TABS.some((t) => t.id === initialTab) ? initialTab : 'profile'
  );

  const handleTabChange = (tabId: SettingsTab) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <h1 className="font-poppins text-md-custom font-medium text-text-secondary">Settings</h1>

        <div className="flex gap-3 border-b border-[#DCE5EF]">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={`px-4 pb-3 text-md-custom font-medium font-poppins transition-colors ${
                activeTab === t.id
                  ? 'border-b-2 border-btn-primary text-btn-primary'
                  : 'text-text-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-[#DCE5EF] bg-white p-6">
          {activeTab === 'profile' && <EditProfileTab />}
          {activeTab === 'account' && <AccountSettingsTab />}
        </div>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;
