import type { ReactNode } from 'react';

interface RightPanelProps {
  title: string;
  count?: string;
  children: ReactNode;
}

export function RightPanel({ title, count, children }: RightPanelProps) {
  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="flex h-[70px] shrink-0 items-center gap-3 border-b border-[#DCE5EF] px-6">
        <h2 className="text-base-custom font-medium leading-6 text-text-primary">{title}</h2>
        {count && <span className="text-sm-custom font-medium leading-4 text-text-secondary">{count}</span>}
      </div>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {children}
      </div>
    </div>
  );
}

export default RightPanel;
