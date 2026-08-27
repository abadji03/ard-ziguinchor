'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { adminDocuments, uploadDocument } from '@/services/admin.service';
import { referencesService } from '@/services/references.service';
import { slugify, formatFileSize } from '@/lib/utils';

const schema = z.object({
  titre:           z.string().min(3, 'Titre requis'),
  slug:            z.string().min(3, 'Slug requis'),
  resume:          z.string().optional(),
  fichier:         z.string().min(1, 'Fichier requis'),
  format:          z.string().min(1, 'Format requis'),
  taille:          z.number().optional(),
  typePlanification: z.enum(['REGIONALE', 'TERRITORIALE', 'AUTRE'], {
    required_error: 'Type de planification requis',
  }),
  sousType:        z.string().optional(),
  departementId:   z.string().optional(),
  arrondissementId: z.string().optional(),
  communeId:       z.string().optional(),
  auteur:          z.string().optional(),
  datePublication: z.string().optional(),
  langue:          z.string().min(1),
  statut:          z.enum(['brouillon', 'publie', 'archive']),
}).superRefine((data, ctx) => {
  if (data.typePlanification === 'TERRITORIALE') {
    if (!data.departementId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['departementId'],
        message: 'Département requis pour la planification territoriale',
      });
    }
    if (!data.sousType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sousType'],
        message: 'Sous-type requis pour la planification territoriale',
      });
    }
  }
});
type FormData = z.infer<typeof schema>;

const FORMAT_OPTIONS = [
  { value: 'pdf',  label: 'PDF'  },
  { value: 'docx', label: 'Word' },
  { value: 'xlsx', label: 'Excel'},
  { value: 'pptx', label: 'PowerPoint' },
  { value: 'zip',  label: 'ZIP'  },
];

// Valeur sentinelle utilisée par l'UI pour « Chef-lieu de département ».
// Elle n'est PAS un vrai identifiant d'arrondissement en base : il ne faut
// jamais l'envoyer au backend (sinon violation de clé étrangère Prisma → 500).
const CHEF_LIEU_VALUE = '__CHEF_LIEU__';

// Nettoie les champs optionnels du formulaire avant envoi :
//  - les chaînes vides ("") des <Select> placeholder sont converties en undefined
//  - la sentinelle "__CHEF_LIEU__" est retirée (seule la commune réelle compte)
// Envoyé en JSON, les propriétés `undefined` sont ignorées par axios,
// ce qui évite que Prisma tente de relier un FK inexistant (erreur 500).
type TerritoireFields = {
  departementId?: string;
  arrondissementId?: string;
  communeId?: string;
  sousType?: string;
};

function sanitizeTerritoire<T extends TerritoireFields>(data: T): T & TerritoireFields {
  const arrondissementId =
    data.arrondissementId && data.arrondissementId !== CHEF_LIEU_VALUE
      ? data.arrondissementId
      : undefined;
  return {
    ...data,
    sousType: data.sousType || undefined,
    departementId: data.departementId || undefined,
    arrondissementId,
    communeId: data.communeId || undefined,
  };
}

const SOUSTYPE_OPTIONS = [
  { value: 'PDC',    label: 'PDC — Plan de Développement Communal' },
  { value: 'PDD',    label: 'PDD — Plan Départemental de Développement' },
  { value: 'PLD',    label: 'PLD — Plan Local de Développement' },
  { value: 'PIC',    label: 'PIC — Plan d’Investissement Communal' },
  { value: 'Schema', label: 'Schéma (Secteur, Eau-Assainissement…)' },
];

export default function NewDocumentPage() {
  const router  = useRouter();
  const qc      = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; taille: number } | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'publie', langue: 'fr' },
  });

  const titre = watch('titre');
  const typePlanification = watch('typePlanification');
  const departementId = watch('departementId');
  const arrondissementId = watch('arrondissementId');

  // Récupération des références géographiques
  const { data: departements = [] } = useQuery({
    queryKey: ['ref-departements'],
    queryFn: () => referencesService.getDepartements(),
  });

  const { data: arrondissements = [] } = useQuery({
    queryKey: ['ref-arrondissements', departementId],
    queryFn: () => referencesService.getArrondissements(departementId),
    enabled: !!departementId && typePlanification === 'TERRITORIALE',
  });

  const { data: allCommunes = [] } = useQuery({
    queryKey: ['ref-communes', departementId],
    queryFn: () => referencesService.getCommunes(departementId),
    enabled: !!departementId && typePlanification === 'TERRITORIALE',
  });

  const communes = allCommunes.filter((c) => {
    if (!departementId) return false;
    if (arrondissementId === CHEF_LIEU_VALUE) return !c.arrondissement;
    if (arrondissementId) return c.arrondissement?.id === arrondissementId;
    return c.departement?.id === departementId;
  });

  // Reset arrondissement/commune quand le département change
  useEffect(() => {
    setValue('arrondissementId', '');
    setValue('communeId', '');
  }, [departementId]);

  // Reset commune quand l'arrondissement change
  useEffect(() => {
    setValue('communeId', '');
  }, [arrondissementId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadDocument(file);
      setUploadedFile(result);
      setValue('fichier', result.url);
      setValue('taille', result.taille);
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      setValue('format', ext);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message;
      alert(`Erreur lors de l'upload : ${msg ?? 'vérifiez la taille ou le format du fichier'}`);
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => adminDocuments.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-documents'] });
      router.push('/admin/documents');
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/documents" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau document</h1>
          <p className="text-sm text-gray-500">Ajouter un document à la bibliothèque</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Erreur lors de la création.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(sanitizeTerritoire(d)))} className="space-y-5">
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Fichier</h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Upload zone */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
              <input ref={fileRef} type="file" className="hidden" id="doc-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                onChange={handleFileUpload} />
              {uploadedFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-700">✓ Fichier uploadé</p>
                  <p className="text-xs text-gray-400">{formatFileSize(uploadedFile.taille)}</p>
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="text-xs text-primary hover:underline mt-1">
                    Changer de fichier
                  </button>
                </div>
              ) : (
                <label htmlFor="doc-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {uploading ? 'Envoi en cours…' : 'Cliquez pour uploader'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, PowerPoint, ZIP</p>
                </label>
              )}
            </div>
            {errors.fichier && <p className="text-xs text-red-600">{errors.fichier.message}</p>}

            {/* URL directe si pas d'upload */}
            <Input label="Ou URL directe du fichier" type="url" {...register('fichier')} placeholder="https://…" />
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Métadonnées</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input
              label="Titre"
              {...register('titre')}
              error={errors.titre?.message}
              required
              onBlur={() => { if (titre && !watch('slug')) setValue('slug', slugify(titre)); }}
            />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} required />
            <Textarea label="Résumé" rows={2} {...register('resume')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Type de planification"
                options={[
                  { value: 'AUTRE',       label: 'Autre document' },
                  { value: 'REGIONALE',   label: 'Planification régionale' },
                  { value: 'TERRITORIALE', label: 'Planification territoriale' },
                ]}
                {...register('typePlanification')}
                error={errors.typePlanification?.message}
              />

              {typePlanification === 'TERRITORIALE' && (
                <Select
                  label="Sous-type"
                  options={SOUSTYPE_OPTIONS}
                  {...register('sousType')}
                  placeholder="Choisir un sous-type"
                />
              )}
            </div>

            {typePlanification === 'TERRITORIALE' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50/50 rounded-xl p-4">
                  <Select
                    label="Département"
                    options={departements.map((d) => ({ value: d.id, label: d.nom }))}
                    {...register('departementId')}
                    placeholder="Choisir"
                  />
                  <Select
                    label="Arrondissement"
                    options={[
                      { value: CHEF_LIEU_VALUE, label: 'Chef-lieu de département' },
                      ...arrondissements.map((a) => ({ value: a.id, label: a.nom })),
                    ]}
                    {...register('arrondissementId')}
                    placeholder="Facultatif"
                  />
                  <Select
                    label="Commune"
                    options={communes.map((c) => ({ value: c.id, label: c.nom }))}
                    {...register('communeId')}
                    placeholder={arrondissementId === CHEF_LIEU_VALUE ? 'Choisir un chef-lieu' : 'Choisir'}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Utilisez <span className="font-medium">Chef-lieu de département</span> pour les communes comme Bignona, Ziguinchor ou Oussouye qui ne sont pas rattachées à un arrondissement.
                </p>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select label="Format" options={FORMAT_OPTIONS} {...register('format')} error={errors.format?.message} required placeholder="Format" />
              <Select
                label="Statut"
                options={[
                  { value: 'publie',    label: 'Publié'   },
                  { value: 'brouillon', label: 'Brouillon'},
                  { value: 'archive',   label: 'Archivé'  },
                ]}
                {...register('statut')}
              />
              <Select
                label="Langue"
                options={[{ value: 'fr', label: 'Français' }, { value: 'en', label: 'Anglais' }]}
                {...register('langue')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Auteur" {...register('auteur')} />
              <Input label="Date de publication" type="date" {...register('datePublication')} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/documents">
            <Button variant="outline" type="button">Annuler</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>
            Ajouter le document
          </Button>
        </div>
      </form>
    </div>
  );
}