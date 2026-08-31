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
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { LoadingState } from '@/components/ui/Spinner';
import { adminActualites } from '@/services/admin.service';
import api from '@/lib/api';
import type { Actualite } from '@/types';

const schema = z.object({
  titre:           z.string().min(5, 'Titre requis'),
  slug:            z.string().min(3, 'Slug requis'),
  resume:          z.string().optional(),
  contenu:         z.string().min(10, 'Contenu requis'),
  statut:          z.enum(['brouillon', 'publie', 'archive']),
  datePublication: z.string().optional(),
  imagePrincipale: z.string().optional(),
  tags:            z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const STATUT_OPTIONS = [
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'publie',    label: 'Publié'    },
  { value: 'archive',   label: 'Archivé'   },
];

export default function EditActualitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const qc      = useQueryClient();

  const { data: actu, isLoading } = useQuery<Actualite>({
    queryKey: ['actualite-edit', id],
    queryFn: async () => { const res = await api.get(`/actualites/${id}`); return res.data; },
  });

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (actu) {
      reset({
        titre:           actu.titre,
        slug:            actu.slug,
        resume:          actu.resume ?? '',
        contenu:         actu.contenu,
        statut:          actu.statut as 'brouillon' | 'publie' | 'archive',
        datePublication: actu.datePublication?.slice(0, 16) ?? '',
        imagePrincipale: actu.imagePrincipale ?? '',
        tags:            actu.tags?.join(', ') ?? '',
      });
    }
  }, [actu, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminActualites.update(id, {
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-actualites'] });
      qc.invalidateQueries({ queryKey: ['actualite-edit', id] });
      router.push('/admin/actualites');
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/actualites" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l&apos;actualité</h1>
          <p className="text-sm text-gray-500 truncate max-w-md">{actu?.titre}</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la mise à jour.
        </div>
      )}
      {mutation.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
          Actualité mise à jour avec succès.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 space-y-4">
            <Input label="Titre" {...register('titre')} error={errors.titre?.message} required />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} required />
            <Textarea label="Résumé" rows={2} {...register('resume')} />
            <Controller
              control={control}
              name="contenu"
              render={({ field }) => (
                <RichTextEditor
                  label="Contenu"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.contenu?.message}
                  required
                />
              )}
            />
          </div>
        </Card>
        <Card>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Statut" options={STATUT_OPTIONS} {...register('statut')} />
              <Input label="Date de publication" type="datetime-local" {...register('datePublication')} />
            </div>
            <ImageUpload
              label="Image principale"
              value={watch('imagePrincipale') || ''}
              onChange={(url) => setValue('imagePrincipale', url)}
            />
            <Input label="Tags (séparés par des virgules)" {...register('tags')} />
          </div>
        </Card>
        <div className="flex justify-end gap-3">
          <Link href="/admin/actualites">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>Sauvegarder</Button>
        </div>
      </form>
    </div>
  );
}
