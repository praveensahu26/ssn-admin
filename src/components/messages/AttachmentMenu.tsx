import { Camera, FileUp, Image, Mic } from 'lucide-react';

interface AttachmentAction {
  id: string;
  label: string;
  type: 'camera' | 'image' | 'audio' | 'document';
}

interface AttachmentMenuProps {
  isOpen: boolean;
  actions: AttachmentAction[];
  onSelect: (action: AttachmentAction) => void;
}

const iconMap = {
  camera: Camera,
  image: Image,
  audio: Mic,
  document: FileUp,
};

const toneMap = {
  camera: 'text-[#D70DFF]',
  image: 'text-btn-primary',
  audio: 'text-[#17C964]',
  document: 'text-[#8B5CF6]',
};

export default function AttachmentMenu({ isOpen, actions, onSelect }: AttachmentMenuProps) {
  return (
    <div
      className={`overflow-hidden border-t border-[#E8EEF5] bg-white transition-all duration-300 ${
        isOpen ? 'max-h-40 px-4 py-3 opacity-100' : 'max-h-0 px-4 py-0 opacity-0'
      }`}
    >
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = iconMap[action.type];

          return (
            <button
              key={action.id}
              type="button"
              className="flex min-w-0 flex-col items-center gap-1.5"
              onClick={() => onSelect(action)}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#DCE5EF] bg-[#F6FBFF] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-colors hover:border-btn-primary">
                <Icon className={`h-5 w-5 ${toneMap[action.type]}`} />
              </span>
              <span className="truncate text-[11px] font-medium leading-4 text-text-secondary">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
