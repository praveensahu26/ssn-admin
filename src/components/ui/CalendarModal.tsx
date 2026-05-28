import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';



type QuickOption =
  | 'Last 7 days'
  | 'Last 14 days'
  | 'Last 30 days'
  | 'Last 3 months'
  | 'Last 12 months'
  | 'Custom';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the selected date range when Apply is clicked */
  onApply?: (range: { start: Date | null; end: Date | null; label: string }) => void;
  /** Position the modal relative to an anchor element */
  anchorRef?: React.RefObject<HTMLElement | null>;
}



const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(date: Date, start: Date, end: Date): boolean {
  const d = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return d > s && d < e;
}

function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  // Days from previous month to fill the first row
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const grid: (Date | null)[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push(new Date(year, month - 1, prevMonthDays - i));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(new Date(year, month, d));
  }

  // Fill remainder of last row with next month dates
  const remaining = 7 - (grid.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      grid.push(new Date(year, month + 1, d));
    }
  }

  return grid;
}



const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  onApply,
  anchorRef,
}) => {
  const today = new Date();

  const [selectedOption, setSelectedOption] = useState<QuickOption>('Custom');
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Reset to Custom option when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOption('Custom');
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modalRef.current && !modalRef.current.contains(target) &&
        !(anchorRef?.current && anchorRef.current.contains(target))
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose, anchorRef]);


  if (!isOpen) return null;

  // ── Month navigation ──
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  // ── Quick option click ──
  const handleOptionClick = (opt: QuickOption) => {
    setSelectedOption(opt);
    if (opt !== 'Custom') {
      setRangeStart(null);
      setRangeEnd(null);
    }
  };

  // ── Day click (Custom mode) ──
  const handleDayClick = (date: Date, isCurrentMonth: boolean) => {
    if (selectedOption !== 'Custom') return;
    if (!isCurrentMonth) return;

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      if (date < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
    }
  };

  // ── Day classification ──
  const getDayClass = (date: Date, isCurrentMonth: boolean): string => {
    const base = 'relative flex items-center justify-center text-sm font-poppins select-none transition-all duration-150 ';

    if (!isCurrentMonth) {
      return base + 'text-[#C0C8D2]  cursor-default text-[13px]';
    }

    const effectiveEnd = rangeEnd ?? (hoverDate && rangeStart && selectedOption === 'Custom' ? hoverDate : null);

    const isStart = rangeStart && isSameDay(date, rangeStart);
    const isEnd = effectiveEnd && isSameDay(date, effectiveEnd);
    const isInRange = rangeStart && effectiveEnd && isBetween(date, rangeStart, effectiveEnd);
    const isToday = isSameDay(date, today);

    if (isStart && isEnd) {
      // Single day selected
      return base + 'z-10 cursor-pointer font-semibold text-white';
    }

    if (isStart) {
      return base + 'z-10 cursor-pointer font-semibold text-white';
    }

    if (isEnd) {
      return base + 'z-10 cursor-pointer font-semibold text-white';
    }

    if (isInRange) {
      return base + 'cursor-pointer text-[#007AFF] font-semibold text-[13px]';
    }

    if (isToday) {
      return base + 'cursor-pointer text-[#FFFFFF] rounded-lg bg-btn-primary font-semibold text-[14px] px-2 py-2';
    }

    return base + 'cursor-pointer text-[#1A2332] hover:text-[#007AFF] text-[13px]';
  };

  const getDayBgStyle = (date: Date, isCurrentMonth: boolean): React.CSSProperties => {
    if (!isCurrentMonth) return {};

    const effectiveEnd = rangeEnd ?? (hoverDate && rangeStart && selectedOption === 'Custom' ? hoverDate : null);

    const isStart = rangeStart && isSameDay(date, rangeStart);
    const isEnd = effectiveEnd && isSameDay(date, effectiveEnd);
    const isInRange = rangeStart && effectiveEnd && isBetween(date, rangeStart, effectiveEnd);

    if (isStart && isEnd) {
      return { background: '#007AFF', borderRadius: '50%', width: 36, height: 36 };
    }
    if (isStart) {
      return { background: '#007AFF', borderRadius: '50%', width: 36, height: 36 };
    }
    if (isEnd) {
      return { background: '#007AFF', borderRadius: '50%', width: 36, height: 36 };
    }
    if (isInRange) {
      return { background: '#EAF3FF', borderRadius: 0, width: '100%', height: 36 };
    }
    return {};
  };

  // Range stripe behind the circle
  const getRangeStripeStyle = (date: Date, isCurrentMonth: boolean): React.CSSProperties => {
    if (!isCurrentMonth) return {};

    const effectiveEnd = rangeEnd ?? (hoverDate && rangeStart && selectedOption === 'Custom' ? hoverDate : null);
    if (!rangeStart || !effectiveEnd) return {};

    const isStart = isSameDay(date, rangeStart);
    const isEnd = isSameDay(date, effectiveEnd);
    const isInRange = isBetween(date, rangeStart, effectiveEnd);

    if (isStart && !isSameDay(rangeStart, effectiveEnd)) {
      return {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '50%',
        height: 36,
        background: '#EAF3FF',
        zIndex: 0,
      };
    }
    if (isEnd && !isSameDay(rangeStart, effectiveEnd)) {
      return {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '50%',
        height: 36,
        background: '#EAF3FF',
        zIndex: 0,
      };
    }
    if (isInRange) {
      return {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        height: 36,
        background: '#EAF3FF',
        zIndex: 0,
      };
    }
    return {};
  };

  const grid = buildCalendarGrid(viewYear, viewMonth);

  // ── Cancel ──
  const handleCancel = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelectedOption('Custom');
    onClose();
  };

  // ── Apply ──
  const handleApply = () => {
    onApply?.({ start: rangeStart, end: rangeEnd, label: selectedOption });
    onClose();
  };

  const QUICK_OPTIONS: QuickOption[] = [
    'Last 7 days',
    'Last 14 days',
    'Last 30 days',
    'Last 3 months',
    'Last 12 months',
    'Custom',
  ];

  return (
    <>
      {/* Backdrop (invisible, captures clicks outside) */}
      <div className="fixed inset-0 z-40" aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed z-50 bg-white rounded-xl shadow-card border border-[#DCE5EF] flex overflow-hidden"
        style={{
          top: '72px',
          right: '24px',
          minWidth: '520px',
          maxWidth: '560px',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Date range picker"
      >
        {/* ── Left panel ── */}
        <div className="flex flex-col gap-1 px-5 py-6 border-r border-[#DCE5EF] min-w-[160px] bg-white">
          {QUICK_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className={`text-left px-3 py-2 rounded-lg text-[13.5px] font-poppins font-medium transition-all duration-150 ${selectedOption === opt
                ? 'text-[#007AFF] bg-[#EAF3FF]'
                : 'text-[#4A5568] hover:text-[#007AFF] hover:bg-[#F5F9FF]'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* ── Right panel ── */}
        <div className="flex flex-col flex-1 px-5 py-5">
          {/* Month header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevMonth}
              className="w-9 h-9 rounded-xl border border-[#DCE5EF] flex items-center justify-center text-text-secondary"
              aria-label="Previous month"
            >
              <ArrowLeft />
            </button>

            <span className="text-base-custom font-medium text-text-secondary font-poppins tracking-tight">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              onClick={goToNextMonth}
              className="w-9 h-9 rounded-xl border border-[#DCE5EF] flex items-center justify-center text-text-secondary"
              aria-label="Next month"
            >
              <ArrowRight />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_OF_WEEK.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-9 text-sm-custom font-medium text-text-secondary font-poppins"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {grid.map((date, idx) => {
              if (!date) return <div key={idx} />;
              const isCurrentMonth = date.getMonth() === viewMonth;
              const rangeStripe = getRangeStripeStyle(date, isCurrentMonth);
              const bgStyle = getDayBgStyle(date, isCurrentMonth);
              const dayClass = getDayClass(date, isCurrentMonth);

              return (
                <div
                  key={idx}
                  className="relative flex items-center justify-center h-9"
                  onClick={() => handleDayClick(date, isCurrentMonth)}
                  onMouseEnter={() => {
                    if (selectedOption === 'Custom' && rangeStart && !rangeEnd && isCurrentMonth) {
                      setHoverDate(date);
                    }
                  }}
                  onMouseLeave={() => setHoverDate(null)}
                >
                  {/* Range stripe (behind circle) */}
                  {Object.keys(rangeStripe).length > 0 && (
                    <div style={rangeStripe} />
                  )}

                  {/* Day circle / highlight */}
                  <div
                    className={`${dayClass} relative z-10`}
                    style={{
                      ...bgStyle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: bgStyle.borderRadius === '50%' ? 36 : undefined,
                      minHeight: bgStyle.borderRadius === '50%' ? 36 : undefined,
                    }}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Bottom buttons ── */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#DCE5EF] gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 h-10 rounded-lg border border-[#DCE5EF] text-md-custom font-medium text-text-secondary font-poppins"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 h-10 rounded-lg bg-btn-primary text-white text-md-custom font-medium font-poppins"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarModal;
