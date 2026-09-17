import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMembreDto {
  @IsString() @IsNotEmpty() nom!: string;
  @IsString() @IsNotEmpty() prenom!: string;
  @IsString() @IsNotEmpty() fonction!: string;
  @IsOptional() @IsString() direction?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() photo?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() telephone?: string;
  @IsOptional() @IsNumber() ordre?: number;
}
