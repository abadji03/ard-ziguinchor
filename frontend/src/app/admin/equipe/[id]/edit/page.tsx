'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { LoadingState } from '@/components/ui/Spinner';
import { adminMembres } from '@/services/admin.service';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import api from '@/lib/api';
import type { Membre } from '@/types';
import { Select } from '@/components/ui/Select';
import { DIRECTIONS_ARD } from '@/lib/directions';

const schema = z.object({
  nom:       z.string().min(2, 'Nom requis'),
  prenom:    z.string().min(2, 'Prénom requis'),
  fonction:  z.string().min(2, 'Fonction requise'),
  direction: z.string().optional(),
  bio:       z.string().optional(),
  photo:     z.string().optional(),
  email:     z.string().email('Email invalide').optional().or(z.literal('')),
  telephone: z.string().optional(),
  ordre:     z.number().min(0),
});
type FormData = z.infer<typeof schema>;

export default function EditMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc     = useQueryClient();

  const { data: membre, isLoading } = useQuery<Membre>({
    queryKey: ['membre-edit', id],
    queryFn: async () => { const res = await api.get(`/membres/${id}`); return res.data; },
  });

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (membre) {
      reset({
        nom:       membre.nom,
        prenom:    membre.prenom,
        fonction:  membre.fonction,
        direction: membre.direction ?? '',
        bio:       membre.bio ?? '',
        photo:     membre.photo ?? '',
        email:     membre.email ?? '',
        telephone: membre.telephone ?? '',
        ordre:     membre.ordre ?? 0,
      });
    }
  }, [membre, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminMembres.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-membres'] });
      router.push('/admin/equipe');
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/equipe" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le membre</h1>
          <p className="text-sm text-gray-500">Mettre à jour les informations du membre</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Prénom" {...register('prenom')} error={errors.prenom?.message} required />
              <Input label="Nom" {...register('nom')} error={errors.nom?.message} required />
            </div>
            <Input label="Fonction / Poste" {...register('fonction')} error={errors.fonction?.message} required />
            <Select
              label="Direction rattachée"
              options={DIRECTIONS_ARD.map((d) => ({ value: d.value, label: d.label }))}
              {...register('direction')}
              placeholder="Non renseignée"
            />
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <RichTextEditor
                  label="Biographie"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  minHeight="150px"
                />
              )}
            />
            <ImageUpload
              label="Photo"
              value={watch('photo') || ''}
              onChange={(url) => setValue('photo', url)}
              aspectRatio="square"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
              <Input label="Téléphone" type="tel" {...register('telephone')} />
            </div>
            <Input
              label="Ordre d'affichage"
              type="number"
              min={0}
              {...register('ordre', { valueAsNumber: true })}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/equipe">
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
