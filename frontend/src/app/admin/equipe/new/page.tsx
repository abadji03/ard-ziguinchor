'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { adminMembres } from '@/services/admin.service';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Select } from '@/components/ui/Select';
import { useDirectionsArd } from '@/hooks/useContenus';

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

export default function NewMembrePage() {
  const router = useRouter();
  const qc     = useQueryClient();
  const directions = useDirectionsArd();

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ordre: 0 },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminMembres.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-membres'] });
      router.push('/admin/equipe');
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/equipe" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau membre</h1>
          <p className="text-sm text-gray-500">Ajouter un membre à l&apos;équipe</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Prénom" {...register('prenom')} error={errors.prenom?.message} required />
              <Input label="Nom" {...register('nom')} error={errors.nom?.message} required />
            </div>
            <Input label="Fonction / Poste" {...register('fonction')} error={errors.fonction?.message} required />
            <Select
              label="Direction rattachée"
              options={directions.map((d) => ({ value: d.value, label: d.label }))}
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
            Ajouter le membre
          </Button>
        </div>
      </form>
    </div>
  );
}
