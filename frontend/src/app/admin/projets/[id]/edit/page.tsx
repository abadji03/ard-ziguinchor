'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
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
import { ImageUpload } from '@/components/ui/ImageUpload';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { LoadingState } from '@/components/ui/Spinner';
import { adminProjets, adminDocuments } from '@/services/admin.service';
import { referencesService } from '@/services/references.service';
import { partenairesService } from '@/services/partenaires.service';
import { useQueryData } from '@/hooks/useQueryData';
import api from '@/lib/api';
import { slugify } from '@/lib/utils';
import type { Projet } from '@/types';

const schema = z.object({
  titre:           z.string().min(5, 'Titre requis'),
  slug:            z.string().min(3, 'Slug requis'),
  resume:          z.string().optional(),
  description:     z.string().min(10, 'Description requise'),
  objectifs:       z.string().optional(),
  statut:          z.enum(['planifie','encours','realise','suspendu']),
  niveauAvancement:z.number().min(0).max(100),
  budget:          z.string().optional(),
  dateDebut:       z.string().optional(),
  dateFin:         z.string().optional(),
  beneficiaires:   z.string().optional(),
  partenaireIds:   z.array(z.string()).optional(),
  partenairesRole: z.string().optional(),
  departementId:   z.string().optional(),
  communeId:       z.string().optional(),
  imagePrincipale: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const STATUT_OPTIONS = [
  { value: 'planifie', label: 'Planifié'  },
  { value: 'encours',  label: 'En cours'  },
  { value: 'realise',  label: 'Réalisé'   },
  { value: 'suspendu', label: 'Suspendu'  },
];

export default function EditProjetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const qc      = useQueryClient();

  // Document joint — permet de remplacer/ajouter un document à l'édition
  const [pendingDoc, setPendingDoc] = useState<{ url: string; taille: number } | null>(null);

  const { data: projet, isLoading } = useQuery<Projet>({
    queryKey: ['projet-edit', id],
    queryFn: async () => { const res = await api.get(`/projets/${id}`); return res.data; },
  });

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Référentiel territorial (départements + communes filtrées par département) et partenaires
  const departementId = watch('departementId');
  const { data: departements = [] } = useQueryData(['departements'], () => referencesService.getDepartements());
  const { data: communes = [] } = useQueryData(
    ['communes-edit', departementId ?? 'all', id],
    () => referencesService.getCommunes(departementId || undefined),
  );
  const { data: partenairesResp } = useQueryData(['partenaires-all'], () => partenairesService.getAll({ limit: 100 }));
  const partenaires = partenairesResp?.data ?? [];

  useEffect(() => {
    if (projet) {
      reset({
        titre:            projet.titre,
        slug:             projet.slug,
        resume:           projet.resume ?? '',
        description:      projet.description,
        objectifs:        projet.objectifs ?? '',
        statut:           projet.statut as FormData['statut'],
        niveauAvancement: projet.niveauAvancement,
        budget:           projet.budget?.toString() ?? '',
        dateDebut:        projet.dateDebut?.slice(0, 10) ?? '',
        dateFin:          projet.dateFin?.slice(0, 10) ?? '',
        beneficiaires:    projet.beneficiaires?.toString() ?? '',
        partenaireIds:    (projet.partenaires ?? []).map((pp) => pp.partenaire.id),
        partenairesRole:  projet.partenaires?.[0]?.role ?? '',
        departementId:    projet.departement?.id ?? '',
        communeId:        projet.commune?.id ?? '',
        imagePrincipale:  projet.imagePrincipale ?? '',
      });
    }
  }, [projet, reset]);

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
      return adminProjets.update(id, {
        ...data,
        departementId: data.departementId || undefined,
        communeId:     data.communeId || undefined,
        partenaireIds: data.partenaireIds ?? [],
        partenairesRole: data.partenairesRole || undefined,
        documentId,
        budget:           data.budget        ? parseFloat(data.budget)       : undefined,
        beneficiaires:    data.beneficiaires  ? parseInt(data.beneficiaires)  : undefined,
        niveauAvancement: Number(data.niveauAvancement),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-projets'] });
      router.push('/admin/projets');
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projets" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le projet</h1>
          <p className="text-sm text-gray-500 truncate max-w-md">{projet?.titre}</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">Erreur lors de la mise à jour.</div>
      )}
      {mutation.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">Projet mis à jour avec succès.</div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold">Informations</h2></div>
          <div className="p-5 space-y-4">
            <Input label="Titre" {...register('titre')} error={errors.titre?.message} required />
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
              name="objectifs"
              render={({ field }) => (
                <RichTextEditor
                  label="Objectifs"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  minHeight="150px"
                />
              )}
            />
          </div>
        </Card>
        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold">Détails</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Statut" options={STATUT_OPTIONS} {...register('statut')} />
              <Input label="Avancement (%)" type="number" min={0} max={100}
                {...register('niveauAvancement', { valueAsNumber: true })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Budget (FCFA)" type="number" {...register('budget')} />
              <Input label="Nombre de bénéficiaires (personnes)" type="number" min={0} {...register('beneficiaires')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Date de début" type="date" {...register('dateDebut')} />
              <Input label="Date de fin" type="date" {...register('dateFin')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Département"
                options={departements.map((d) => ({ value: d.id, label: d.nom }))}
                {...register('departementId')}
                placeholder="Région entière"
                onChange={(e) => { setValue('departementId', e.target.value); setValue('communeId', ''); }}
              />
              <Select
                label="Commune"
                options={communes.map((c) => ({ value: c.id, label: c.nom }))}
                {...register('communeId')}
                placeholder={departementId ? 'Aucune' : 'Choisir un département d’abord'}
              />
            </div>
            <ImageUpload
              label="Image principale"
              value={watch('imagePrincipale') || ''}
              onChange={(url) => setValue('imagePrincipale', url)}
            />
          </div>
        </Card>
        {/* Partenaires & portage */}
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold">Partenaires &amp; Portage</h2>
            <p className="text-xs text-gray-500 mt-1">
              Cochez les partenaires associés au projet et précisez leur rôle.
            </p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {partenaires.map((p) => {
                const checked = (watch('partenaireIds') ?? []).includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                      checked ? 'border-emerald-500 bg-emerald-50/60' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-emerald-700"
                      checked={checked}
                      onChange={(e) => {
                        const current = new Set(watch('partenaireIds') ?? []);
                        if (e.target.checked) current.add(p.id); else current.delete(p.id);
                        setValue('partenaireIds', Array.from(current));
                      }}
                    />
                    {p.logo ? (
                      <img src={p.logo} alt={p.nom} className="h-6 w-6 object-contain" />
                    ) : (
                      <span className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500">
                        {(p.sigle || p.nom).slice(0, 3).toUpperCase()}
                      </span>
                    )}
                    <span className="text-sm text-gray-800">{p.sigle || p.nom}</span>
                  </label>
                );
              })}
            </div>
            <Select
              label="Rôle des partenaires sélectionnés"
              options={[
                { value: 'financeur', label: 'Financeur' },
                { value: 'porteur', label: 'Porteur / Maîtrise d’ouvrage' },
                { value: 'executeur', label: 'Exécuteur / Maîtrise d’œuvre' },
                { value: 'technique', label: 'Partenaire technique' },
                { value: 'autre', label: 'Autre' },
              ]}
              {...register('partenairesRole')}
              placeholder="—"
            />
          </div>
        </Card>
        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold">Document joint</h2></div>
          <div className="p-5">
            <DocumentUpload
              label="Dossier, rapport, PTBA…"
              documentUrl={projet?.documents?.[0]?.fichier}
              onUploaded={(data) => setPendingDoc(data.url ? { url: data.url, taille: data.taille } : null)}
            />
          </div>
        </Card>
        <div className="flex justify-end gap-3">
          <Link href="/admin/projets"><Button variant="outline" type="button">Annuler</Button></Link>
          <Button type="submit" loading={mutation.isPending}>Sauvegarder</Button>
        </div>
      </form>
    </div>
  );
}
