import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ConnectionsList from '@/components/connections/ConnectionsList';
import ConnectionsSearchBar from '@/components/connections/ConnectionsSearchBar';
import type { ConnectionProfile } from '@/components/connections/ConnectionListItem';

interface ConnectionsDrawerProps {
  isOpen: boolean;
  title: string;
  data: ConnectionProfile[];
  onClose: () => void;
}

export default function ConnectionsDrawer({ isOpen, title, data, onClose }: ConnectionsDrawerProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setQuery('');

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label={`Close ${title} drawer backdrop`}
        className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute right-0 top-0 flex h-full w-full max-w-[390px] flex-col bg-white shadow-card transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex h-[67px] shrink-0 items-center justify-between border-b border-[#DCE5EF] px-6">
          <h2 className="text-base-custom font-medium leading-5 text-text-primary">{title}</h2>
          <button
            type="button"
            aria-label={`Close ${title} drawer`}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCE5EF] text-text-primary"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="shrink-0 px-6 py-4">
          <ConnectionsSearchBar value={query} onChange={setQuery} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <ConnectionsList data={data} query={query} />
        </div>
      </aside>
    </div>
  );
}
