import { Download, FileText } from 'lucide-react';
import type { Document } from '@/types';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  doc: Document;
  className?: string;
  /** Permet à la page parente de comptabiliser le téléchargement. */
  onDownload?: (doc: Document) => void;
}

/**
 * Affiche le document dans le lecteur natif du navigateur, avec la même
 * présentation que la bibliothèque de documents de référence.
 */
export function DocumentCard({ doc, className, onDownload }: DocumentCardProps) {
  const isPdf = doc.format?.toLowerCase() === 'pdf' || /\.pdf(?:$|[?#])/i.test(doc.fichier);

  return (
    <article className={cn('flex min-w-0 flex-col', className)}>
      <div className="overflow-hidden bg-[#292929] shadow-sm">
        {isPdf ? (
          <iframe
            src={`${doc.fichier}#view=FitH`}
            title={`Aperçu : ${doc.titre}`}
            className="block h-[360px] w-full border-0"
            loading="lazy"
          />
        ) : (
          <a
            href={doc.fichier}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[360px] flex-col items-center justify-center gap-3 bg-slate-100 px-6 text-center text-slate-600 hover:bg-slate-200"
          >
            <FileText className="h-12 w-12 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium">Aperçu disponible à l’ouverture</span>
          </a>
        )}
      </div>

      <h3 className="mt-5 min-h-12 text-lg font-medium leading-snug text-primary line-clamp-2">
        {doc.titre}
      </h3>

      {onDownload ? (
        <button
          type="button"
          onClick={() => onDownload(doc)}
          className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Télécharger
        </button>
      ) : (
        <a
          href={doc.fichier}
          download
          className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Télécharger
        </a>
      )}
    </article>
  );
}
