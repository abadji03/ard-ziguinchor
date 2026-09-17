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
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span className="font-bold text-slate-800">{total}</span> élément{total > 1 ? 's' : ''} au total
          </p>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200/70">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3.5 text-slate-700 font-normal ${col.className ?? ''}`}>
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
