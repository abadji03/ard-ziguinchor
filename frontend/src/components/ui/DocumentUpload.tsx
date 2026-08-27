'use client';

import { useState, useRef } from 'react';
import { FileUp, FileText, X, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadDocument } from '@/services/admin.service';
import { formatFileSize } from '@/lib/utils';

interface DocumentUploadResult {
  url: string;
  taille: number;
  publicId: string;
}

interface DocumentUploadProps {
  label?: string;
  /** URL du document déjà enregistré (pour l'édition) */
  documentUrl?: string;
  /** ID du document déjà enregistré en base */
  documentId?: string;
  /** Appelé avec l'ID du document créé une fois uploadé et enregistré */
  onDocumentCreated?: (documentId: string, url: string, taille: number) => void;
  /** Appelé simplement avec les données brutes d'upload (url, taille) */
  onUploaded?: (data: DocumentUploadResult) => void;
  error?: string;
  className?: string;
}

/**
 * Composant d'upload de document (PDF, Word, Excel, etc.).
 * Upload le fichier via /upload et expose l'URL + taille au parent.
 *
 * Usage dans les formulaires projets / programmes / opportunités :
 *   - onUploaded reçoit { url, taille, publicId }
 *   - Le parent crée ensuite le Document via adminDocuments.create() pour
 *     obtenir un documentId, puis passe ce documentId au payload principal.
 */
export function DocumentUpload({
  label = 'Document joint',
  documentUrl,
  documentId,
  onDocumentCreated,
  onUploaded,
  error,
  className,
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<DocumentUploadResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentUrl = uploadedData?.url ?? documentUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 20 * 1024 * 1024; // 20 Mo
    if (file.size > MAX_SIZE) {
      setUploadError('Le fichier ne doit pas dépasser 20 Mo.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const result = await uploadDocument(file);
      setUploadedData(result);
      onUploaded?.(result);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message ??
        (err as { message?: string })?.message ??
        'Erreur lors de l\'upload.';
      setUploadError(msg);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleClear = () => {
    setUploadedData(null);
    setUploadError(null);
    onUploaded?.({ url: '', taille: 0, publicId: '' });
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Fichier déjà présent */}
      {currentUrl ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <FileText className="h-5 w-5 text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 truncate">
              {uploadedData ? 'Fichier uploadé avec succès' : 'Document associé'}
            </p>
            {uploadedData?.taille ? (
              <p className="text-xs text-green-600">{formatFileSize(uploadedData.taille)}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md"
              title="Ouvrir le document"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-green-600 hover:text-red-600 hover:bg-red-50 rounded-md"
              title="Retirer le document"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Zone de sélection de fichier */
        <div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.odt,.ods"
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-4',
              'text-sm text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              (error || uploadError) && 'border-red-400 bg-red-50'
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Upload en cours…</span>
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4" />
                <span>Cliquez pour joindre un document</span>
                <span className="text-gray-400 text-xs">(PDF, Word, Excel… max 20 Mo)</span>
              </>
            )}
          </button>
        </div>
      )}

      {(uploadError || error) && (
        <p className="text-xs text-red-600">{uploadError ?? error}</p>
      )}
    </div>
  );
}
