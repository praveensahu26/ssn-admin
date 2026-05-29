import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProfileDetailsLayout, { type ProfileDetailsAccount } from '@/components/profile/ProfileDetailsLayout';
import { slugifyProfileName } from '@/utils/profileRoutes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dummyData is a plain JS module with no type declarations
import { users as initialUsers } from '@/dummyData/dummyData';

export const UserProfileDetails: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  const profile = useMemo(
    () =>
      (initialUsers as ProfileDetailsAccount[]).find(
        (item) => slugifyProfileName(item.name) === username
      ),
    [username]
  );

  return (
    <MainLayout>
      {profile ? (
        <ProfileDetailsLayout profile={profile} onBack={() => navigate('/users')} />
      ) : (
        <div className="rounded-lg border border-[#DCE5EF] bg-white p-8 text-center text-lg font-semibold text-[#101828]">
          User profile not found
        </div>
      )}
    </MainLayout>
  );
};

export default UserProfileDetails;
