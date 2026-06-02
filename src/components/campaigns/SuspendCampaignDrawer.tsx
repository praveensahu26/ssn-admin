import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const suspensionReasons = [
  'Violation of Platform Policies',
  'Misleading or False Information',
  'Inappropriate Content',
  'Reported for Fraudulent Activity',
  'Other',
];

interface SuspendCampaignDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reasons: string[]) => void;
}

export function SuspendCampaignDrawer({
  isOpen,
  onClose,
  onSubmit,
}: SuspendCampaignDrawerProps) {
  const [selectedReason, setSelectedReason] = useState('');

  function resetAndClose() {
    setSelectedReason('');
    onClose();
  }

  function selectReason(reason: string) {
    setSelectedReason((currentReason) => (currentReason === reason ? '' : reason));
  }

  function handleSubmit() {
    onSubmit?.(selectedReason ? [selectedReason] : []);
    resetAndClose();
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        resetAndClose();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <button
        type="button"
        aria-label="Close suspend campaign drawer backdrop"
        className={`absolute inset-0 bg-transparent transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={resetAndClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Suspend Campaign"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[395px] flex-col bg-white transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0 shadow-card' : 'translate-x-full shadow-none'
        }`}
      >
        <header className="shrink-0 border-b border-[#DCE5EF] px-5 pb-5 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-base-custom font-medium leading-6 text-text-primary">
                Suspend Campaign
              </h2>
              <p className="mt-2 text-sm-custom font-medium leading-5 text-text-secondary">
                Suspending this campaign will temporarily remove it from public visibility,
                prevent new donations or participation, and notify the campaign creator about
                the suspension.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close suspend campaign drawer"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] text-md-custom font-medium text-text-primary"
              onClick={resetAndClose}
            >
             <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <h3 className="text-md-custom font-medium leading-5 text-text-primary">
            Reason for Suspension
          </h3>

          <div className="mt-4 flex flex-col gap-3">
            {suspensionReasons.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2 text-sm-custom font-medium leading-4 text-text-secondary"
              >
                <input
                  type="checkbox"
                  checked={selectedReason === reason}
                  className="h-4 w-4 rounded border-[#AFC0D2] accent-btn-primary"
                  onChange={() => selectReason(reason)}
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <footer className="shrink-0 px-5 pb-6 pt-4">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-btn-primary text-sm-custom font-medium text-white"
            onClick={handleSubmit}
          >
            Suspend Campaign
          </button>
          <button
            type="button"
            className="mt-3 flex h-12 w-full items-center justify-center rounded-lg bg-[#D6EAFF] text-sm-custom font-medium text-text-primary"
            onClick={resetAndClose}
          >
            Cancel
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default SuspendCampaignDrawer;
