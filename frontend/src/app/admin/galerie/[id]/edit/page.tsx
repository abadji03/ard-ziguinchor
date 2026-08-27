'use client';

import { use, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft, X, Loader2, Images, Trash2, ImagePlus,
  Link2, Upload, CheckCircle, Play,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/Spinner';
import {
  adminGalerie,
  galerieAddMedia,
  galerieAddMediaFromUrl,
  galerieRemoveMedia,
} from '@/services/admin.service';
import api from '@/lib/api';
import type { Galerie, Media } from '@/types';

// ─── Schéma du formulaire infos ───────────────────────────────────────────────

const schema = z.object({
  nom:         z.string().min(2, 'Nom requis'),
  description: z.string().optional(),
  slug:        z.string().min(2, 'Slug requis'),
});
type FormData = z.infer<typeof schema>;

// ─── Helpers vidéo ────────────────────────────────────────────────────────────

function isVideoUrl(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.webm|\.ogg/i.test(url);
}

function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

// ─── Onglet URL ───────────────────────────────────────────────────────────────

function UrlAdder({ galerieId, onAdded }: { galerieId: string; onAdded: () => void }) {
  const [url,     setUrl]     = useState('');
  const [nom,     setNom]     = useState('');
  const [legende, setLegende] = useState('');
  const [adding,  setAdding]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const isVideo    = url ? isVideoUrl(url) : false;
  const ytThumb    = url ? getYoutubeThumbnail(url) : null;
  const previewUrl = url ? (isVideo ? (ytThumb ?? null) : url) : null;

  const handleAdd = async () => {
    if (!url.trim()) { setError('Veuillez saisir une URL.'); return; }
    setError('');
    setAdding(true);
    setSuccess(false);
    try {
      await galerieAddMediaFromUrl(galerieId, {
        url:     url.trim(),
        nom:     nom.trim() || undefined,
        legende: legende.trim() || undefined,
        type:    isVideo ? 'video' : 'image',
      });
      setSuccess(true);
      setUrl('');
      setNom('');
      setLegende('');
      onAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Erreur lors de l'ajout.",
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          URL de l&apos;image ou de la vidéo
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(''); setSuccess(false); }}
          placeholder="https://… (image, YouTube, Vimeo, MP4…)"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        {error   && <p className="text-xs text-red-600">{error}</p>}
        {success && (
          <p className="flex items-center gap-1.5 text-xs text-green-600">
            <CheckCircle className="h-3.5 w-3.5" /> Ajouté avec succès
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Nom (optionnel)</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Titre du média…"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
              placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Légende (optionnel)</label>
          <input
            type="text"
            value={legende}
            onChange={(e) => setLegende(e.target.value)}
            placeholder="Description courte…"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
              placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
      </div>

      {/* Prévisualisation */}
      {previewUrl && (
        <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          <div className="relative w-full aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Aperçu"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-3">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              </div>
            )}
          </div>
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isVideo ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isVideo ? '🎬 Vidéo' : '🖼️ Image'}
            </span>
            <span className="text-xs text-gray-400 truncate">{url}</span>
          </div>
        </div>
      )}

      {url && !previewUrl && !isVideo && (
        <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          <Link2 className="h-4 w-4 shrink-0" />
          Aperçu non disponible — le fichier sera ajouté tel quel.
        </div>
      )}

      <button
        type="button"
        disabled={!url.trim() || adding}
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
          bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
        {adding ? 'Ajout en cours…' : 'Ajouter ce média'}
      </button>
    </div>
  );
}

// ─── Onglet Fichier ───────────────────────────────────────────────────────────

function FileUploader({ galerieId, onUploaded }: { galerieId: string; onUploaded: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<
    { file: File; status: 'pending' | 'uploading' | 'done' | 'error'; error?: string }[]
  >([]);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (!fileArray.length) return;

      setQueue((prev) => [
        ...prev,
        ...fileArray.map((file) => ({ file, status: 'pending' as const })),
      ]);

      for (let i = 0; i < fileArray.length; i++) {
        setQueue((prev) =>
          prev.map((e, idx) =>
            idx === prev.length - fileArray.length + i ? { ...e, status: 'uploading' } : e,
          ),
        );
        try {
          await galerieAddMedia(galerieId, fileArray[i]);
          setQueue((prev) =>
            prev.map((e, idx) =>
              idx === prev.length - fileArray.length + i ? { ...e, status: 'done' } : e,
            ),
          );
          onUploaded();
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            ?? 'Erreur upload';
          setQueue((prev) =>
            prev.map((e, idx) =>
              idx === prev.length - fileArray.length + i
                ? { ...e, status: 'error', error: msg }
                : e,
            ),
          );
        }
      }
    },
    [galerieId, onUploaded],
  );

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const isUploading = queue.some((e) => e.status === 'uploading');

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Zone d'upload d'images"
        onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8
          transition-colors cursor-pointer
          ${dragging
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-primary/50 hover:bg-primary/5'
          }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        <ImagePlus className="h-8 w-8" />
        <div className="text-center">
          <p className="text-sm font-medium">
            {dragging ? 'Déposez les images ici' : 'Cliquez ou glissez-déposez des images'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP, GIF — plusieurs fichiers acceptés</p>
        </div>
      </div>

      {queue.length > 0 && (
        <div className="space-y-1.5">
          {queue.map((entry, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
              ${entry.status === 'done'      ? 'bg-green-50 text-green-700' : ''}
              ${entry.status === 'error'     ? 'bg-red-50 text-red-700'     : ''}
              ${entry.status === 'uploading' ? 'bg-blue-50 text-blue-700'   : ''}
              ${entry.status === 'pending'   ? 'bg-gray-50 text-gray-600'   : ''}
            `}>
              {entry.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
              {entry.status === 'done'      && <span className="text-green-600 font-bold shrink-0">✓</span>}
              {entry.status === 'error'     && <X className="h-4 w-4 shrink-0" />}
              {entry.status === 'pending'   && <span className="h-4 w-4 shrink-0 opacity-40">○</span>}
              <span className="truncate flex-1">{entry.file.name}</span>
              {entry.status === 'error' && <span className="text-xs shrink-0">{entry.error}</span>}
            </div>
          ))}
          {!isUploading && queue.some((e) => e.status === 'done') && (
            <button
              type="button"
              onClick={() => setQueue((prev) => prev.filter((e) => e.status !== 'done'))}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Effacer les terminés
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Zone d'ajout avec onglets ────────────────────────────────────────────────

function MediaAdder({ galerieId, onChanged }: { galerieId: string; onChanged: () => void }) {
  const [tab, setTab] = useState<'file' | 'url'>('file');

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setTab('file')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${tab === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Upload className="h-3.5 w-3.5" /> Fichier
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${tab === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Link2 className="h-3.5 w-3.5" /> URL / Lien
        </button>
      </div>

      {tab === 'file'
        ? <FileUploader galerieId={galerieId} onUploaded={onChanged} />
        : <UrlAdder    galerieId={galerieId} onAdded={onChanged}    />
      }
    </div>
  );
}

// ─── Grille des médias existants ──────────────────────────────────────────────

function MediaGrid({
  medias,
  galerieId,
  onRemoved,
}: {
  medias: Media[];
  galerieId: string;
  onRemoved: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRemove = async (mediaId: string) => {
    if (!confirm('Supprimer ce média de la galerie ?')) return;
    setDeletingId(mediaId);
    try {
      await galerieRemoveMedia(galerieId, mediaId);
      onRemoved();
    } catch {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!medias.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <Images className="h-10 w-10 mb-2" />
        <p className="text-sm">Aucun média dans cette galerie</p>
        <p className="text-xs mt-1">Utilisez la zone ci-dessus pour en ajouter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {medias.map((media) => {
        const isVideo    = media.type === 'video';
        const ytThumb    = isVideo ? getYoutubeThumbnail(media.fichier) : null;
        const displaySrc = isVideo ? (ytThumb ?? null) : media.fichier;

        return (
          <div
            key={media.id}
            className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square"
          >
            {displaySrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displaySrc}
                  alt={media.texteAlt || media.nom}
                  className="w-full h-full object-cover"
                />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-2">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Play className="h-8 w-8" />
              </div>
            )}

            {/* Overlay suppression */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemove(media.id)}
                disabled={deletingId === media.id}
                aria-label="Supprimer ce média"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === media.id
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Trash2 className="h-4 w-4" />
                }
              </button>
            </div>

            {/* Badge vidéo */}
            {isVideo && (
              <div className="absolute top-2 left-2 pointer-events-none">
                <span className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Vidéo
                </span>
              </div>
            )}

            {/* Légende au survol */}
            {media.nom && (
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {media.nom}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EditGaleriePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const qc     = useQueryClient();

  const { data: galerie, isLoading, refetch } = useQuery<Galerie>({
    queryKey: ['galerie-edit', id],
    queryFn:  async () => { const res = await api.get(`/galeries/${id}`); return res.data; },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (galerie) {
      reset({
        nom:         galerie.nom,
        description: galerie.description ?? '',
        slug:        galerie.slug,
      });
    }
  }, [galerie, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminGalerie.update(id, data),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['admin-galeries'] });
      router.push('/admin/galerie');
    },
  });

  const allMedias: Media[] = galerie
    ? [
        ...(galerie.galerieMedias ?? []).map((gm) => gm.media),
        ...(galerie.albums ?? []).flatMap((a) => a.medias ?? []),
      ]
    : [];

  const refreshAll = () => {
    refetch();
    qc.invalidateQueries({ queryKey: ['admin-galeries'] });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-4xl space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/galerie"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{galerie?.nom ?? 'Galerie'}</h1>
          <p className="text-sm text-gray-500">
            {allMedias.length} média{allMedias.length !== 1 ? 's' : ''} dans cette galerie
          </p>
        </div>
      </div>

      {/* Informations */}
      <Card>
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Informations</h2>
        </div>
        <div className="p-5">
          {mutation.isError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              Erreur lors de la modification.
            </div>
          )}
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nom de la galerie"
                {...register('nom')}
                error={errors.nom?.message}
                required
              />
              <Input
                label="Slug"
                {...register('slug')}
                error={errors.slug?.message}
                required
              />
            </div>
            <Textarea label="Description" rows={2} {...register('description')} />
            <div className="flex justify-end">
              <Button type="submit" loading={mutation.isPending} size="sm">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Section médias */}
      <Card>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Photos &amp; Vidéos</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ajoutez via un fichier local ou un lien URL / YouTube / Vimeo
            </p>
          </div>
          <span className="text-sm text-gray-400 font-medium">
            {allMedias.length} média{allMedias.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="p-5 space-y-6">
          <MediaAdder galerieId={id} onChanged={refreshAll} />

          {allMedias.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                Médias existants
              </p>
            </div>
          )}

          <MediaGrid medias={allMedias} galerieId={id} onRemoved={refreshAll} />
        </div>
      </Card>

      <div className="flex justify-start">
        <Link href="/admin/galerie">
          <Button variant="outline" type="button">← Retour à la liste</Button>
        </Link>
      </div>
    </div>
  );
}
