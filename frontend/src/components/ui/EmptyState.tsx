import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Aucun résultat',
  description = 'Aucun élément ne correspond à vos critères.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-3.5 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-2xs">
        {icon ?? <SearchX className="h-6 w-6 text-slate-400" />}
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-800">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
