import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-8xl font-bold text-primary/20 select-none">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Page introuvable</h1>
        <p className="text-gray-500 mt-2 max-w-sm">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex gap-3 mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" /> Accueil
          </Link>
          <Link
            href="javascript:history.back()"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
