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
import { LoadingState } from '@/components/ui/Spinner';
import { adminEvenements } from '@/services/admin.service';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import api from '@/lib/api';
import type { Evenement } from '@/types';

const schema = z.object({
  titre:       z.string().min(5, 'Titre requis'),
  slug:        z.string().min(3, 'Slug requis'),
  resume:      z.string().optional(),
  description: z.string().min(10, 'Description requise'),
  lieu:        z.string().min(2, 'Lieu requis'),
  dateDebut:   z.string().min(1, 'Date de début requise'),
  dateFin:     z.string().optional(),
  heureDebut:  z.string().optional(),
  heureFin:    z.string().optional(),
  organisateur:z.string().optional(),
  capacite:    z.string().optional(),
  statut:      z.enum(['a_venir','en_cours','termine','annule']),
  image:       z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function EditEvenementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc     = useQueryClient();

  const { data: evenement, isLoading } = useQuery<Evenement>({
    queryKey: ['evenement-edit', id],
    queryFn: async () => { const res = await api.get(`/evenements/${id}`); return res.data; },
  });

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'a_venir' },
  });

  useEffect(() => {
    if (evenement) {
      reset({
        titre:        evenement.titre,
        slug:         evenement.slug,
        resume:       evenement.resume ?? '',
        description:  evenement.description,
        lieu:         evenement.lieu,
        dateDebut:    evenement.dateDebut ? String(evenement.dateDebut).slice(0, 10) : '',
        dateFin:      evenement.dateFin ? String(evenement.dateFin).slice(0, 10) : '',
        heureDebut:   evenement.heureDebut ?? '',
        heureFin:     evenement.heureFin ?? '',
        organisateur: evenement.organisateur ?? '',
        capacite:     evenement.capacite?.toString() ?? '',
        statut:       evenement.statut as FormData['statut'],
        image:        evenement.image ?? '',
      });
    }
  }, [evenement, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminEvenements.update(id, {
      ...data,
      capacite: data.capacite ? parseInt(data.capacite) : undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-evenements'] });
      router.push('/admin/evenements');
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/evenements" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l&apos;événement</h1>
          <p className="text-sm text-gray-500">Mettre à jour les informations de l&apos;événement</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la modification.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold">Informations</h2></div>
          <div className="p-5 space-y-4">
            <Input label="Titre" {...register('titre')} error={errors.titre?.message} required />
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
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold">Lieu & Dates</h2></div>
          <div className="p-5 space-y-4">
            <Input label="Lieu" {...register('lieu')} error={errors.lieu?.message} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Date de début" type="date" {...register('dateDebut')} error={errors.dateDebut?.message} required />
              <Input label="Date de fin" type="date" {...register('dateFin')} />
              <Input label="Heure de début" type="time" {...register('heureDebut')} />
              <Input label="Heure de fin" type="time" {...register('heureFin')} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold">Autres détails</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Organisateur" {...register('organisateur')} />
              <Input label="Capacité (nb personnes)" type="number" {...register('capacite')} />
              <Select
                label="Statut"
                options={[
                  { value: 'a_venir',  label: 'À venir'  },
                  { value: 'en_cours', label: 'En cours' },
                  { value: 'termine',  label: 'Terminé'  },
                  { value: 'annule',   label: 'Annulé'   },
                ]}
                {...register('statut')}
              />
              <ImageUpload
                label="Image"
                value={watch('image') || ''}
                onChange={(url) => setValue('image', url)}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/evenements"><Button variant="outline" type="button">Annuler</Button></Link>
          <Button type="submit" loading={mutation.isPending}>Enregistrer les modifications</Button>
        </div>
      </form>
    </div>
  );
}