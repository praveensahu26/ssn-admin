import React, { useState, useMemo } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import DownloadButton from '@/components/ui/DownloadButton';
import Pagination from '@/components/ui/Pagination';

export interface ColumnConfig<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface ActionConfig<T> {
  icon: React.ComponentType<any>;
  onClick: (row: T) => void;
  className?: string;
  tooltip?: string;
}

interface DataTableProps<T> {
  title: string;
  label?: string;
  data: T[];
  columns: ColumnConfig<T>[];
  actions?: ActionConfig<T>[];
  searchPlaceholder?: string;
  searchKeys: (keyof T)[];
  itemsPerPage?: number;
  showPagination?: boolean;
}

export function DataTable<T extends { id: string; name?: string; profilePicture?: string }>({
  title,
  label,
  data,
  columns,
  actions = [],
  searchPlaceholder = 'Search',
  searchKeys,
  itemsPerPage = 12,
  showPagination = true,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reset page when search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      return searchKeys.some((key) => {
        const val = item[key];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(query);
        }
        if (typeof val === 'number') {
          return String(val).includes(query);
        }
        return false;
      });
    });
  }, [data, searchQuery, searchKeys]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredData;
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage, showPagination]);

  // Handle selection checkbox click
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((row) => row.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="w-full bg-white border border-[#DCE5EF] rounded-xl shadow-card overflow-hidden font-poppins mb-2">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-[#DCE5EF]">
        <div className="flex items-center gap-3">
          <h2 className="text-subheading font-medium text-text-primary">{title}</h2>
          {label && (
            <span className="px-3 py-1 bg-[#E1EFFF] border border-[#DCE5EF] text-[#344054] text-sm-custom font-semibold rounded-md font-inter">
              {label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <SearchBar
            value={searchQuery}
            onChangeValue={handleSearchChange}
            placeholder={searchPlaceholder}
          />
          <DownloadButton />
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#DCE5EF] bg-white">
              {/* Checkbox column */}
              <th className="py-4 pl-6 pr-4 w-[60px]">
                <button
                  onClick={toggleSelectAll}
                  className={`flex items-center justify-center w-5 h-5 rounded-md border transition-all ${selectedIds.length > 0 && selectedIds.length === paginatedData.length
                    ? 'border-btn-primary bg-btn-primary text-white'
                    : 'border-[#6A7A8C] bg-white text-[#6A7A8C]'
                    }`}
                  aria-label="Select all"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="py-4 px-4 text-text-secondary font-medium text-md-custom whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="py-4 px-6 text-text-secondary font-medium text-md-custom text-right w-24 min-w-[100px] whitespace-nowrap">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 2 : 1)}
                  className="py-12 text-center text-text-secondary text-md-custom"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-[#DCE5EF] last:border-b-0 ${isSelected ? 'bg-[#F4F8FD]/50' : ''
                      }`}
                  >
                    {/* Checkbox selection */}
                    <td className="py-4 pl-6 pr-4">
                      <button
                        onClick={() => toggleSelectRow(row.id)}
                        className={`flex items-center justify-center w-5 h-5 rounded-md border transition-all ${isSelected
                          ? 'border-btn-primary bg-btn-primary text-white'
                          : 'border-[#6A7A8C] bg-white text-[#6A7A8C]'
                          }`}
                        aria-label={`Select row ${row.name || row.id}`}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                    </td>

                    {/* Column values */}
                    {columns.map((col) => (
                      <td key={col.key} className="py-4 px-4 text-text-secondary text-md-custom text-nowrap">
                        {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}

                    {/* Action Column */}
                    {actions.length > 0 && (
                      <td className="py-2 px-2 text-right w-24 min-w-[120px]">
                        <div className="flex items-center justify-end gap-1 shrink-0">
                          {actions.map((act, aIdx) => {
                            const IconComp = act.icon;
                            return (
                              <button
                                key={aIdx}
                                onClick={() => act.onClick(row)}
                                className={`inline-flex items-center justify-center p-1 ${act.className || ''
                                  }`}
                                title={act.tooltip}
                              >
                                <IconComp className="w-5 h-5 shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {showPagination && (
        <Pagination
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default DataTable;
