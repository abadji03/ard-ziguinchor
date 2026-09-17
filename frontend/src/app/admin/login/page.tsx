'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe requis'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await login(data.email, data.password);
      router.push('/admin/dashboard');
    } catch {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 p-8 sm:p-10 border border-slate-200/80">
          {/* Logo institutionnel */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white p-2.5 border border-slate-200 flex items-center justify-center shadow-xs mb-3">
              <Image src="/logo_ardz.png" alt="ARD Ziguinchor" width={505} height={396} className="h-full w-full object-contain" priority />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 mb-1.5">
              Portail Administratif Sécurisé
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">ARD Ziguinchor</h1>
            <p className="text-xs text-slate-500 mt-1">Connectez-vous pour gérer les publications et ressources</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/80 rounded-xl p-3.5 mb-6 text-rose-800 shadow-2xs" role="alert">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Adresse email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              required
              autoComplete="email"
              placeholder="ex: admin@ardziguinchor.sn"
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Mot de passe"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
            />
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-3"
              size="lg"
            >
              Accéder à l'espace d'administration
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-5 font-medium">
          Agence Régionale de Développement de Ziguinchor © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
