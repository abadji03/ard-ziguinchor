'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { adminFaq } from '@/services/admin.service';
import api from '@/lib/api';

const schema = z.object({
  question:   z.string().min(10, 'Question requise (min 10 car.)'),
  reponse:    z.string().min(10, 'Réponse requise'),
  categorieId:z.string().min(1, 'Catégorie requise'),
  ordre:      z.number().min(0),
});
type FormData = z.infer<typeof schema>;

export default function EditFaqPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const qc = useQueryClient();

  const { data: faq, isLoading } = useQuery({
    queryKey: ['admin-faq', id],
    queryFn: async () => {
      const res = await api.get(`/faq/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ordre: 0 },
  });

  useEffect(() => {
    if (faq) {
      reset({
        question: faq.question ?? '',
        reponse: faq.reponse ?? '',
        categorieId: faq.categorieId ?? '',
        ordre: faq.ordre ?? 0,
      });
    }
  }, [faq, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminFaq.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-faq'] });
      qc.invalidateQueries({ queryKey: ['admin-faq', id] });
      router.push('/admin/faq');
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/faq" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier la question FAQ</h1>
          <p className="text-sm text-gray-500">Mettre à jour cette question fréquente</p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Chargement…</p>}

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la mise à jour.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 space-y-4">
            <Textarea
              label="Question"
              rows={2}
              {...register('question')}
              error={errors.question?.message}
              required
              placeholder="Quelle est la mission de l'ARD Ziguinchor ?"
            />
            <Textarea
              label="Réponse"
              rows={6}
              {...register('reponse')}
              error={errors.reponse?.message}
              required
              placeholder="Réponse complète (HTML accepté)…"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="ID Catégorie"
                {...register('categorieId')}
                error={errors.categorieId?.message}
                required
                placeholder="ID de la catégorie FAQ"
              />
              <Input
                label="Ordre d'affichage"
                type="number"
                min={0}
                {...register('ordre', { valueAsNumber: true })}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/faq"><Button variant="outline" type="button">Annuler</Button></Link>
          <Button type="submit" loading={mutation.isPending}>Enregistrer les modifications</Button>
        </div>
      </form>
    </div>
  );
}
