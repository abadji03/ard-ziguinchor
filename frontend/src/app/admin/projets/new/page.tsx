'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { ImageUpload } from '@/components/ui/ImageUpload';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import { adminProjets, adminDocuments } from '@/services/admin.service';
import { slugify } from '@/lib/utils';
import { useQueryData } from '@/hooks/useQueryData';
import { referencesService } from '@/services/references.service';

const schema = z.object({
  titre:            z.string().min(5, 'Titre requis'),
  slug:             z.string().min(3, 'Slug requis'),
  resume:           z.string().optional(),
  description:      z.string().min(10, 'Description requise'),
  objectifs:        z.string().optional(),
  statut:           z.enum(['planifie','encours','realise','suspendu']),
  niveauAvancement: z.number().min(0).max(100),
  budget:           z.string().optional(),
  dateDebut:        z.string().optional(),
  dateFin:          z.string().optional(),
  beneficiaires:    z.string().optional(),
  secteurId:        z.string().min(1, 'Secteur requis'),
  departementId:    z.string().optional(),
  imagePrincipale:  z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STATUT_OPTIONS = [
  { value: 'planifie', label: 'Planifié'  },
  { value: 'encours',  label: 'En cours'  },
  { value: 'realise',  label: 'Réalisé'   },
  { value: 'suspendu', label: 'Suspendu'  },
];

export default function NewProjetPage() {
  const router = useRouter();
  const qc = useQueryClient();

  // Document joint (upload séparé avant soumission)
  const [pendingDoc, setPendingDoc] = useState<{ url: string; taille: number } | null>(null);

  const { data: departements } = useQueryData(['departements'], () => referencesService.getDepartements());
  const { data: secteurs }     = useQueryData(['secteurs'],     () => referencesService.getSecteurs());

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'planifie', niveauAvancement: 0 },
  });

  const titre = watch('titre');

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Si un fichier a été uploadé, on crée d'abord sa fiche Document
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
      return adminProjets.create({
        ...data,
        documentId,
        budget:           data.budget        ? parseFloat(data.budget)     : undefined,
        beneficiaires:    data.beneficiaires  ? parseInt(data.beneficiaires) : undefined,
        niveauAvancement: Number(data.niveauAvancement),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-projets'] });
      router.push('/admin/projets');
    },
  });

  const deptOptions    = (departements ?? []).map(d => ({ value: d.id, label: d.nom }));
  const secteurOptions = (secteurs     ?? []).map(s => ({ value: s.id, label: s.nom }));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projets" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau projet</h1>
          <p className="text-sm text-gray-500">Créer un nouveau projet</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la création. Vérifiez les champs obligatoires.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        {/* Informations principales */}
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Informations principales</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input
              label="Titre du projet"
              {...register('titre')}
              error={errors.titre?.message}
              required
              onBlur={() => { if (titre && !watch('slug')) setValue('slug', slugify(titre)); }}
            />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} required />
            <Textarea label="Résumé" rows={2} {...register('resume')} />
            <Textarea
              label="Description"
              rows={6}
              {...register('description')}
              error={errors.description?.message}
              required
              placeholder="Description complète du projet…"
            />
            <Textarea label="Objectifs" rows={3} {...register('objectifs')} />
          </div>
        </Card>

        {/* Détails */}
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Détails</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Statut" options={STATUT_OPTIONS} {...register('statut')} />
              <Input
                label="Avancement (%)"
                type="number"
                min={0} max={100}
                {...register('niveauAvancement', { valueAsNumber: true })}
                error={errors.niveauAvancement?.message}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Budget (FCFA)" type="number" {...register('budget')} />
              <Input label="Bénéficiaires" type="number" {...register('beneficiaires')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Date de début" type="date" {...register('dateDebut')} />
              <Input label="Date de fin prévue" type="date" {...register('dateFin')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Secteur"
                options={secteurOptions}
                {...register('secteurId')}
                error={errors.secteurId?.message}
                required
                placeholder="Sélectionner…"
              />
              <Select
                label="Département"
                options={deptOptions}
                {...register('departementId')}
                placeholder="Sélectionner…"
              />
            </div>
          </div>
        </Card>

        {/* Médias et documents */}
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Image &amp; Document</h2>
          </div>
          <div className="p-5 space-y-5">
            <ImageUpload
              label="Image principale"
              value={watch('imagePrincipale') || ''}
              onChange={(url) => setValue('imagePrincipale', url)}
            />
            <DocumentUpload
              label="Document joint (rapport, fiche projet…)"
              documentUrl={pendingDoc?.url}
              onUploaded={(data) => setPendingDoc(data.url ? { url: data.url, taille: data.taille } : null)}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/projets">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>
            Créer le projet
          </Button>
        </div>
      </form>
    </div>
  );
}
