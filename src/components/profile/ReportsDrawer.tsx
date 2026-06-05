import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ModerationActionType } from '@/components/profile/ModerationActionDrawer';

interface ReportsDrawerProps {
  isOpen: boolean;
  totalReports?: number;
  onClose: () => void;
  onModerationAction: (action: ModerationActionType) => void;
  isCovered?: boolean;
}

const reportReasons = [
  { reason: 'Inappropriate Content', count: 18 },
  { reason: 'Misinformation', count: 18 },
  { reason: 'Hate Speech / Harassment', count: 18 },
  { reason: 'Defamation', count: 18 },
  { reason: 'Policy Violation', count: 18 },
  { reason: 'Misleading Headline', count: 18 },
  { reason: 'Inappropriate Content (Vulgarity, Violence, etc.)', count: 18 },
  { reason: 'Others', count: 18 },
];

export default function ReportsDrawer({
  isOpen,
  totalReports = 108,
  onClose,
  onModerationAction,
  isCovered = false,
}: ReportsDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (isCovered) return;

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
  }, [isCovered, isOpen, onClose]);

  function handleAction(action: ModerationActionType) {
    onModerationAction(action);
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label="Close reports drawer backdrop"
        className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Reports"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[390px] flex-col bg-white shadow-card transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex h-[67px] shrink-0 items-center justify-between border-b border-[#DCE5EF] px-6">
          <h2 className="text-base-custom font-medium leading-5 text-text-primary">Reports</h2>
          <button
            type="button"
            aria-label="Close reports drawer"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCE5EF] text-text-primary"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3 border-b border-[#DCE5EF] pb-5 text-sm-custom font-medium leading-4 text-text-secondary">
            <div className="flex items-center justify-between gap-4">
              <span>Total reports count</span>
              <span>{totalReports}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Total reports count from past week :</span>
              <span>18</span>
            </div>
          </div>

          <div className="pt-5">
            <div className="grid grid-cols-[1fr_auto] gap-4 text-md-custom font-medium leading-5 text-text-primary">
              <span>Reasons for Report</span>
              <span>Counts</span>
            </div>
            <div className="mt-4 space-y-4">
              {reportReasons.map((item) => (
                <div
                  key={item.reason}
                  className="grid grid-cols-[1fr_auto] gap-4 text-sm-custom font-medium leading-4 text-text-secondary"
                >
                  <span>{item.reason}</span>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="shrink-0 space-y-3 px-6 pb-6 pt-3">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center rounded-lg border border-[#DCE5EF] bg-white text-sm-custom font-medium text-text-secondary transition-colors hover:border-btn-primary hover:text-btn-primary"
            onClick={() => handleAction('warning')}
          >
            Issue Warning
          </button>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center rounded-lg border border-[#DCE5EF] bg-white text-sm-custom font-medium text-text-secondary transition-colors hover:border-btn-primary hover:text-btn-primary"
            onClick={() => handleAction('block')}
          >
            Block User
          </button>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center rounded-lg border border-[#DCE5EF] bg-white text-sm-custom font-medium text-text-secondary transition-colors hover:border-btn-primary hover:text-btn-primary"
            onClick={() => handleAction('suspend')}
          >
            Suspend Account
          </button>
        </footer>
      </aside>
    </div>
  );
}
