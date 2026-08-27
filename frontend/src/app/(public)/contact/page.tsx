'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { contactService } from '@/services/contact.service';
import { CONTACT_INFO } from '@/constants';
import { useSiteParams } from '@/contexts/SiteParamsContext';

const CarteContact = dynamic(
  () => import('@/components/features/cartographie/CarteContact').then((m) => m.CarteContact),
  { ssr: false, loading: () => (
    <div className="h-56 flex items-center justify-center bg-gray-100 rounded-xl text-sm text-gray-400">
      Chargement de la carte…
    </div>
  )}
);

const schema = z.object({
  nom:       z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email:     z.string().email('Adresse email invalide'),
  telephone: z.string().optional(),
  objet:     z.string().min(5, "L'objet doit contenir au moins 5 caractères"),
  message:   z.string().min(20, 'Le message doit contenir au moins 20 caractères'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { telephone, email, adresse } = useSiteParams();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      await contactService.send(data);
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Contact' }]} />
          <SectionTitle
            title="Contactez-nous"
            subtitle="Notre équipe est à votre disposition"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coordonnées */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-5">Nos coordonnées</h2>              <ul className="space-y-5">
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Adresse</p>
                    <p className="text-gray-500">{adresse || CONTACT_INFO.adresse}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Téléphone</p>
                    <a href={`tel:${telephone}`} className="text-primary hover:underline">
                      {telephone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <a href={`mailto:${email}`} className="text-primary hover:underline break-all">
                      {email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Horaires</p>
                    <p className="text-gray-500">{CONTACT_INFO.horaires}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Carte Leaflet */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h2 className="font-semibold text-gray-900 mb-3 text-sm">Localisation</h2>
              <CarteContact />
              <a
                href="https://www.google.com/maps/search/?api=1&query=12.5621115,-16.2831092"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-xs text-primary hover:underline"
              >
                Voir sur Google Maps →
              </a>
            </div>
          </aside>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-6">Envoyer un message</h2>

              {status === 'success' && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6" role="alert">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Message envoyé !</p>
                    <p className="text-sm text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6" role="alert">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">Une erreur s'est produite. Veuillez réessayer.</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Nom complet"
                    {...register('nom')}
                    error={errors.nom?.message}
                    required
                    autoComplete="name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Téléphone"
                    type="tel"
                    {...register('telephone')}
                    autoComplete="tel"
                  />
                  <Input
                    label="Objet"
                    {...register('objet')}
                    error={errors.objet?.message}
                    required
                  />
                </div>
                <Textarea
                  label="Message"
                  rows={6}
                  {...register('message')}
                  error={errors.message?.message}
                  required
                  placeholder="Décrivez votre demande…"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={status === 'loading'}
                    size="lg"
                  >
                    Envoyer le message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
