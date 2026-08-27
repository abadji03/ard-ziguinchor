import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = { title: 'Mentions légales' };

export default function MentionsLegalesPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Mentions légales' }]} />
          <h1 className="mt-4 text-2xl font-bold text-white">Mentions légales</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl p-8 border border-gray-100 prose-content space-y-6">
          <section>
            <h2>Éditeur du site</h2>
            <p><strong>Agence Régionale de Développement de Ziguinchor (ARD Ziguinchor)</strong></p>
            <p>Adresse : Ziguinchor, Sénégal<br />
            Tél : +221 33 991 00 00<br />
            Email : contact@ard-ziguinchor.sn</p>
          </section>
          <section>
            <h2>Hébergement</h2>
            <p>Ce site est hébergé sur un serveur VPS OVH — SAS OVH, 2 rue Kellermann, 59100 Roubaix, France.</p>
          </section>
          <section>
            <h2>Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, vidéos) est la propriété de l'ARD Ziguinchor,
            sauf mention contraire. Toute reproduction est soumise à autorisation préalable.</p>
          </section>
          <section>
            <h2>Données personnelles</h2>
            <p>Les données collectées via les formulaires sont utilisées uniquement pour répondre
            à vos demandes et ne sont pas cédées à des tiers. Conformément à la loi, vous disposez d'un
            droit d'accès, de rectification et de suppression de vos données.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
