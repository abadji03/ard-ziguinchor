'use client';

import { useRouter } from 'next/navigation';
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
import { referencesService } from '@/services/references.service';
import { useQueryData } from '@/hooks/useQueryData';
import { slugify } from '@/lib/utils';
import api from '@/lib/api';

const schema = z.object({
  nom:          z.string().min(2, 'Nom requis'),
  slug:         z.string().min(2, 'Slug requis'),
  description:  z.string().optional(),
  valeur:       z.coerce.number().min(0, 'Valeur requise'),
  unite:        z.string().min(1, 'Unité requise'),
  annee:        z.coerce.number().min(1900).max(2100),
  source:       z.string().optional(),
  secteurId:    z.string().optional(),
  departementId: z.string().optional(),
  communeId:    z.string().optional(),
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

export default function NewIndicateurPage() {
  const router = useRouter();
  const qc     = useQueryClient();

  const { data: secteurs }     = useQueryData(['secteurs'], () => referencesService.getSecteurs());
  const { data: departements } = useQueryData(['departements'], () => referencesService.getDepartements());

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { annee: new Date().getFullYear() },
  });

  const nom             = watch('nom');
  const departementId   = watch('departementId');
  const { data: communes } = useQueryData(
    ['communes', departementId ?? 'all'],
    () => referencesService.getCommunes(departementId || undefined),
  );

  const secteurOptions     = (secteurs ?? []).map(s => ({ value: s.id, label: s.nom }));
  const departementOptions = (departements ?? []).map(d => ({ value: d.id, label: d.nom }));
  const communeOptions     = (communes ?? []).map(c => ({ value: c.id, label: c.nom }));

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/indicateurs', sanitizeTerritoire(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-indicateurs'] });
      router.push('/admin/observatoire');
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/observatoire" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvel indicateur</h1>
          <p className="text-sm text-gray-500">Ajouter un indicateur territorial</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la création.
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
              onBlur={() => { if (nom && !watch('slug')) setValue('slug', slugify(nom)); }}
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
            Créer l'indicateur
          </Button>
        </div>
      </form>
    </div>
  );
}