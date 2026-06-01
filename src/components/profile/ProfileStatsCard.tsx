interface ProfileStatsCardProps {
  label: string;
  value: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function ProfileStatsCard({ label, value, isActive = false, onClick }: ProfileStatsCardProps) {
  const className =
    'flex h-[66px] min-w-[200px] flex-1 items-center justify-center rounded-lg border border-[#DCE5EF] bg-white px-4 transition-colors';
  const activeClassName = isActive ? 'border-btn-primary bg-[#F8FBFF]' : '';
  const content = (
    <>
      <span className="text-[28px] font-semibold leading-9 text-btn-primary">{value}</span>
      <span className="mx-3 h-9 w-px bg-[#DCE5EF]" />
      <span className="text-md-custom font-medium leading-5 text-text-secondary">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={`${className} ${activeClassName}`} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <div className={`${className} ${activeClassName}`}>
      {content}
    </div>
  );
}

export default ProfileStatsCard;
