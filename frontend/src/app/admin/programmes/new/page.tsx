'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { adminProgrammes, adminDocuments } from '@/services/admin.service';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { slugify } from '@/lib/utils';

const schema = z.object({
  nom:             z.string().min(3, 'Nom requis'),
  acronyme:        z.string().optional(),
  slug:            z.string().min(3, 'Slug requis'),
  resume:          z.string().optional(),
  description:     z.string().min(10, 'Description requise'),
  objectifs:       z.string().optional(),
  organismePilote: z.string().optional(),
  dateDebut:       z.string().optional(),
  dateFin:         z.string().optional(),
  budget:          z.string().optional(),
  statut:          z.enum(['actif','termine','suspendu']),
  image:           z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function NewProgrammePage() {
  const router = useRouter();
  const qc     = useQueryClient();

  const [pendingDoc, setPendingDoc] = useState<{ url: string; taille: number } | null>(null);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'actif' },
  });

  const nom = watch('nom');

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      let documentId: string | undefined;
      if (pendingDoc?.url) {
        const ext = pendingDoc.url.split('?')[0].split('.').pop() ?? '';
        const doc = await adminDocuments.create<{ id: string }>({
          titre:             `Document — ${data.nom}`,
          slug:              `${slugify(data.nom)}-${Date.now()}`,
          fichier:           pendingDoc.url,
          taille:            pendingDoc.taille,
          format:            ext,
          typePlanification: 'AUTRE',
          statut:            'publie',
          langue:            'fr',
        });
        documentId = doc.id;
      }
      return adminProgrammes.create({
        ...data,
        documentId,
        budget: data.budget ? parseFloat(data.budget) : undefined,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-programmes'] });
      router.push('/admin/programmes');
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/programmes" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau programme</h1>
          <p className="text-sm text-gray-500">Créer un programme de développement</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la création.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold">Informations</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Nom du programme"
                  {...register('nom')}
                  error={errors.nom?.message}
                  required
                  onBlur={() => { if (nom && !watch('slug')) setValue('slug', slugify(nom)); }}
                />
              </div>
              <Input label="Acronyme" {...register('acronyme')} placeholder="ex: PADL" />
            </div>
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
              <Input label="Organisme pilote" {...register('organismePilote')} />
              <Select
                label="Statut"
                options={[
                  { value: 'actif',    label: 'Actif'    },
                  { value: 'termine',  label: 'Terminé'  },
                  { value: 'suspendu', label: 'Suspendu' },
                ]}
                {...register('statut')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Date de début" type="date" {...register('dateDebut')} />
              <Input label="Date de fin" type="date" {...register('dateFin')} />
            </div>
            <Input label="Budget (FCFA)" type="number" {...register('budget')} />
          </div>
        </Card>

        {/* Image & Document */}
        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold">Image &amp; Document</h2></div>
          <div className="p-5 space-y-5">
            <ImageUpload
              label="Image"
              value={watch('image') || ''}
              onChange={(url) => setValue('image', url)}
            />
            <DocumentUpload
              label="Document joint (rapport, fiche programme…)"
              documentUrl={pendingDoc?.url}
              onUploaded={(data) => setPendingDoc(data.url ? { url: data.url, taille: data.taille } : null)}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/programmes"><Button variant="outline" type="button">Annuler</Button></Link>
          <Button type="submit" loading={mutation.isPending}>Créer le programme</Button>
        </div>
      </form>
    </div>
  );
}
