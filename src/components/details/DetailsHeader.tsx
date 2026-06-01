import { useNavigate } from 'react-router-dom';

interface DetailsHeaderProps {
  title: string;
}

export function DetailsHeader({}: DetailsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex items-center gap-3">
      <button
        type="button"
        aria-label="Go back"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-card"
        onClick={() => navigate(-1)}
      >
        <img src="/icons/profile/back.svg" alt="" className="h-5 w-5 object-contain" />
      </button>
    </div>
  );
}

export default DetailsHeader;
