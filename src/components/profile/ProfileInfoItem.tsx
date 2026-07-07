import React from 'react';

interface ProfileInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

export function ProfileInfoItem({ icon, label, value }: ProfileInfoItemProps) {
  return (
    <div className="flex items-start gap-3 ">
      <span className=" flex h-6 w-6 -ml-4 shrink-0 items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base-custom -ml-2 font-medium leading-5 text-text-primary">{label}</p>
        <div className="mt-1 -ml-2 text-md-custom font-medium leading-5 text-text-secondary">
          {value}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoItem;
