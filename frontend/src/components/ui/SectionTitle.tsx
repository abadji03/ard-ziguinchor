import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({ title, subtitle, centered = false, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-8', centered && 'text-center', className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-500 text-base md:text-lg">{subtitle}</p>}
      <div className={cn('mt-3 h-1 w-16 bg-secondary rounded-full', centered && 'mx-auto')} />
    </div>
  );
}
