import { useEffect, useRef, useState } from 'react';
import ProfileCover from '@/components/profile/ProfileCover';
import ProfileInfoItem from '@/components/profile/ProfileInfoItem';
import ProfilePostsGrid, { type ProfilePost } from '@/components/profile/ProfilePostsGrid';
import ProfileStatsCard from '@/components/profile/ProfileStatsCard';

export interface ProfileDetailsAccount {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  coverImage?: string;
  bio?: string;
  link?: string;
  location?: string;
  followersCount?: number;
  followingCount?: number;
  posts?: ProfilePost[];
  campaigns?: unknown[];
}

interface ProfileDetailsLayoutProps {
  profile: ProfileDetailsAccount;
  onBack: () => void;
}

function formatCount(value = 0) {
  if (value >= 1_000_000) return `${Number((value / 1_000_000).toFixed(2))}M`;
  if (value >= 1_000) return `${Number((value / 1_000).toFixed(2))}K`;
  return String(value);
}

function formatStateCountry(location?: string) {
  if (!location) return 'Not provided';

  const locationParts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return locationParts.length >= 2 ? locationParts.slice(-2).join(', ') : location;
}

function SvgIcon({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="h-5 w-5 object-contain" />;
}

const profileActionItems = [
  { label: 'View Messages', icon: '/icons/profile/chat.svg', alt: 'chat' },
  { label: 'View User Activity', icon: '/icons/profile/view.svg', alt: 'view' },
  { label: 'Issue Warning', icon: '/icons/profile/warning.svg', alt: 'warning' },
  { label: 'Block User', icon: '/icons/profile/remove.svg', alt: 'block' },
  { label: 'Suspend Account', icon: '/icons/profile/delete.svg', alt: 'suspend' },
];

export function ProfileDetailsLayout({ profile, onBack }: ProfileDetailsLayoutProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const coverImage = profile.coverImage ?? '/icons/logo.svg';
  const profilePicture = profile.profilePicture ?? '/icons/logo.svg';

  useEffect(() => {
    if (!isActionsOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!actionsRef.current?.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsActionsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActionsOpen]);

  return (
    <section className="w-full rounded-xl border border-[#DCE5EF] bg-white shadow-card">
      <ProfileCover coverImage={coverImage} name={profile.name} onBack={onBack} />

      <div className="px-4 pb-5 sm:px-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col">
            <img
              src={profilePicture}
              alt={profile.name}
              className="-mt-20 h-[160px] w-[160px] rounded-full border-2 border-white object-cover z-100"
            />
            <div className="mt-7">
              <div className="flex items-center gap-2">
                <h1 className="text-heading font-semibold leading-8 text-text-primary">{profile.name}</h1>
                <img src="/icons/profile/verified.svg" alt="verified" />
              </div>
              <p className="mt-1 text-md-custom font-regular leading-5 text-text-secondary">{profile.username}</p>
            </div>
          </div>

          <div className="mt-0 flex items-center gap-3 lg:mt-7">
            <button type="button" className="flex h-10 items-center gap-1 rounded-lg border border-[#DCE5EF] bg-white px-4 text-md-custom font-medium text-text-secondary">
               <img src="/icons/profile/message.svg" alt="message" />
              <span>Message</span>
            </button>
            <div ref={actionsRef} className="relative">
              <button
                type="button"
                aria-label="More actions"
                aria-expanded={isActionsOpen}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCE5EF] bg-white text-text-secondary"
                onClick={() => setIsActionsOpen((isOpen) => !isOpen)}
              >
                 <img src="/icons/table/dots.svg" alt="dot" />
              </button>

              {isActionsOpen && (
                <div className="absolute right-0 top-[48px] z-30 w-[250px] max-w-[calc(100vw-32px)] rounded-xl border border-[#DCE5EF] bg-white px-3 py-4 shadow-card">
                  <div className="flex flex-col gap-5">
                    {profileActionItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className="flex w-full items-center gap-2 text-left text-md-custom font-medium leading-8 text-text-secondary"
                        onClick={() => setIsActionsOpen(false)}
                      >
                        <img src={item.icon} alt={item.alt} className="h-6 w-6 shrink-0 object-contain" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <h2 className="text-base-custom font-semibold leading-5 text-text-primary">Bio</h2>
            <p className="mt-3 max-w-2xl text-md-custom font-medium leading-6 text-text-secondary">
              {profile.bio || 'No bio available.'}
            </p>
          </div>

          <div className="grid gap-x-3 gap-y-5 sm:grid-cols-2">
            <ProfileInfoItem
              icon={<SvgIcon src="/icons/profile/link.svg" alt="link" />}
              label="Link"
              value={profile.link ? <a href={profile.link} className="hover:text-btn-primary">{profile.link.replace(/^https?:\/\//, '')}</a> : 'Not provided'}
            />
            <ProfileInfoItem
              icon={<SvgIcon src="/icons/profile/location.svg" alt="location" />}
              label="Location"
              value={formatStateCountry(profile.location)}
            />
            <ProfileInfoItem
              icon={<SvgIcon src="/icons/profile/phone.svg" alt="phone" />}
              label="Phone"
              value={profile.phoneNumber}
            />
            <ProfileInfoItem
              icon={<SvgIcon src="/icons/profile/mail.svg" alt="email" />}
              label="Email"
              value={profile.email}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileStatsCard label="Followers" value={formatCount(profile.followersCount)} />
          <ProfileStatsCard label="Following" value={formatCount(profile.followingCount)} />
          <ProfileStatsCard label="Posts" value={formatCount(profile.posts?.length)} />
          <ProfileStatsCard label="Campaigns" value={formatCount(profile.campaigns?.length)} />
        </div>

        <ProfilePostsGrid posts={profile.posts} />
      </div>
    </section>
  );
}

export default ProfileDetailsLayout;
