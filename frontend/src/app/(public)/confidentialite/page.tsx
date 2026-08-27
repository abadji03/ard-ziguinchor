import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = { title: 'Politique de confidentialité' };

export default function ConfidentialitePage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Politique de confidentialité' }]} />
          <h1 className="mt-4 text-2xl font-bold text-white">Politique de confidentialité</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl p-8 border border-gray-100 prose-content space-y-6">
          <section>
            <h2>Données collectées</h2>
            <p>Nous collectons uniquement les données que vous nous fournissez via nos formulaires de contact :
            nom, email, téléphone et message.</p>
          </section>
          <section>
            <h2>Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour traiter vos demandes. Elles ne sont jamais revendues
            ni partagées avec des tiers à des fins commerciales.</p>
          </section>
          <section>
            <h2>Cookies</h2>
            <p>Ce site utilise des cookies techniques nécessaires à son fonctionnement. Aucun cookie publicitaire
            n'est utilisé.</p>
          </section>
          <section>
            <h2>Vos droits</h2>
            <p>Conformément à la réglementation sénégalaise sur la protection des données personnelles,
            vous avez le droit d'accéder, de rectifier ou de supprimer vos données en nous contactant à :
            <a href="mailto:contact@ard-ziguinchor.sn" className="text-primary"> contact@ard-ziguinchor.sn</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
