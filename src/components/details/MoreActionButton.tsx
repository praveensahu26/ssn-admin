import { useEffect, useRef, useState } from 'react';

interface MoreActionButtonProps {
  label?: string;
}

export function MoreActionButton({ label = 'Delete Post' }: MoreActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="More actions"
        className="flex h-10 w-10"
        onClick={() => setIsOpen((value) => !value)}
      >
        <img src="/icons/profile/dots.svg" alt="" className="h-6 w-6 object-contain" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-9 z-20 w-[200px] rounded-xl border border-[#DCE5EF] bg-white p-2 shadow-card">
          <button type="button" className="flex w-full items-center gap-1 rounded-md px-3 py-2 text-left text-md-custom font-medium text-text-secondary">
            <img src="/icons/table/delete.svg" alt="" className="h-7 w-7 object-contain" />
            <span>{label}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default MoreActionButton;
