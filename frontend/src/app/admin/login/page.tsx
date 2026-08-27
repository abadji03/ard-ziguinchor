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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image src="/logo_ardz.png" alt="ARD Ziguinchor" width={505} height={396} className="h-14 w-auto" />
            <h1 className="mt-3 text-xl font-bold text-gray-900">Administration</h1>
            <p className="text-sm text-gray-500">Connectez-vous à votre espace</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-3 mb-5" role="alert">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
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
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Mot de passe"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              required
              autoComplete="current-password"
              icon={<Lock className="h-4 w-4" />}
            />
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-2"
              size="lg"
            >
              Se connecter
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          ARD Ziguinchor © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
