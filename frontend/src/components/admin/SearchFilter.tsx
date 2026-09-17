import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  search: string;
  onSearch: (v: string) => void;
  filters?: { label: string; value: string; options: FilterOption[]; onChange: (v: string) => void }[];
  placeholder?: string;
}

export function SearchFilter({ search, onSearch, filters, placeholder = 'Rechercher…' }: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex-1">
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          icon={<Search className="h-4 w-4" />}
          aria-label={placeholder}
        />
      </div>
      {filters?.map((f) => (
        <Select
          key={f.label}
          value={f.value}
          options={f.options}
          onChange={(e) => f.onChange(e.target.value)}
          placeholder={f.label}
          className="min-w-[170px]"
          aria-label={f.label}
        />
      ))}
    </div>
  );
}
