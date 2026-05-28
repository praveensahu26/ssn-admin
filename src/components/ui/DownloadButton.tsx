import React from 'react';


interface DownloadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onDownload?: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownload,
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onDownload}
      className={`flex items-center gap-2 px-8 py-3 bg-white border border-[#DCE5EF]  text-text-secondary rounded-lg text-md-custom  font-medium font-poppins ${className}`}
      {...props}
    >
      <img src="/icons/table/download.svg" alt="download" />
      <span>Download</span>
    </button>
  );
};

export default DownloadButton;
