import { useEffect, useRef, useState } from 'react';

interface MoreActionButtonProps {
  label?: string;
  items?: Array<{
    label: string;
    icon?: string;
    onClick?: () => void;
  }>;
  disabled?: boolean;
}

export function MoreActionButton({ label = 'Delete Post', items, disabled = false }: MoreActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuItems = items ?? [{ label, icon: '/icons/table/delete.svg' }];

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
        disabled={disabled}
        className="flex h-10 w-10 disabled:opacity-40"
        onClick={() => setIsOpen((value) => !value)}
      >
        <img src="/icons/profile/dots.svg" alt="" className="h-6 w-6 object-contain" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-9 z-20 w-[220px] rounded-xl border border-[#DCE5EF] bg-white p-2 shadow-card">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-md-custom font-medium text-text-secondary"
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
            >
              {item.icon && <img src={item.icon} alt="" className="h-6 w-6 object-contain" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MoreActionButton;
