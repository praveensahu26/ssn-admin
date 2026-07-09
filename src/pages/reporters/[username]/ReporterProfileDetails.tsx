import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProfileDetailsLayout, { type ProfileDetailsAccount } from '@/components/profile/ProfileDetailsLayout';
import { slugifyProfileName } from '@/utils/profileRoutes';
import type { AccountTab } from '@/components/accounts/AccountsHeader';
import { accountServices } from '@/services/accountServices';

export const ReporterProfileDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const returnTab = (location.state as { returnTab?: AccountTab } | null)?.returnTab;
  const initialAccountId = (location.state as { accountId?: string } | null)?.accountId;

  const [profile, setProfile] = useState<ProfileDetailsAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        let accountId = initialAccountId;
        
        // Fallback: If no account ID is passed via state (e.g. refresh), search for the reporter by username slug
        if (!accountId && username) {
          const searchResponse = await accountServices.listAccounts({
            role: 'reporter',
            limit: 100,
          });
          const match = searchResponse.data?.accounts?.find(
            (acc) => slugifyProfileName(acc.name) === username
          );
          if (!match) {
            throw new Error('Reporter profile not found');
          }
          accountId = match.id;
        }

        if (!accountId) {
          throw new Error('Reporter profile not found');
        }

        // Fetch account info, posts, and campaigns in parallel
        const [accRes, postsRes, campaignsRes] = await Promise.all([
          accountServices.getAccount(accountId),
          accountServices.getAccountPosts(accountId, { limit: 100 }),
          accountServices.getAccountCampaigns(accountId, { limit: 100 }),
        ]);

        if (isMounted) {
          const rawAccount = accRes.data?.account;
          if (!rawAccount) {
            throw new Error('Unable to load account data');
          }

          // Map raw data from backend to ProfileDetailsAccount structure
          const assembledProfile: ProfileDetailsAccount = {
            name: rawAccount.name,
            username: `@${rawAccount.username}`,
            email: rawAccount.email,
            phoneNumber: rawAccount.phoneNumber ?? 'Not provided',
            profilePicture: rawAccount.profilePicture ?? undefined,
            coverImage: rawAccount.coverImage ?? undefined,
            bio: rawAccount.bio ?? undefined,
            link: rawAccount.link ?? undefined,
            location: rawAccount.location,
            followersCount: rawAccount.followersCount ?? 0,
            followingCount: rawAccount.followingCount ?? 0,
            followers: rawAccount.followers ?? [],
            following: rawAccount.following ?? [],
            isReported: rawAccount.isReported ?? false,
            reportCount: rawAccount.reportCount ?? 0,
            status: rawAccount.status ? {
              value: rawAccount.status.value,
              reasonTitle: rawAccount.status.reasonTitle ?? undefined,
              reasonDescription: rawAccount.status.reasonDescription ?? undefined,
            } : undefined,
            posts: (postsRes.data?.posts ?? []).map((post: any) => ({
              id: post.id,
              mediaUrl: post.media?.[0]?.url || '',
              media: post.media || [],
              viewCount: post.viewCount || '0',
              categories: post.categories || [],
            })),
            campaigns: campaignsRes.data?.campaigns ?? [],
          };

          setProfile(assembledProfile);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load profile');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [username, initialAccountId]);

  const handleModerationSubmit = async (
    actionType: 'warning' | 'block' | 'suspend',
    payload: { reasons: string[]; description: string; notifyUser: boolean; duration?: string }
  ) => {
    let accountId = initialAccountId;
    if (!accountId && username) {
      // Find the account id from loaded profile if not in state
      const searchResponse = await accountServices.listAccounts({
        role: 'reporter',
        limit: 100,
      });
      const match = searchResponse.data?.accounts?.find(
        (acc) => slugifyProfileName(acc.name) === username
      );
      accountId = match?.id;
    }

    if (!accountId) return;

    try {
      if (actionType === 'warning') {
        await accountServices.warnAccount(accountId, payload);
      } else if (actionType === 'block') {
        await accountServices.blockAccount(accountId, payload);
      } else if (actionType === 'suspend') {
        await accountServices.suspendAccount(accountId, payload);
      }
      
      // Force reload profile status
      const accRes = await accountServices.getAccount(accountId);
      const rawAccount = accRes.data?.account;
      if (rawAccount) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                status: rawAccount.status
                  ? {
                      value: rawAccount.status.value,
                      reasonTitle: rawAccount.status.reasonTitle ?? undefined,
                      reasonDescription: rawAccount.status.reasonDescription ?? undefined,
                    }
                  : prev.status,
              }
            : null
        );
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Moderation action failed');
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <div className="rounded-lg border border-[#DCE5EF] bg-white p-8 text-center text-md font-medium text-text-secondary">
          Loading profile...
        </div>
      ) : error || !profile ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-md font-medium text-red-700">
          {error || 'Reporter profile not found'}
        </div>
      ) : (
        <ProfileDetailsLayout
          profile={profile}
          detailsBasePath={`/reporters/${slugifyProfileName(profile.name)}`}
          onBack={() => navigate(returnTab && returnTab !== 'overview' ? `/reporters?tab=${returnTab}` : '/reporters')}
          onModerationSubmit={handleModerationSubmit}
        />
      )}
    </MainLayout>
  );
};

export default ReporterProfileDetails;
