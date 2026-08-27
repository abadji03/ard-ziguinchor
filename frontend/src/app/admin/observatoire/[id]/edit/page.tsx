'use client';

import { use, useEffect } from 'react';
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
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { useQueryData } from '@/hooks/useQueryData';
import api from '@/lib/api';
import type { Indicateur } from '@/types';

const schema = z.object({
  nom:           z.string().min(2, 'Nom requis'),
  slug:          z.string().min(2, 'Slug requis'),
  description:   z.string().optional(),
  valeur:        z.coerce.number().min(0, 'Valeur requise'),
  unite:         z.string().min(1, 'Unité requise'),
  annee:         z.coerce.number().min(1900).max(2100),
  source:        z.string().optional(),
  secteurId:     z.string().optional(),
  departementId: z.string().optional(),
  communeId:     z.string().optional(),
});
type FormData = z.infer<typeof schema>;

// Les <Select> placeholder renvoient "" quand aucun ciblage n'est choisi.
// "" n'est pas un identifiant valide → conversion en undefined (axios omet les
// clés undefined en JSON) pour éviter une violation de clé étrangère (P2003).
function sanitizeTerritoire(data: FormData) {
  return {
    ...data,
    secteurId:     data.secteurId || undefined,
    departementId: data.departementId || undefined,
    communeId:     data.communeId || undefined,
  };
}

export default function EditIndicateurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc     = useQueryClient();

  const { data: indicateur, isLoading } = useQuery<Indicateur>({
    queryKey: ['indicateur-edit', id],
    queryFn: async () => { const res = await api.get(`/indicateurs/${id}`); return res.data; },
  });

  const { data: secteurs }     = useQueryData(['secteurs'], () => referencesService.getSecteurs());
  const { data: departements } = useQueryData(['departements'], () => referencesService.getDepartements());

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const departementId = watch('departementId');
  const { data: communes } = useQueryData(
    ['communes-edit', departementId ?? 'all', id],
    () => referencesService.getCommunes(departementId || undefined),
  );

  const secteurOptions     = (secteurs ?? []).map(s => ({ value: s.id, label: s.nom }));
  const departementOptions = (departements ?? []).map(d => ({ value: d.id, label: d.nom }));
  const communeOptions     = (communes ?? []).map(c => ({ value: c.id, label: c.nom }));

  useEffect(() => {
    if (indicateur) {
      reset({
        nom:           indicateur.nom,
        slug:          indicateur.slug,
        description:   indicateur.description ?? '',
        valeur:        indicateur.valeur,
        unite:         indicateur.unite,
        annee:         indicateur.annee,
        source:        indicateur.source ?? '',
        secteurId:     indicateur.secteur?.id ?? '',
        departementId: indicateur.departement?.id ?? '',
        communeId:     indicateur.commune?.id ?? '',
      });
    }
  }, [indicateur, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.patch(`/indicateurs/${id}`, sanitizeTerritoire(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-indicateurs'] });
      router.push('/admin/observatoire');
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/observatoire" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l&apos;indicateur</h1>
          <p className="text-sm text-gray-500">Mettre à jour les données de l&apos;indicateur</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la modification.
        </div>
      )}
<form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 space-y-4">
            <Input
              label="Nom de l'indicateur"
              {...register('nom')}
              error={errors.nom?.message}
              required
            />
            <Input
              label="Slug"
              {...register('slug')}
              error={errors.slug?.message}
              required
            />
            <Textarea label="Description" rows={3} {...register('description')} />
          </div>
        </Card>

        <Card>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Valeur"
                type="number"
                step="any"
                min={0}
                {...register('valeur')}
                error={errors.valeur?.message}
                required
              />
              <Input label="Unité" {...register('unite')} error={errors.unite?.message} required placeholder="hab, %, FCFA…" />
              <Input
                label="Année"
                type="number"
                min={1900}
                max={2100}
                {...register('annee')}
                error={errors.annee?.message}
                required
              />
            </div>
            <Input label="Source" {...register('source')} placeholder="ANSD, ministère…" />
          </div>
        </Card>

        <Card>
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-500">Ciblage territorial (optionnel)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select label="Secteur" placeholder="Aucun" options={secteurOptions} {...register('secteurId')} />
              <Select label="Département" placeholder="Région" options={departementOptions} {...register('departementId')} />
              <Select label="Commune" placeholder="Aucune" options={communeOptions} {...register('communeId')} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/observatoire">
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