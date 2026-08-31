'use client';

import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/Spinner';
import api from '@/lib/api';
import type { User } from '@/types';

const schema = z.object({
  prenom:    z.string().min(2, 'Prénom requis'),
  nom:       z.string().min(2, 'Nom requis'),
  email:     z.string().email('Email invalide'),
  poste:     z.string().optional(),
  telephone: z.string().optional(),
  role:      z.enum(['SUPER_ADMIN','ADMIN','EDITEUR','REDACTEUR','CONTRIBUTEUR']),
  actif:     z.enum(['true', 'false']),
});
type FormData = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN',  label: 'Super Admin'  },
  { value: 'ADMIN',        label: 'Administrateur'},
  { value: 'EDITEUR',      label: 'Éditeur'       },
  { value: 'REDACTEUR',    label: 'Rédacteur'     },
  { value: 'CONTRIBUTEUR', label: 'Contributeur'  },
];

const ACTIF_OPTIONS = [
  { value: 'true',  label: 'Actif'   },
  { value: 'false', label: 'Inactif' },
];

export default function EditUtilisateurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['admin-user', id],
    queryFn: async () => { const res = await api.get(`/auth/users/${id}`); return res.data; },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        prenom:    user.prenom,
        nom:       user.nom,
        email:     user.email,
        poste:     user.poste ?? '',
        telephone: user.telephone ?? '',
        role:      user.role,
        actif:     String(user.actif) as 'true' | 'false',
      });
    }
  }, [user, reset]);

  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  const updateMut = useMutation({
    mutationFn: (data: FormData) => api.patch(`/auth/users/${id}`, {
      ...data,
      actif: data.actif === 'true',
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-user', id] });
      setFeedback({ type: 'success', msg: 'Utilisateur mis à jour.' });
    },
    onError: () => setFeedback({ type: 'error', msg: 'Erreur lors de la mise à jour.' }),
  });

  const [newPassword, setNewPassword] = useState('');
  const resetPwdMut = useMutation({
    mutationFn: () => api.patch(`/auth/users/${id}/password`, { password: newPassword }),
    onSuccess: () => {
      setNewPassword('');
      setFeedback({ type: 'success', msg: 'Mot de passe réinitialisé avec succès.' });
    },
    onError: () => setFeedback({ type: 'error', msg: 'Erreur lors de la réinitialisation du mot de passe.' }),
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/utilisateurs" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l&apos;utilisateur</h1>
          <p className="text-sm text-gray-500 truncate max-w-md">{user ? `${user.prenom} ${user.nom}` : ''}</p>
        </div>
      </div>

      {feedback && (
        <div className={`rounded-lg p-3 text-sm ${feedback.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {feedback.msg}
        </div>
      )}

      <form onSubmit={handleSubmit((d) => updateMut.mutate(d))} className="space-y-5">
        <Card>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Prénom" {...register('prenom')} error={errors.prenom?.message} required />
              <Input label="Nom" {...register('nom')} error={errors.nom?.message} required />
            </div>
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} required />
            <Input label="Poste / Fonction" {...register('poste')} />
            <Input label="Téléphone" type="tel" {...register('telephone')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Rôle" options={ROLE_OPTIONS} {...register('role')} />
              <Select label="Statut" options={ACTIF_OPTIONS} {...register('actif')} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/utilisateurs">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={updateMut.isPending}>Enregistrer</Button>
        </div>
      </form>

      {/* Réinitialisation du mot de passe — action admin uniquement */}
      <Card>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-gray-900">Réinitialiser le mot de passe</h2>
          </div>
          <p className="text-xs text-gray-500">
            Mesure de sécurité : les utilisateurs ne peuvent pas réinitialiser leur mot de passe
            eux-mêmes. Communiquez-leur le nouveau mot de passe par un canal sécurisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={newPassword && newPassword.length < 8 ? 'Min 8 caractères' : undefined}
              autoComplete="new-password"
            />
            <div className="sm:pt-6">
              <Button
                type="button"
                variant="outline"
                loading={resetPwdMut.isPending}
                disabled={!newPassword || newPassword.length < 8}
                onClick={() => resetPwdMut.mutate()}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
