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
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      <button
        key="prev"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) => (
        <Fragment key={`item-${i}`}>
          {p === '…' ? (
            <span className="px-3 py-2 text-sm text-gray-400">…</span>
          ) : (
            <button
              onClick={() => onPageChange(p as number)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium border transition-colors',
                p === page
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
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
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}