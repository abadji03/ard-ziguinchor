'use client';

import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;
  emptyTitle?: string;
  emptyDesc?: string;
}

export function DataTable<T extends { id: string }>({
  columns, data, isLoading, total, page, totalPages, onPageChange,
  emptyTitle = 'Aucun élément', emptyDesc = 'Aucune donnée disponible.',
}: DataTableProps<T>) {
  if (isLoading) return <LoadingState />;
  if (!data.length) return <EmptyState title={emptyTitle} description={emptyDesc} />;

  return (
    <div>
      {total !== undefined && (
        <p className="text-xs text-gray-500 mb-3">{total} élément{total > 1 ? 's' : ''}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-gray-700 ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages && page && onPageChange && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}
