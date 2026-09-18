'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Save, X, Menu } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import type { NavigationItem } from '@/types';
import { ICONES_DISPONIBLES } from '@/lib/contenus';

interface FormState {
  label: string;
  href: string;
  icone: string;
  ordre: number;
  parentId?: string;
  section: string;
  actif: boolean;
}

function InlineForm({
  defaultValues,
  parents,
  onSave,
  onCancel,
}: {
  defaultValues?: Partial<FormState>;
  parents: Pick<NavigationItem, 'id' | 'label'>[];
  onSave: (data: FormState) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    label: defaultValues?.label ?? '',
    href: defaultValues?.href ?? '',
    icone: defaultValues?.icone ?? '',
    ordre: defaultValues?.ordre ?? 0,
    parentId: defaultValues?.parentId ?? '',
    section: defaultValues?.section ?? 'header',
    actif: defaultValues?.actif ?? true,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.section) {
      alert('Libellé et section sont obligatoires.');
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
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Libellé"
          placeholder="ex: À propos"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          required
        />
        <Input
          label="Lien (href)"
          placeholder="/a-propos ou https://…"
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
          required
        />
      </div>
      <Select
        label="Section"
        value={form.section}
        onChange={(v) => setForm({ ...form, section: v })}
        options={[
          { value: 'header', label: 'Header' },
          { value: 'footer', label: 'Footer' },
          { value: 'legal', label: 'Mentions légales' },
        ]}
      />
      <Select
        label="Icône (optionnel)"
        value={form.icone}
        onChange={(v) => setForm({ ...form, icone: v })}
        options={[
          { value: '', label: 'Aucune' },
          ...ICONES_DISPONIBLES.map((i) => ({ value: i, label: i })),
        ]}
      />
      <Select
        label="Parent (sous-menu)"
        value={form.parentId || ''}
        onChange={(v) => setForm({ ...form, parentId: v || undefined })}
        options={[
          { value: '', label: 'Aucun (élément racine)' },
          ...parents.map((p) => ({ value: p.id, label: p.label })),
        ]}
      />
      <Input
        label="Ordre d'affichage"
        type="number"
        min={0}
        value={form.ordre}
        onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })}
      />
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.actif}
            onChange={(e) => setForm({ ...form, actif: e.target.checked })}
            className="rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Visible
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

export function NavigationSection() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery<NavigationItem[]>({
    queryKey: ['admin-navigation'],
    queryFn: async () => {
      const res = await api.get('/references/navigation', {
        params: { includeInactifs: 'true' },
      });
      return (res.data?.data ?? res.data) as NavigationItem[];
    },
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ['admin-navigation'] });

  const handleCreate = async (data: FormState) => {
    await api.post('/references/navigation', data);
    invalidate();
    setAdding(false);
  };
  const handleUpdate = async (id: string, data: Partial<FormState>) => {
    await api.patch(`/references/navigation/${id}`, data);
    invalidate();
    setEditingId(null);
  };
  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Supprimer le lien « ${label} » ?`)) return;
    await api.delete(`/references/navigation/${id}`);
    invalidate();
  };
  const handleToggle = async (id: string, actif: boolean) => {
    await api.patch(`/references/navigation/${id}`, { actif: !actif });
    invalidate();
  };

    const parents = items.filter((i) => !i.parentId);

  return (
    <Card>
      <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Menu className="h-4 w-4 text-emerald-700" />
          Navigation du site
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Nouveau lien
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {adding && (
          <InlineForm parents={parents} onSave={handleCreate} onCancel={() => setAdding(false)} />
        )}

        {isLoading ? (
          <p className="text-sm text-slate-400 text-center py-4">Chargement…</p>
        ) : items.length === 0 && !adding ? (
          <div className="text-center py-6 text-slate-400">
            <Menu className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun lien de navigation défini.</p>
          </div>
        ) : (
          items.map((item) =>
            editingId === item.id ? (
              <InlineForm
                key={item.id}
                parents={parents}
                defaultValues={{
                  label: item.label,
                  href: item.href,
                  icone: item.icone ?? '',
                  ordre: item.ordre,
                  parentId: item.parentId ?? '',
                  section: item.section,
                  actif: item.actif,
                }}
                onSave={(data) => handleUpdate(item.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                key={item.id}
                className={`border rounded-2xl p-4 transition-colors flex items-center justify-between ${item.actif ? 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-2xs' : 'bg-slate-50 border-slate-200/60 opacity-60'}`}
              >
                <div>
                  <span className="text-sm font-medium text-slate-800">{item.label}</span>
                  <span className="ml-2 text-xs text-slate-400 font-mono">{item.href}</span>
                  {item.parentId && (
                    <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      sous-menu
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded text-white ${
                      item.section === 'header'
                        ? 'bg-blue-500'
                        : item.section === 'footer'
                        ? 'bg-purple-500'
                        : 'bg-orange-500'
                    }`}
                  >
                    {item.section}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id, item.actif)}
                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                    title={item.actif ? 'Masquer' : 'Afficher'}
                  >
                    {item.actif ? '🟢' : '⚫'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.label)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ),
          )
        )}

        {!adding && items.length > 0 && (
          <p className="text-xs text-gray-400 pt-1">
            💡 Ordre d'affichage : modifiez le champ "Ordre". La navigation est
            lue en priorité depuis la base, avec repli vers `NAV_LINKS` codé en
            dur si aucune donnée n’est présente.
          </p>
        )}
      </div>
    </Card>
  );
}

