'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Une erreur s'est produite</h2>
      <p className="text-gray-500 mt-2 text-sm max-w-sm">
        Quelque chose s'est mal passé. Vous pouvez réessayer ou revenir à l'accueil.
      </p>
      <div className="flex gap-3 mt-6">
        <Button onClick={reset}>Réessayer</Button>
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          Accueil
        </Button>
      </div>
    </div>
  );
}
