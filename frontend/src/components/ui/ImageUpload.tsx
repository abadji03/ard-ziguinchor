'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadImageFile } from '@/services/admin.service';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
}

export function ImageUpload({
  label,
  value,
  onChange,
  error,
  required,
  className,
  placeholder = 'https://…',
  aspectRatio = 'wide',
}: ImageUploadProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // State interne pour garantir que l'input reste toujours contrôlé
  // même si le parent passe undefined lors du premier render.
  const [urlInput, setUrlInput] = useState<string>(value ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronise le state interne quand le prop change (ex: après reset du formulaire)
  useEffect(() => {
    setUrlInput(value ?? '');
  }, [value]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setUrlInput(v);
    onChange(v);
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image valide.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const result = await uploadImageFile(file);
      setUrlInput(result.url);
      onChange(result.url);
    } catch {
      setUploadError("Erreur lors de l'upload. Vérifiez votre connexion ou utilisez une URL.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [onChange]);

  const handleClear = useCallback(() => {
    setUrlInput('');
    onChange('');
    setUploadError(null);
  }, [onChange]);

  const aspectClass = {
    square: 'aspect-square',
    video:  'aspect-video',
    wide:   'aspect-[16/9]',
    auto:   'aspect-auto min-h-[120px]',
  }[aspectRatio];

  // Valeur d'affichage : priorité au state interne (toujours une string)
  const displayValue = urlInput;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Sélecteur de mode */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            mode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            mode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </button>
      </div>

      {/* Zone de saisie */}
      {mode === 'url' ? (
        <div className="relative">
          <input
            type="url"
            value={displayValue}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
              'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
              error && 'border-red-500 focus:ring-red-500/50'
            )}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-600',
              'hover:bg-gray-100 hover:border-gray-400 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-red-500'
            )}
          >
            {uploading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Upload en cours…</>
            ) : (
              <><Upload className="h-4 w-4" /> Cliquez pour sélectionner une image</>
            )}
          </button>
          {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
        </div>
      )}

      {/* Prévisualisation */}
      {displayValue ? (
        <div className="relative mt-2">
          <div className={cn('relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50', aspectClass)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayValue}
              alt="Prévisualisation"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white rounded-full shadow-sm border border-gray-200 text-gray-500 hover:text-red-600 transition-colors"
            title="Supprimer l'image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className={cn('flex items-center justify-center w-full rounded-lg border border-dashed border-gray-200 bg-gray-50', aspectClass)}>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Aperçu de l&apos;image</span>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
