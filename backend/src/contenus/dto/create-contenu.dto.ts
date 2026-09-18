import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Bloc de contenu éditorial (mission, jalon, atout territorial, direction…).
 * Voir `frontend/src/lib/contenus.ts` pour la liste des `type` et `section`.
 */
export class CreateContenuDto {
  @IsString() @IsNotEmpty() type!: string;

  @IsOptional() @IsString() section?: string;

  @IsString() @IsNotEmpty() titre!: string;

  @IsOptional() @IsString() sousTitre?: string;

  @IsOptional() @IsString() description?: string;

  /** Nom d'icône Lucide (ex. « Target ») ou emoji. */
  @IsOptional() @IsString() icone?: string;

  @IsOptional() @IsString() couleur?: string;

  /** Lien de destination (sous-pages, liens utiles). */
  @IsOptional() @IsString() lien?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0) ordre?: number;

  @IsOptional() @IsBoolean() actif?: boolean;
}
