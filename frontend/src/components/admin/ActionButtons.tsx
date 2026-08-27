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
    <div className="flex items-center gap-1">
      {viewHref && (
        <Link href={viewHref} target="_blank" aria-label="Voir"
          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
          <Eye className="h-4 w-4" />
        </Link>
      )}
      {editHref && (
        <Link href={editHref} aria-label="Modifier"
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Pencil className="h-4 w-4" />
        </Link>
      )}
      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          aria-label={confirming ? 'Confirmer la suppression' : 'Supprimer'}
          title={confirming ? `Confirmer la suppression de ${deleteLabel}` : 'Supprimer'}
          className={`p-1.5 rounded-lg transition-colors text-xs ${
            confirming
              ? 'bg-red-600 text-white px-2 py-1 font-medium'
              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          {confirming ? (deleting ? '…' : 'Confirmer') : <Trash2 className="h-4 w-4" />}
        </button>
      )}
      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className="p-1 text-xs text-gray-400 hover:text-gray-600"
          aria-label="Annuler"
        >
          ✕
        </button>
      )}
    </div>
  );
}
