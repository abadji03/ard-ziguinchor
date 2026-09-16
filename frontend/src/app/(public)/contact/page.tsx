'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, Send, Building2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { contactService } from '@/services/contact.service';
import { CONTACT_INFO } from '@/constants';
import { useSiteParams } from '@/contexts/SiteParamsContext';

const CarteContact = dynamic(
  () => import('@/components/features/cartographie/CarteContact').then((m) => m.CarteContact),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-400">
        Chargement de la carte territoriale…
      </div>
    ),
  }
);

const schema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  telephone: z.string().optional(),
  objet: z.string().min(5, "L'objet doit contenir au moins 5 caractères"),
  message: z.string().min(20, 'Le message doit contenir au moins 20 caractères'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { telephone, email, adresse, villes: ville } = useSiteParams();

  const adresseComplete = [adresse, ville].filter(Boolean).join(', ') || CONTACT_INFO.adresse;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
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
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Contact & Accès' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Relations Usagers & Collectivités
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Contacter l'ARD Ziguinchor
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Nos pôles de planification, de passation des marchés et d'assistance aux communes sont à
              votre écoute. Rendez-vous au siège régional ou échangez directement avec nos services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne Coordonnées & Carte (5 cols) */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-700" />
                <span>Siège & Permanences</span>
              </h2>

              <ul className="space-y-5">
                <li className="flex items-start gap-3.5 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Adresse</p>
                    <p className="text-slate-800 font-medium mt-0.5">{adresseComplete}</p>
                    <p className="text-xs text-slate-500">Région de Ziguinchor, Sénégal</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Téléphone</p>
                    <a
                      href={`tel:${telephone || CONTACT_INFO.telephone}`}
                      className="text-emerald-800 hover:text-emerald-900 font-bold mt-0.5 block"
                    >
                      {telephone || CONTACT_INFO.telephone}
                    </a>
                    <p className="text-xs text-slate-500">Standard administratif</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Courriel</p>
                    <a
                      href={`mailto:${email || CONTACT_INFO.email}`}
                      className="text-emerald-800 hover:text-emerald-900 font-semibold mt-0.5 block break-all"
                    >
                      {email || CONTACT_INFO.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Horaires d'accueil</p>
                    <p className="text-slate-800 font-medium mt-0.5">{CONTACT_INFO.horaires}</p>
                    <p className="text-xs text-slate-500">Fermé les samedis, dimanches et jours fériés</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Carte de situation interactive */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Plan de localisation</h3>
                <span className="text-xs text-emerald-700 font-semibold">Ziguinchor Ville</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <CarteContact />
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=12.5621115,-16.2831092"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Ouvrir dans Google Maps ↗
              </a>
            </div>
          </aside>

          {/* Formulaire de Contact Sécurisé (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xs">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Formulaire Officiel
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                  Transmettre une requête ou une correspondance
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Les messages adressés via ce formulaire sont directement acheminés au secrétariat
                  de l'ARD pour traitement sous 48 heures ouvrables.
                </p>
              </div>

              {status === 'success' && (
                <div
                  className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6"
                  role="alert"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-900 text-sm">Votre message a été transmis !</p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Nos services vous répondront dans les plus brefs délais à l'adresse indiquée.
                    </p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div
                  className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6"
                  role="alert"
                >
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700">
                    Une erreur technique s'est produite lors de l'envoi. Veuillez vérifier vos données
                    ou nous contacter par téléphone.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Nom complet & Titre"
                    placeholder="ex. Mamadou Diop, Maire..."
                    {...register('nom')}
                    error={errors.nom?.message}
                    required
                    autoComplete="name"
                  />
                  <Input
                    label="Adresse courriel"
                    type="email"
                    placeholder="votre.email@exemple.sn"
                    {...register('email')}
                    error={errors.email?.message}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Numéro de téléphone"
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    {...register('telephone')}
                    autoComplete="tel"
                  />
                  <Input
                    label="Objet de la correspondance"
                    placeholder="ex. Demande d'appui PCD, Partenariat..."
                    {...register('objet')}
                    error={errors.objet?.message}
                    required
                  />
                </div>

                <Textarea
                  label="Contenu détaillé de votre message"
                  rows={6}
                  {...register('message')}
                  error={errors.message?.message}
                  required
                  placeholder="Décrivez votre demande, les collectivités concernées ou le projet en question…"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    * Tous les champs avec mention obligatoire doivent être renseignés.
                  </span>
                  <Button
                    type="submit"
                    loading={status === 'loading'}
                    size="lg"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2"
                  >
                    <span>Envoyer la demande</span>
                    <Send className="h-4 w-4" />
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
