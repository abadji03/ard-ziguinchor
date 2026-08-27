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
import { ImageUpload } from '@/components/ui/ImageUpload';
import { LoadingState } from '@/components/ui/Spinner';
import { adminPartenaires } from '@/services/admin.service';
import { referencesService } from '@/services/references.service';
import { useQueryData } from '@/hooks/useQueryData';
import api from '@/lib/api';
import type { Partenaire } from '@/types';

const schema = z.object({
  nom:                  z.string().min(2, 'Nom requis'),
  sigle:                z.string().optional(),
  slug:                 z.string().min(2, 'Slug requis'),
  description:          z.string().min(5, 'Description requise'),
  typeId:               z.string().min(1, 'Type requis'),
  pays:                 z.string().optional(),
  ville:                z.string().optional(),
  telephone:            z.string().optional(),
  email:                z.string().email('Email invalide').optional().or(z.literal('')),
  siteWeb:              z.string().url('URL invalide').optional().or(z.literal('')),
  facebook:             z.string().url('URL invalide').optional().or(z.literal('')),
  linkedin:             z.string().url('URL invalide').optional().or(z.literal('')),
  twitter:              z.string().url('URL invalide').optional().or(z.literal('')),
  statut:               z.enum(['actif', 'inactif']),
  logo:                 z.string().optional(),
  dateDebutPartenariat: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function EditPartenairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc     = useQueryClient();

  const { data: typesPartenaires } = useQueryData(['types-partenaires'], () => referencesService.getTypesPartenaires());
  const typeOptions = (typesPartenaires ?? []).map(t => ({ value: t.id, label: t.nom }));

  const { data: partenaire, isLoading } = useQuery<Partenaire>({
    queryKey: ['partenaire-edit', id],
    queryFn: async () => { const res = await api.get(`/partenaires/${id}`); return res.data; },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'actif' },
  });

  useEffect(() => {
    if (partenaire) {
      reset({
        nom:                  partenaire.nom,
        sigle:                partenaire.sigle ?? '',
        slug:                 partenaire.slug,
        description:          partenaire.description,
        typeId:               partenaire.type.id,
        pays:                 partenaire.pays ?? '',
        ville:                partenaire.ville ?? '',
        telephone:            partenaire.telephone ?? '',
        email:                partenaire.email ?? '',
        siteWeb:              partenaire.siteWeb ?? '',
        facebook:             partenaire.facebook ?? '',
        linkedin:             partenaire.linkedin ?? '',
        twitter:              partenaire.twitter ?? '',
        statut:               partenaire.statut as FormData['statut'],
        logo:                 partenaire.logo ?? '',
        dateDebutPartenariat: partenaire.dateDebutPartenariat ? String(partenaire.dateDebutPartenariat).slice(0, 10) : '',
      });
    }
  }, [partenaire, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminPartenaires.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-partenaires'] });
      router.push('/admin/partenaires');
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/partenaires" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le partenaire</h1>
          <p className="text-sm text-gray-500">Mettre à jour les informations du partenaire</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la modification.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
<Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold text-gray-900">Informations</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nom complet" {...register('nom')} error={errors.nom?.message} required />
              <Input label="Sigle / Acronyme" {...register('sigle')} />
            </div>
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} required />
            <Textarea label="Description" rows={4} {...register('description')} error={errors.description?.message} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Type de partenaire" options={typeOptions} {...register('typeId')} error={errors.typeId?.message} required placeholder="Sélectionner…" />
              <Select label="Statut" options={[{ value: 'actif', label: 'Actif' }, { value: 'inactif', label: 'Inactif' }]} {...register('statut')} />
            </div>
            <ImageUpload label="Logo" value={watch('logo') || ''} onChange={(url) => setValue('logo', url)} aspectRatio="square" />
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold text-gray-900">Coordonnées</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Pays" {...register('pays')} />
              <Input label="Ville" {...register('ville')} />
              <Input label="Téléphone" type="tel" {...register('telephone')} />
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            </div>
            <Input label="Site web" type="url" {...register('siteWeb')} error={errors.siteWeb?.message} placeholder="https://…" />
            <Input label="Date début partenariat" type="date" {...register('dateDebutPartenariat')} />
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold text-gray-900">Réseaux sociaux</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Facebook" type="url" {...register('facebook')} error={errors.facebook?.message} placeholder="https://…" />
              <Input label="LinkedIn" type="url" {...register('linkedin')} error={errors.linkedin?.message} placeholder="https://…" />
              <Input label="Twitter" type="url"  {...register('twitter')}  error={errors.twitter?.message}  placeholder="https://…" />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/partenaires">
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