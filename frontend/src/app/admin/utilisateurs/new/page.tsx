'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';

const schema = z.object({
  prenom:    z.string().min(2, 'Prénom requis'),
  nom:       z.string().min(2, 'Nom requis'),
  email:     z.string().email('Email invalide'),
  password:  z.string().min(8, 'Mot de passe min 8 caractères'),
  telephone: z.string().optional(),
  role:      z.enum(['SUPER_ADMIN','ADMIN','EDITEUR','REDACTEUR','CONTRIBUTEUR']),
});
type FormData = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN',  label: 'Super Admin'  },
  { value: 'ADMIN',        label: 'Administrateur'},
  { value: 'EDITEUR',      label: 'Éditeur'       },
  { value: 'REDACTEUR',    label: 'Rédacteur'     },
  { value: 'CONTRIBUTEUR', label: 'Contributeur'  },
];

export default function NewUtilisateurPage() {
  const router = useRouter();
  const qc     = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'REDACTEUR' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/auth/register', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      router.push('/admin/utilisateurs');
    },
  });

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/utilisateurs" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvel utilisateur</h1>
          <p className="text-sm text-gray-500">Créer un compte administrateur</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la création. L&apos;email est peut-être déjà utilisé.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Prénom" {...register('prenom')} error={errors.prenom?.message} required />
              <Input label="Nom" {...register('nom')} error={errors.nom?.message} required />
            </div>
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} required autoComplete="off" />
            <Input label="Mot de passe" type="password" {...register('password')} error={errors.password?.message} required autoComplete="new-password" />
            <Input label="Téléphone" type="tel" {...register('telephone')} />
            <Select label="Rôle" options={ROLE_OPTIONS} {...register('role')} />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/utilisateurs">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>
            Créer l&apos;utilisateur
          </Button>
        </div>
      </form>
    </div>
  );
}
