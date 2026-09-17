'use client';

import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ActionButtonsProps {
  viewHref?: string;
  editHref?: string;
  onDelete?: () => Promise<void> | void;
  deleteLabel?: string;
}

export function ActionButtons({ viewHref, editHref, onDelete, deleteLabel = 'cet élément' }: ActionButtonsProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return; }
    setDeleting(true);
    try { await onDelete?.(); } finally { setDeleting(false); setConfirming(false); }
  };

  return (
    <div className="flex items-center gap-1.5 justify-end">
      {viewHref && (
        <Link
          href={viewHref}
          target="_blank"
          aria-label="Voir"
          title="Consulter publiquement"
          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-transparent hover:border-emerald-200/50"
        >
          <Eye className="h-4 w-4" />
        </Link>
      )}
      {editHref && (
        <Link
          href={editHref}
          aria-label="Modifier"
          title="Modifier"
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-200/50"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      )}
      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          aria-label={confirming ? 'Confirmer la suppression' : 'Supprimer'}
          title={confirming ? `Confirmer la suppression de ${deleteLabel}` : 'Supprimer'}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            confirming
              ? 'bg-rose-600 text-white px-2.5 py-1 font-bold text-xs shadow-xs hover:bg-rose-700'
              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/50'
          }`}
        >
          {confirming ? (deleting ? '…' : 'Confirmer ?') : <Trash2 className="h-4 w-4" />}
        </button>
      )}
      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Annuler"
        >
          ✕
        </button>
      )}
    </div>
  );
}
