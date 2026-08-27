'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import { LoadingState } from '@/components/ui/Spinner';
import { adminOpportunites, adminDocuments } from '@/services/admin.service';
import { referencesService } from '@/services/references.service';
import { useQueryData } from '@/hooks/useQueryData';
import api from '@/lib/api';
import { slugify } from '@/lib/utils';
import type { Opportunite } from '@/types';

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

export default function EditOpportunitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc     = useQueryClient();

  // Document joint — permet de remplacer/ajouter un document à l'édition
  const [pendingDoc, setPendingDoc] = useState<{ url: string; taille: number } | null>(null);

  const { data: typesOpportunites } = useQueryData(['types-opportunites'], () => referencesService.getTypesOpportunites());
  const typeOptions = (typesOpportunites ?? []).map(t => ({ value: t.id, label: t.nom }));

  const { data: opportunite, isLoading } = useQuery<Opportunite>({
    queryKey: ['opportunite-edit', id],
    queryFn: async () => { const res = await api.get(`/opportunites/${id}`); return res.data; },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'ouvert' },
  });

  useEffect(() => {
    if (opportunite) {
      reset({
        titre:       opportunite.titre,
        slug:        opportunite.slug,
        resume:      opportunite.resume ?? '',
        description: opportunite.description,
        typeId:      opportunite.type.id,
        organisme:   opportunite.organisme,
        secteur:     opportunite.secteur ?? '',
        statut:      opportunite.statut as FormData['statut'],
        conditions:  opportunite.conditions ?? '',
        lienExterne: opportunite.lienExterne ?? '',
        dateLimite:  opportunite.dateLimite ? String(opportunite.dateLimite).slice(0, 16).replace('T', ' ') : '',
      });
    }
  }, [opportunite, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Si un nouveau fichier a été uploadé, on crée d'abord sa fiche Document
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
      return adminOpportunites.update(id, { ...data, documentId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-opportunites'] });
      router.push('/admin/opportunites');
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/opportunites" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l&apos;opportunité</h1>
          <p className="text-sm text-gray-500">Mettre à jour les informations de l&apos;opportunité</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la modification.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
<Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Informations</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input label="Titre" {...register('titre')} error={errors.titre?.message} required />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} required />
            <Textarea label="Résumé" rows={2} {...register('resume')} />
            <Textarea label="Description" rows={6} {...register('description')} error={errors.description?.message} required />
            <Textarea label="Conditions" rows={3} {...register('conditions')} placeholder="Conditions de participation…" />
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Détails</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Type" options={typeOptions} {...register('typeId')} error={errors.typeId?.message} required placeholder="Sélectionner…" />
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
              documentUrl={opportunite?.document?.fichier}
              onUploaded={(data) => setPendingDoc(data.url ? { url: data.url, taille: data.taille } : null)}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/opportunites">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
}