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
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { adminGalerie } from '@/services/admin.service';
import { slugify } from '@/lib/utils';

const schema = z.object({
  nom:         z.string().min(2, 'Nom requis'),
  description: z.string().optional(),
  slug:        z.string().min(2, 'Slug requis'),
});
type FormData = z.infer<typeof schema>;

export default function NewGaleriePage() {
  const router = useRouter();
  const qc     = useQueryClient();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const nom = watch('nom');

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminGalerie.create<{ id: string }>(data),
    onSuccess: (galerie) => {
      qc.invalidateQueries({ queryKey: ['admin-galeries'] });
      // Redirige directement vers la page d'édition pour pouvoir ajouter des photos
      router.push(`/admin/galerie/${galerie.id}/edit`);
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/galerie" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle galerie</h1>
          <p className="text-sm text-gray-500">Étape 1 / 2 — Nommez la galerie, puis ajoutez vos photos</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la création. Veuillez réessayer.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Informations</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input
              label="Nom de la galerie"
              {...register('nom')}
              error={errors.nom?.message}
              required
              onBlur={() => { if (nom && !watch('slug')) setValue('slug', slugify(nom)); }}
            />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} required />
            <Textarea label="Description" rows={4} {...register('description')} />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/galerie">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>
            Créer et ajouter des photos →
          </Button>
        </div>
      </form>
    </div>
  );
}