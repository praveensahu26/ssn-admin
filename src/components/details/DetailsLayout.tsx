import type { ReactNode } from 'react';

interface DetailsLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export function DetailsLayout({ left, right }: DetailsLayoutProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1280px] gap-6 xl:grid-cols-[minmax(0,1.7fr)_410px]">
      <div className="no-scrollbar min-w-0 rounded-xl border border-[#DCE5EF] bg-white p-5 shadow-card xl:h-[calc(100dvh-150px)] xl:overflow-y-auto">
        {left}
      </div>
      <aside className="min-w-0 overflow-hidden rounded-xl border border-[#DCE5EF] bg-white shadow-card xl:sticky xl:top-[86px] xl:h-[calc(100dvh-150px)] xl:self-start">
        {right}
      </aside>
    </div>
  );
}

export default DetailsLayout;
