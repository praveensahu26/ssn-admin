import { useEffect, useState } from 'react';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import CalendarModal from '@/components/ui/CalendarModal';

export interface ModerationActionConfig {
  title: string;
  descriptionLines: string[];
  reasonTitle: string;
  reasons: string[];
  descriptionValue: string;
  notificationLabel: string;
  primaryButtonLabel: string;
  defaultNotifyUser?: boolean;
  showDuration?: boolean;
  durationOptions?: string[];
}

interface ModerationActionDrawerProps {
  isOpen: boolean;
  config: ModerationActionConfig;
  profileRole?: 'user' | 'reporter';
  onClose: () => void;
  onSubmit?: (payload: {
    reasons: string[];
    description: string;
    notifyUser: boolean;
    duration?: string;
  }) => void;
}

export const moderationActionConfigs = {
  warning: {
    title: 'Issue Warning to User',
    descriptionLines: [
      'Send a formal warning to the user for violating platform policies.',
      'Multiple warnings may lead to restrictions or account suspension.',
    ],
    reasonTitle: 'Reason for Warning',
    reasons: [
      'Inappropriate Content',
      'Misinformation',
      'Hate Speech / Harassment',
      'Defamation',
      'Policy Violation',
      'Misleading Headline',
      'Inappropriate Content (Vulgarity, Violence, etc.)',
      'Others',
    ],
    descriptionValue: '',
    notificationLabel: 'Send this warning as an in-app notification and email',
    primaryButtonLabel: 'Issue Warning',
    defaultNotifyUser: false,
  },
  block: {
    title: 'Block User',
    descriptionLines: [
      'This user will be permanently blocked from accessing the platform. They won’t be able to log in, post, comment, or interact with any content.',
    ],
    reasonTitle: 'Reason for Blocking',
    reasons: [
      'Inappropriate Content',
      'Misinformation',
      'Hate Speech / Harassment',
      'Defamation',
      'Policy Violation',
      'Misleading Headline',
      'Inappropriate Content (Vulgarity, Violence, etc.)',
      'Others',
    ],
    descriptionValue: '',
    notificationLabel: 'Send a final notification about account termination.',
    primaryButtonLabel: 'Block User',
    defaultNotifyUser: false,
  },
  suspend: {
    title: 'Suspend User Account',
    descriptionLines: [
      'This user will be logged out and unable to sign back in. The account stays suspended until an Admin manually restores it — it will not become active on its own.',
    ],
    reasonTitle: 'Reason for Suspension',
    reasons: ['Policy Violation', 'Repeated Content Violations', 'Temporarily Restricting Activity', 'Others'],
    descriptionValue: '',
    notificationLabel: 'Send a suspension notice via email and in-app notification.',
    primaryButtonLabel: 'Suspend User',
    defaultNotifyUser: false,
    showDuration: true,
    durationOptions: ['7 Days', '15 Days', '30 Days', 'Custom', 'Permanent'],
  },
} satisfies Record<string, ModerationActionConfig>;

export type ModerationActionType = keyof typeof moderationActionConfigs;

export default function ModerationActionDrawer({
  isOpen,
  config,
  profileRole = 'user',
  onClose,
  onSubmit,
}: ModerationActionDrawerProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState(config.descriptionValue);
  const [notifyUser, setNotifyUser] = useState(config.defaultNotifyUser ?? true);
  const [duration, setDuration] = useState(config.durationOptions?.[0] ?? '');
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedReason('');
    setDescription(config.descriptionValue);
    setNotifyUser(config.defaultNotifyUser ?? false);
    setDuration(config.durationOptions?.[0] ?? '');
    setIsDurationOpen(false);
    setIsCalendarOpen(false);
  }, [config, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

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

  function toggleReason(reason: string) {
    setSelectedReason((currentReason) => (currentReason === reason ? '' : reason));
  }

  function handleSubmit() {
    onSubmit?.({
      reasons: selectedReason ? [selectedReason] : [],
      description,
      notifyUser,
      duration: config.showDuration ? duration : undefined,
    });
    onClose();
  }

  function renderRoleCopy(value: string) {
    if (profileRole === 'user') return value;

    return value
      .replace(/\bUser\b/g, 'Reporter')
      .replace(/\buser\b/g, 'reporter');
  }

  const title = renderRoleCopy(config.title);
  const descriptionLines = config.descriptionLines.map(renderRoleCopy);
  const primaryButtonLabel = renderRoleCopy(config.primaryButtonLabel);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label={`Close ${title} backdrop`}
        className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-white shadow-card transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex shrink-0 items-start justify-between border-b border-[#DCE5EF] px-6 pb-4 pt-6">
          <div className="min-w-0">
            <h2 className="text-base-custom font-medium leading-5 text-text-primary">{title}</h2>
            <div className="mt-3 flex flex-col gap-1">
              {descriptionLines.map((line) => (
                <p key={line} className="text-sm-custom font-medium leading-5 text-text-secondary">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label={`Close ${title} drawer`}
            className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] text-text-primary"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-5">
          <section className="pt-5">
            <h3 className="text-md-custom font-medium leading-5 text-text-primary">{config.reasonTitle}</h3>
            <div className="mt-3 flex flex-col gap-2">
              {config.reasons.map((reason) => (
                <label key={reason} className="flex items-start gap-2 text-sm-custom font-medium leading-4 text-text-secondary">
                  <input
                    type="checkbox"
                    checked={selectedReason === reason}
                    className="mt-0.5 h-4 w-4 rounded border-[#AFC0D2] accent-btn-primary"
                    onChange={() => toggleReason(reason)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <label htmlFor="moderation-description" className="text-md-custom font-medium leading-5 text-text-primary">
              Description
            </label>
            <textarea
              id="moderation-description"
              value={description}
              rows={config.showDuration ? 3 : 4}
              className="mt-3 w-full resize-none rounded-lg border border-[#DCE5EF] bg-white px-4 py-3 text-sm-custom font-medium leading-5 text-text-secondary outline-none transition-colors placeholder:text-text-placeholder focus:border-btn-primary"
              onChange={(event) => setDescription(event.target.value)}
            />
          </section>

          {config.showDuration && (
            <section className="mt-4">
              <label htmlFor="moderation-duration" className="text-md-custom font-medium leading-5 text-text-primary">
                Suspension Duration
              </label>
              <div className="relative mt-3">
                <button
                  id="moderation-duration"
                  type="button"
                  aria-expanded={isDurationOpen}
                  className={`flex h-12 w-full items-center justify-between rounded-lg border bg-white px-4 text-left text-sm-custom font-medium text-text-primary outline-none transition-colors ${
                    isDurationOpen ? 'rounded-b-none border-[#DCE5EF]' : 'border-[#DCE5EF] focus:border-btn-primary'
                  }`}
                  onClick={() => setIsDurationOpen((isOpen) => !isOpen)}
                >
                  <span>{duration}</span>
                  {isDurationOpen ? (
                    <ChevronUp className="h-4 w-4 text-text-primary" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-text-primary" />
                  )}
                </button>

                {isDurationOpen && (
                  <div className="absolute left-0 right-0 top-12 z-10 overflow-hidden rounded-b-lg border border-t-0 border-[#DCE5EF] bg-white shadow-card">
                    {config.durationOptions?.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="flex h-10 w-full items-center justify-between px-4 text-left text-sm-custom font-medium text-text-primary transition-colors hover:bg-[#F6FBFF]"
                        onClick={() => {
                          setDuration(option);
                          setIsDurationOpen(false);

                          if (option === 'Custom') {
                            setIsCalendarOpen(true);
                          }
                        }}
                      >
                        <span>{option}</span>
                        {duration === option && (
                          <span className="flex h-4 w-4 items-center justify-center rounded bg-btn-primary text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          <label className="mt-3 flex items-start gap-2 text-sm-custom font-medium leading-4 text-text-secondary">
            <input
              type="checkbox"
              checked={notifyUser}
              className="mt-0.5 h-3.5 w-3.5 rounded border-[#AFC0D2] accent-btn-primary"
              onChange={(event) => setNotifyUser(event.target.checked)}
            />
            <span>{config.notificationLabel}</span>
          </label>
        </div>

        <footer className="shrink-0 px-6 pb-6 pt-3">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-btn-primary text-sm-custom font-medium text-white"
            onClick={handleSubmit}
          >
            {primaryButtonLabel}
          </button>
          <button
            type="button"
            className="mt-3 flex h-12 w-full items-center justify-center rounded-lg bg-[#D6EAFF] text-sm-custom font-medium text-text-primary"
            onClick={onClose}
          >
            Cancel
          </button>
        </footer>

        {config.showDuration && (
          <CalendarModal
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            hideQuickOptions
            disablePastMonths
            onApply={({ start, end }) => {
              if (start && end) {
                const formatter = new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                setDuration(`${formatter.format(start)} - ${formatter.format(end)}`);
              } else {
                setDuration('Custom');
              }
              setIsCalendarOpen(false);
            }}
          />
        )}
      </aside>
    </div>
  );
}
