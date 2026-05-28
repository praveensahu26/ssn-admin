import React from 'react';


interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeValue,
  placeholder = 'Search',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full max-w-[320px] ${className}`}>
      <img
        src="/icons/table/search.svg"
        alt="search"
        className="absolute left-3 w-5 h-5 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-white border border-[#DCE5EF] outline-none focus:outline-none rounded-lg text-md-custom text-text-primary placeholder-text-placeholder font-poppins"
        {...props}
      />
    </div>
  );
};

export default SearchBar;
