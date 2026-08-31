'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import { adminOpportunites, adminDocuments } from '@/services/admin.service';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { slugify } from '@/lib/utils';
import { useQueryData } from '@/hooks/useQueryData';
import { referencesService } from '@/services/references.service';

const schema = z.object({
  titre:       z.string().min(5, 'Titre requis'),
  slug:        z.string().min(3, 'Slug requis'),
  resume:      z.string().optional(),
  description: z.string().min(10, 'Description requise'),
  typeId:      z.string().min(1, 'Type requis'),
  organisme:   z.string().min(2, 'Organisme requis'),
  secteur:     z.string().optional(),
  dateLimite:  z.string().optional(),
  statut:      z.enum(['ouvert', 'ferme', 'expire']),
  conditions:  z.string().optional(),
  lienExterne: z.string().url('URL invalide').optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

export default function NewOpportunitePage() {
  const router = useRouter();
  const qc     = useQueryClient();

  const [pendingDoc, setPendingDoc] = useState<{ url: string; taille: number } | null>(null);

  const { data: typesOpportunites } = useQueryData(
    ['types-opportunites'],
    () => referencesService.getTypesOpportunites(),
  );

  const typeOptions = (typesOpportunites ?? []).map(t => ({ value: t.id, label: t.nom }));

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'ouvert' },
  });

  const titre = watch('titre');

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      let documentId: string | undefined;
      if (pendingDoc?.url) {
        const ext = pendingDoc.url.split('?')[0].split('.').pop() ?? '';
        const doc = await adminDocuments.create<{ id: string }>({
          titre:             `Document — ${data.titre}`,
          slug:              `${slugify(data.titre)}-${Date.now()}`,
          fichier:           pendingDoc.url,
          taille:            pendingDoc.taille,
          format:            ext,
          typePlanification: 'AUTRE',
          statut:            'publie',
          langue:            'fr',
        });
        documentId = doc.id;
      }
      return adminOpportunites.create({ ...data, documentId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-opportunites'] });
      router.push('/admin/opportunites');
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/opportunites" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle opportunité</h1>
          <p className="text-sm text-gray-500">Appel à projets, offre ou formation</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la création.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Informations</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input
              label="Titre"
              {...register('titre')}
              error={errors.titre?.message}
              required
              onBlur={() => { if (titre && !watch('slug')) setValue('slug', slugify(titre)); }}
            />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} required />
            <Textarea label="Résumé" rows={2} {...register('resume')} />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <RichTextEditor
                  label="Description"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.description?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="conditions"
              render={({ field }) => (
                <RichTextEditor
                  label="Conditions"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  minHeight="150px"
                />
              )}
            />
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Détails</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Type"
                options={typeOptions}
                {...register('typeId')}
                error={errors.typeId?.message}
                required
                placeholder="Sélectionner…"
              />
              <Select
                label="Statut"
                options={[
                  { value: 'ouvert', label: 'Ouvert' },
                  { value: 'ferme',  label: 'Fermé'  },
                  { value: 'expire', label: 'Expiré' },
                ]}
                {...register('statut')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Organisme" {...register('organisme')} error={errors.organisme?.message} required />
              <Input label="Secteur" {...register('secteur')} placeholder="Agriculture, Santé…" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Date limite" type="datetime-local" {...register('dateLimite')} />
              <Input label="Lien externe" type="url" {...register('lienExterne')} error={errors.lienExterne?.message} placeholder="https://…" />
            </div>
          </div>
        </Card>

        {/* Document joint */}
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Document joint</h2>
          </div>
          <div className="p-5">
            <DocumentUpload
              label="Dossier d'appel, termes de référence, offre…"
              documentUrl={pendingDoc?.url}
              onUploaded={(data) => setPendingDoc(data.url ? { url: data.url, taille: data.taille } : null)}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/opportunites">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>
            Créer l&apos;opportunité
          </Button>
        </div>
      </form>
    </div>
  );
}
