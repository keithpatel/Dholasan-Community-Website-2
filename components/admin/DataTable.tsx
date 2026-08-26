
import React, { useState, useMemo } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchPlaceholder?: string;
  searchField?: string | ((item: T, query: string) => boolean);
  emptyMessage?: string;
  bulkDelete?: boolean;
  onBulkDelete?: (items: T[]) => void;
  onReorder?: (items: T[]) => void;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  searchField,
  emptyMessage = 'No items found.',
  bulkDelete = false,
  onBulkDelete,
  onReorder,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchQuery && searchField) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => {
        if (typeof searchField === 'function') {
          return searchField(item, q);
        }
        const val = item[searchField];
        if (typeof val === 'string') return val.toLowerCase().includes(q);
        if (val && typeof val === 'object' && 'en' in val) {
          return val.en.toLowerCase().includes(q) || val.gu.toLowerCase().includes(q);
        }
        return false;
      });
    }
    if (sortKey) {
      result.sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        if (aVal && typeof aVal === 'object' && 'en' in aVal) aVal = aVal.en;
        if (bVal && typeof bVal === 'object' && 'en' in bVal) bVal = bVal.en;
        const cmp = String(aVal || '').localeCompare(String(bVal || ''));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, searchQuery, searchField, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(d => String(d[keyField]))));
    }
  };

  const moveRow = (item: T, dir: -1 | 1) => {
    if (!onReorder) return;
    const idx = data.findIndex(d => d[keyField] === item[keyField]);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= data.length) return;
    const next = [...data];
    [next[idx], next[target]] = [next[target], next[idx]];
    onReorder(next);
  };

  return (
    <div className="space-y-4">
      {/* Search & Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {searchField && (
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        )}
        {bulkDelete && selectedIds.size > 0 && onBulkDelete && (
          <button
            onClick={() => {
              const selected = data.filter(d => selectedIds.has(String(d[keyField])));
              onBulkDelete(selected);
              setSelectedIds(new Set());
            }}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Selected ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-500 uppercase text-xs tracking-wider">
              {bulkDelete && (
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length} onChange={toggleAll} className="rounded border-gray-300" />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left ${col.sortable ? 'cursor-pointer hover:text-gray-800 select-none' : ''}`}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-orange-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </th>
              ))}
              {onReorder && <th className="px-4 py-3 text-center">Order</th>}
              {(onEdit || onDelete) && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (bulkDelete ? 1 : 0) + (onReorder ? 1 : 0) + (onEdit || onDelete ? 1 : 0)} className="px-4 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={String(item[keyField])} className="hover:bg-gray-50 transition-colors">
                  {bulkDelete && (
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.has(String(item[keyField]))} onChange={() => toggleSelect(String(item[keyField]))} className="rounded border-gray-300" />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                  {onReorder && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveRow(item, -1)}
                          disabled={data.findIndex(d => d[keyField] === item[keyField]) === 0}
                          className="px-2 py-1 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 rounded transition-colors"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveRow(item, 1)}
                          disabled={data.findIndex(d => d[keyField] === item[keyField]) === data.length - 1}
                          className="px-2 py-1 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 rounded transition-colors"
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                  )}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right space-x-2">
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-500 hover:text-white transition-all">
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item)} className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
