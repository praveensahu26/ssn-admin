import React, { useEffect, useMemo, useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import DownloadButton from '@/components/ui/DownloadButton';
import { exportToCsv } from '@/utils/exportCsv';
import Pagination from '@/components/ui/Pagination';

export interface ColumnConfig<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  csvValue?: (row: T) => string | number | boolean | null | undefined;
  hidden?: boolean;
}

type ActionIconProps = { className?: string };

export interface ActionConfig<T> {
  icon: React.ComponentType<ActionIconProps>;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  className?: string;
  tooltip?: string;
  detailTitle?: (row: T) => string;
  detailContent?: (row: T) => React.ReactNode;
  menuItems?: {
    label: string;
    onClick?: (row: T) => void;
    icon?: React.ReactNode;
  }[];
}

export interface BulkActionConfig {
  label: string;
  onClick: (selectedIds: string[]) => void;
}

interface DataTableProps<T> {
  title: string;
  label?: string;
  data: T[];
  columns: ColumnConfig<T>[];
  actions?: ActionConfig<T>[];
  bulkActions?: BulkActionConfig[];
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
  bulkActions = [],
  searchPlaceholder = 'Search',
  searchKeys,
  itemsPerPage = 12,
  showPagination = true,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDetail, setActiveDetail] = useState<{ rowId: string; actionIndex: number } | null>(null);

  useEffect(() => {
    setSelectedIds([]);
  }, [data]);

  useEffect(() => {
    if (!activeDetail) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (!target.closest('[data-action-popover="true"]')) {
        setActiveDetail(null);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [activeDetail]);

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

  const handleDownloadCsv = () => {
    const slugify = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${slugify(title)}-${dateStr}.csv`;

    exportToCsv(paginatedData, columns, filename);
  };

  const renderCell = (row: T, col: ColumnConfig<T>) =>
    col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode);

  // Filter out hidden columns for display, but keep them for CSV
  const visibleColumns = columns.filter(col => !col.hidden);

  const renderActionButtons = (row: T, align: 'start' | 'end' = 'end') => (
    <div className={`flex items-center gap-2 ${align === 'end' ? 'justify-end' : 'justify-start'}`}>
      {actions.map((act, aIdx) => {
        const IconComp = act.icon;
        const hasDetail = Boolean(act.detailContent);
        const isDisabled = act.disabled?.(row) ?? false;
        const hasMenu = Boolean(act.menuItems?.length);
        const popoverAlignment = align === 'start' ? 'left-0' : 'right-0';
        const isDetailOpen =
          activeDetail?.rowId === row.id && activeDetail.actionIndex === aIdx;

        return (
          <div
            key={aIdx}
            data-action-popover="true"
            className="relative inline-flex items-center justify-center"
            onMouseEnter={() => {
              if (hasDetail && !hasMenu) {
                setActiveDetail({ rowId: row.id, actionIndex: aIdx });
              }
            }}
            onMouseLeave={() => {
              if (hasDetail && !hasMenu) {
                setActiveDetail(null);
              }
            }}
          >
            <button
              onClick={() => {
                if (isDisabled) return;

                act.onClick(row);
                if (hasMenu) {
                  setActiveDetail((current) =>
                    current?.rowId === row.id && current.actionIndex === aIdx
                      ? null
                      : { rowId: row.id, actionIndex: aIdx }
                  );
                } else {
                  setActiveDetail(null);
                }
              }}
              disabled={isDisabled}
              onFocus={() => {
                if (hasDetail && !hasMenu) {
                  setActiveDetail({ rowId: row.id, actionIndex: aIdx });
                }
              }}
              onBlur={() => {
                if (hasDetail && !hasMenu) {
                  setActiveDetail(null);
                }
              }}
              className={`inline-flex h-9 w-9 items-center justify-center bg-white text-text-secondary ${isDisabled ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'} ${act.className || ''}`}
              title={act.tooltip}
              aria-expanded={hasDetail || hasMenu ? isDetailOpen : undefined}
            >
              <IconComp className="w-5 h-5 shrink-0" />
            </button>

            {hasMenu && isDetailOpen && (
              <div className={`absolute ${popoverAlignment} top-[42px] z-20 w-[300px] max-w-[calc(100vw-32px)] rounded-xl border border-[#DCE5EF] bg-white py-4 text-left shadow-card`}>
                {act.menuItems?.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => {
                      item.onClick?.(row);
                      setActiveDetail(null);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-1 text-left text-md-custom font-medium leading-7 text-text-secondary"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {hasDetail && !hasMenu && isDetailOpen && (
              <div className={`absolute ${popoverAlignment} top-[42px] z-20 w-[365px] max-w-[calc(100vw-32px)] rounded-[14px] bg-[#303030] px-5 py-4 text-left text-white shadow-xl`}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg-custom font-medium leading-6 text-white">
                    {act.detailTitle?.(row) ?? act.tooltip ?? 'Info'}
                  </h3>
                  <IconComp className="mt-0.5 w-5 h-5 shrink-0 opacity-80" />
                </div>
                <div className="mt-3 whitespace-normal text-md-custom font-medium leading-6 text-white">
                  {act.detailContent?.(row)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full bg-white border border-[#DCE5EF] rounded-xl shadow-card overflow-visible font-poppins mb-2">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border-b border-[#DCE5EF]">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h2 className="text-subheading font-medium text-text-primary">{title}</h2>
          {label && (
            <span className="px-3 py-1 bg-[#E1EFFF] border border-[#DCE5EF] text-[#344054] text-sm-custom font-semibold rounded-md font-inter">
              {label}
            </span>
          )}
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:flex-nowrap">
          <SearchBar
            value={searchQuery}
            onChangeValue={handleSearchChange}
            placeholder={searchPlaceholder}
            className="sm:max-w-[320px]"
          />
          <DownloadButton
            onDownload={handleDownloadCsv}
            disabled={paginatedData.length === 0}
          />
        </div>
      </div>

      {/* Bulk Action Bar — visible only when rows are selected */}
      {bulkActions.length > 0 && selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-6 px-5 py-2.5 border-b border-[#DCE5EF]  flex-wrap">
          {bulkActions.map((ba, i) => (
            <button
              key={i}
              onClick={() => ba.onClick(selectedIds)}
              className="text-md-custom font-medium text-btn-primary  whitespace-nowrap font-poppins"
            >
              {ba.label}
            </button>
          ))}
        </div>
      )}

      {/* Table Section */}
      <div className="hidden w-full max-h-[calc(100vh-290px)] min-h-[240px] overflow-auto md:block">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10">
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
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className="py-4 px-4 text-text-secondary font-medium text-md-custom whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th
                  className="py-4 px-6 text-text-secondary font-medium text-md-custom text-right whitespace-nowrap"
                  style={{ minWidth: `${Math.max(actions.length, 2) * 48 + 24}px` }}
                >
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (actions.length > 0 ? 2 : 1)}
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
                    {visibleColumns.map((col) => (
                      <td key={col.key} className="py-4 px-4 text-text-secondary text-md-custom text-nowrap">
                        {renderCell(row, col)}
                      </td>
                    ))}

                    {/* Action Column */}
                    {actions.length > 0 && (
                      <td
                        className="relative py-2 px-4 text-right whitespace-nowrap"
                        style={{ minWidth: `${Math.max(actions.length, 2) * 48 + 24}px` }}
                      >
                        {renderActionButtons(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Section */}
      <div className="grid min-h-[240px] gap-3 p-3 md:hidden">
        {paginatedData.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-[#DCE5EF] px-4 text-center text-md-custom text-text-secondary">
            No data found
          </div>
        ) : (
          paginatedData.map((row) => {
            const isSelected = selectedIds.includes(row.id);
            const [primaryColumn, ...detailColumns] = visibleColumns;

            return (
              <article
                key={row.id}
                className={`rounded-lg border border-[#DCE5EF] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] ${
                  isSelected ? 'ring-1 ring-btn-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSelectRow(row.id)}
                    className={`mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                      isSelected
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

                  <div className="min-w-0 flex-1">
                    {primaryColumn && (
                      <div className="min-w-0 text-md-custom text-text-primary">
                        {renderCell(row, primaryColumn)}
                      </div>
                    )}

                    <dl className="mt-4 grid gap-3">
                      {detailColumns.map((col) => (
                        <div key={col.key} className="grid grid-cols-[112px_minmax(0,1fr)] gap-3">
                          <dt className="text-sm-custom font-medium text-text-secondary">
                            {col.header}
                          </dt>
                          <dd className="min-w-0 text-right text-sm-custom font-medium text-text-primary">
                            <div className="inline-flex max-w-full justify-end break-words">
                              {renderCell(row, col)}
                            </div>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {actions.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#DCE5EF] pt-3">
                        {renderActionButtons(row, 'start')}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
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
