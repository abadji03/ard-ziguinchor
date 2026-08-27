import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: {
      buffer: Buffer;
      originalname?: string;
      mimetype?: string;
    },
    resourceType: 'image' | 'raw' = 'image',
  ): Promise<{ secure_url: string; public_id: string }> {
    // Dérive un public_id sûr à partir du nom original (sans caractères illégaux).
    // Pour les 'raw' (PDF…), on GARDE l'extension dans le public_id (+ timestamp unique)
    // afin que Cloudinary serve le bon Content-Type (application/pdf, …).
    const rawName = (file.originalname || 'fichier')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .replace(/^[._-]+/, '');
    const fileExt = rawName.includes('.') ? (rawName.match(/\.[^.]+$/) || [''])[0] : '';
    const base = rawName.replace(/\.[^.]+$/, '');
    // Pour raw : base-<timestamp><extension>. Pour image : nom épuré seul (Cloudinary gère).
    const publicId =
      resourceType === 'raw' ? `${base}-${Date.now()}${fileExt}` : rawName;

    return new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'ard-ziguinchor',
            resource_type: resourceType,
            // public_id explicite (avec extension pour raw) — pas de use_filename
            // ni overwrite, qui peuvent induire des états de ressource restreints.
            public_id: publicId,
          },
          (error: unknown, result) => {
            if (error) {
              reject(
                error instanceof Error
                  ? error
                  : new Error(
                      typeof error === 'string' ? error : 'Erreur Cloudinary',
                    ),
              );
            } else if (result) {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            } else {
              reject(new Error('Upload Cloudinary: résultat vide'));
            }
          },
        );
        stream.end(file.buffer);
      },
    );
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    // Les documents (PDF…) sont stockés en resource_type 'raw', les images en 'image'
    const types = ['auto', 'image', 'raw'] as const;
    for (const resource_type of types) {
      try {
        const res = (await cloudinary.uploader.destroy(publicId, {
          resource_type,
        })) as { result: string };
        if (res?.result === 'ok' || res?.result === 'not found') {
          return res;
        }
      } catch {
        // essaie le type suivant
      }
    }
    return { result: 'not found' };
  }
}
