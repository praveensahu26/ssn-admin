interface ConnectionsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ConnectionsSearchBar({ value, onChange }: ConnectionsSearchBarProps) {
  return (
    <div className="relative">
      <img
        src="/icons/table/search.svg"
        alt=""
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 object-contain"
      />
      <input
        type="text"
        value={value}
        placeholder="Search"
        className="h-11 w-full rounded-lg border border-[#DCE5EF] bg-white pl-12 pr-4 text-sm-custom font-medium text-text-primary outline-none transition-colors placeholder:text-text-placeholder focus:border-btn-primary"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
