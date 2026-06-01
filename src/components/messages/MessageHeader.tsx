import { ArrowLeft, X } from 'lucide-react';

interface MessageHeaderProps {
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  onClose: () => void;
}

export default function MessageHeader({ name, username, avatar, isOnline, onClose }: MessageHeaderProps) {
  return (
    <header className="flex h-[67px] shrink-0 items-center justify-between border-b border-[#DCE5EF] bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Close message drawer"
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-primary md:hidden"
          onClick={onClose}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-base-custom font-medium leading-5 text-text-primary">Message</p>
          <div className="mt-1 flex min-w-0 items-center gap-2">
            <div className="relative shrink-0">
              <img src={avatar} alt={name} className="h-5 w-5 rounded-full object-cover" />
              <span
                className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white ${
                  isOnline ? 'bg-[#10C76F]' : 'bg-[#A6B5C6]'
                }`}
              />
            </div>
            <p className="truncate text-xs-custom font-medium leading-4 text-text-secondary">
              {name} · {username} · {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Close message drawer"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DCE5EF] text-text-primary"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </button>
    </header>
  );
}
