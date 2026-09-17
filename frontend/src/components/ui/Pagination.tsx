'use client';
import { Fragment } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-8">
      <button
        key="prev"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) => (
        <Fragment key={`item-${i}`}>
          {p === '…' ? (
            <span className="px-3 py-2 text-sm text-slate-400">…</span>
          ) : (
            <button
              onClick={() => onPageChange(p as number)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'min-w-[38px] h-9 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs',
                p === page
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
              )}
            >
              {p}
            </button>
          )}
        </Fragment>
      ))}

      <button
        key="next"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Page suivante"
        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}