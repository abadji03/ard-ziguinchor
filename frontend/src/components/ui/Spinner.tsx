import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-6 w-6 text-primary', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Chargement…"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export function LoadingState({ message = 'Chargement…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
