'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Save, X, Globe, Power } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import type { ContenuStatique } from '@/types';

interface FormState {
  cle: string;
  titre: string;
  contenu: string;
  actif: boolean;
}

function InlineForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  defaultValues?: Partial<FormState>;
  onSave: (data: FormState) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    cle: defaultValues?.cle ?? '',
    titre: defaultValues?.titre ?? '',
    contenu: defaultValues?.contenu ?? '',
    actif: defaultValues?.actif ?? true,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cle && !defaultValues?.cle) {
      alert('La clé est obligatoire.');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
      {!defaultValues && (
        <Input
          label="Clé (identifiant unique)"
          placeholder="ex: mentions-legales"
          value={form.cle}
          onChange={(e) => setForm({ ...form, cle: e.target.value })}
          required
        />
      )}
      <Input
        label="Titre"
        placeholder="Titre affiché dans l'onglet / SEO"
        value={form.titre}
        onChange={(e) => setForm({ ...form, titre: e.target.value })}
      />
      <Textarea
        label="Contenu (HTML autorisé)"
        rows={5}
        placeholder="<p>Votre texte institutionnel…</p>"
        value={form.contenu}
        onChange={(e) => setForm({ ...form, contenu: e.target.value })}
      />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.actif}
            onChange={(e) => setForm({ ...form, actif: e.target.checked })}
            className="rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Visible sur le site
        </label>
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" /> Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  );
}

function ItemRow({
  item,
  editing,
  onEdit,
  onCancelEdit,
  onSave,
  onRemove,
  onToggle,
}: {
  item: ContenuStatique;
  editing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (data: Partial<FormState>) => Promise<void>;
  onRemove: () => void;
  onToggle: () => void;
}) {
  if (editing) {
    return (
      <InlineForm
        defaultValues={{ titre: item.titre ?? '', contenu: item.contenu, actif: item.actif }}
        onSave={async (data) => { await onSave(data); onCancelEdit(); }}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div
      className={`border rounded-2xl p-4 transition-colors ${item.actif ? 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-2xs' : 'bg-slate-50 border-slate-200/60 opacity-60'}`}
    >
      <div className="flex items-baseline gap-2 flex-wrap mb-2">
        <span className="text-sm font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
          {item.cle}
        </span>
        <span className="text-sm font-bold text-slate-900">{item.titre}</span>
        {!item.actif && (
          <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
            masqué
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 line-clamp-3 mb-3">{item.contenu}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
          title={item.actif ? 'Masquer sur le site' : 'Afficher sur le site'}
        >
          {item.actif ? <Power className="h-4 w-4" /> : <Power className="h-4 w-4 opacity-40" />}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
          title="Modifier"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ContenusStatiquesSection() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery<ContenuStatique[]>({
    queryKey: ['admin-contenus-statiques'],
    queryFn: async () => {
      const res = await api.get('/references/contenus-statiques', {
        params: { includeInactifs: 'true' },
      });
      return (res.data?.data ?? res.data) as ContenuStatique[];
    },
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ['admin-contenus-statiques'] });

  const handleCreate = async (data: FormState) => {
    await api.post('/references/contenus-statiques', data);
    invalidate();
    setAdding(false);
  };
  const handleUpdate = async (id: string, data: Partial<FormState>) => {
    await api.patch(`/references/contenus-statiques/${id}`, data);
    invalidate();
    setEditingId(null);
  };
  const handleDelete = async (id: string, cle: string) => {
    if (!confirm(`Supprimer le contenu « ${cle} » ?`)) return;
    await api.delete(`/references/contenus-statiques/${id}`);
    invalidate();
  };
  const handleToggle = async (id: string, actif: boolean) => {
    await api.patch(`/references/contenus-statiques/${id}`, { actif: !actif });
    invalidate();
  };

  return (
    <Card>
      <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-700" />
          Contenus statiques (pages légales, discours…)
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Nouveau contenu
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {adding && (
          <InlineForm onSave={handleCreate} onCancel={() => setAdding(false)} />
        )}

        {isLoading ? (
          <p className="text-sm text-slate-400 text-center py-4">Chargement…</p>
        ) : items.length === 0 && !adding ? (
          <div className="text-center py-6 text-slate-400">
            <Globe className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun contenu statique défini.</p>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm text-emerald-700 border border-emerald-300 rounded-xl hover:bg-emerald-50 font-semibold cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Créer le premier contenu
            </button>
          </div>
        ) : (
          items.map((item) =>
            editingId === item.id ? (
              <InlineForm
                key={item.id}
                defaultValues={{
                  titre: item.titre ?? '',
                  contenu: item.contenu,
                  actif: item.actif,
                }}
                onSave={(data) => handleUpdate(item.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <ItemRow
                key={item.id}
                item={item}
                editing={false}
                onEdit={() => setEditingId(item.id)}
                onCancelEdit={() => setEditingId(null)}
                onSave={async () => {}}
                onRemove={() => handleDelete(item.id, item.cle)}
                onToggle={() => handleToggle(item.id, item.actif)}
              />
            ),
          )
        )}

        <p className="text-xs text-gray-400 pt-1">
          💡 Ces textes alimentent les pages publiques (Mentions légales,
          Confidentialité, Accessibilité, Mot du directeur…) lorsqu'aucun
          contenu n'est stocké en base, le site se rabat sur les versions
          codées en dur.
        </p>
      </div>
    </Card>
  );
}

