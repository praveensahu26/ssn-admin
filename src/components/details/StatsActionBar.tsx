interface StatAction {
  label: string;
  value: string;
  icon: string;
  onClick?: () => void;
}

interface StatsActionBarProps {
  items: StatAction[];
}

export function StatsActionBar({ items }: StatsActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-4">
      {items.map((item) => {
        const content = (
          <>
            <img src={item.icon} alt={item.label} className="h-5 w-5 object-contain" />
            <span>{item.value}</span>
          </>
        );

        if (item.onClick) {
          return (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-1 text-sm-custom font-medium leading-4 text-text-primary"
              onClick={item.onClick}
            >
              {content}
            </button>
          );
        }

        return (
          <div key={item.label} className="flex items-center gap-1 text-sm-custom font-medium leading-4 text-text-primary">
            {content}
          </div>
        );
      })}
    </div>
  );
}

export default StatsActionBar;
