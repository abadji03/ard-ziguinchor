'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { adminActualites } from '@/services/admin.service';
import { slugify } from '@/lib/utils';

const schema = z.object({
  titre:          z.string().min(5, 'Titre requis (min 5 car.)'),
  slug:           z.string().min(3, 'Slug requis'),
  resume:         z.string().optional(),
  contenu:        z.string().min(10, 'Contenu requis'),
  statut:         z.enum(['brouillon', 'publie', 'archive']),
  datePublication:z.string().optional(),
  imagePrincipale:z.string().optional(),
  tags:           z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STATUT_OPTIONS = [
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'publie',    label: 'Publié'    },
  { value: 'archive',   label: 'Archivé'   },
];

export default function NewActualitePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'brouillon' },
  });

  const titre = watch('titre');

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminActualites.create({
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-actualites'] });
      router.push('/admin/actualites');
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/actualites" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle actualité</h1>
          <p className="text-sm text-gray-500">Créer un nouvel article</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Une erreur s&apos;est produite. Vérifiez les champs et réessayez.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 space-y-4">
            <Input
              label="Titre"
              {...register('titre')}
              error={errors.titre?.message}
              required
              onBlur={() => { if (titre && !watch('slug')) setValue('slug', slugify(titre)); }}
            />
            <Input
              label="Slug (URL)"
              {...register('slug')}
              error={errors.slug?.message}
              required
              placeholder="exemple-de-slug"
            />
            <Textarea
              label="Résumé"
              rows={2}
              {...register('resume')}
              placeholder="Résumé court visible dans les listes…"
            />
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
                  placeholder="Contenu de l'article…"
                />
              )}
            />
          </div>
        </Card>

        <Card>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Statut"
                options={STATUT_OPTIONS}
                {...register('statut')}
              />
              <Input
                label="Date de publication"
                type="datetime-local"
                {...register('datePublication')}
              />
            </div>
            <ImageUpload
              label="Image principale"
              value={watch('imagePrincipale') || ''}
              onChange={(url) => setValue('imagePrincipale', url)}
            />
            <Input
              label="Tags (séparés par des virgules)"
              {...register('tags')}
              placeholder="agriculture, santé, éducation"
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/actualites">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>
            Créer l&apos;actualité
          </Button>
        </div>
      </form>
    </div>
  );
}
