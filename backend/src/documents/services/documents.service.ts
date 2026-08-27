import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryDocumentDto } from '../dto/query-document.dto';
import { CreateDocumentDto } from '../dto/create-document.dto';
import axios from 'axios';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryDocumentDto) {
    const {
      page = 1,
      limit = 10,
      statut,
      categorieId,
      format,
      langue,
      projetId,
      programmeId,
      partenaireId,
      typePlanification,
      sousType,
      departementId,
      arrondissementId,
      communeId,
      q,
    } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (statut) where.statut = statut;
    if (categorieId) where.categorieId = categorieId;
    if (format) where.format = format;
    if (langue) where.langue = langue;
    if (projetId) where.projetId = projetId;
    if (programmeId) where.programmeId = programmeId;
    if (partenaireId) where.partenaireId = partenaireId;
    if (typePlanification) where.typePlanification = typePlanification;
    if (sousType) where.sousType = sousType;
    if (departementId) where.departementId = departementId;
    if (arrondissementId) where.arrondissementId = arrondissementId;
    if (communeId) where.communeId = communeId;
    if (q) {
      where.OR = [
        { titre: { contains: q, mode: 'insensitive' } },
        { resume: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { datePublication: 'desc' },
        include: {
          categorie: true,
          departement: true,
          arrondissement: true,
          commune: true,
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  /**
   * Récupère les documents de planification territoriale organisés
   * par département → commune (PDC) ou par département (PDD).
   */
  async findTerritoriale() {
    const documents = await this.prisma.document.findMany({
      where: {
        typePlanification: 'TERRITORIALE',
        statut: 'publie',
      },
      orderBy: { datePublication: 'desc' },
      include: {
        departement: true,
        arrondissement: true,
        commune: true,
      },
    });

    const pdc = documents.filter((d) => d.sousType === 'PDC');
    const pdd = documents.filter((d) => d.sousType === 'PDD');

    const groupByDepartement = (
      docs: typeof documents,
    ): Array<{
      departement: { id: string; nom: string } | null;
      communes: Array<{
        commune: { id: string; nom: string } | null;
        documents: typeof documents;
      }>;
    }> => {
      const map = new Map<
        string,
        {
          departement: { id: string; nom: string } | null;
          communes: Map<
            string,
            {
              commune: { id: string; nom: string } | null;
              documents: typeof documents;
            }
          >;
        }
      >();

      for (const doc of docs) {
        const depId = doc.departementId ?? 'sans-departement';
        if (!map.has(depId)) {
          map.set(depId, {
            departement: doc.departement
              ? { id: doc.departement.id, nom: doc.departement.nom }
              : null,
            communes: new Map(),
          });
        }
        const entry = map.get(depId)!;
        const comId = doc.communeId ?? 'sans-commune';
        if (!entry.communes.has(comId)) {
          entry.communes.set(comId, {
            commune: doc.commune
              ? { id: doc.commune.id, nom: doc.commune.nom }
              : null,
            documents: [],
          });
        }
        entry.communes.get(comId)!.documents.push(doc);
      }

      return Array.from(map.values()).map((e) => ({
        departement: e.departement,
        communes: Array.from(e.communes.values()),
      }));
    };

    return {
      pdc: groupByDepartement(pdc),
      pdd: groupByDepartement(pdd),
    };
  }
  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        categorie: true,
        departement: true,
        arrondissement: true,
        commune: true,
      },
    });
    if (!document) throw new NotFoundException(`Document #${id} introuvable`);
    return document;
  }

  async findBySlug(slug: string) {
    const document = await this.prisma.document.findUnique({
      where: { slug },
      include: {
        categorie: true,
        departement: true,
        arrondissement: true,
        commune: true,
      },
    });
    if (!document)
      throw new NotFoundException(`Document "${slug}" introuvable`);
    return document;
  }

  async create(data: CreateDocumentDto) {
    const { datePublication, ...rest } = data;
    const createData: Record<string, unknown> = { ...rest };
    if (datePublication) createData.datePublication = new Date(datePublication);
    return this.prisma.document.create({
      data: createData as Parameters<
        typeof this.prisma.document.create
      >[0]['data'],
      include: {
        categorie: true,
        departement: true,
        arrondissement: true,
        commune: true,
      },
    });
  }

  async update(id: string, data: Partial<CreateDocumentDto>) {
    await this.findOne(id);
    const { datePublication, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };
    if (datePublication) updateData.datePublication = new Date(datePublication);
    return this.prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        categorie: true,
        departement: true,
        arrondissement: true,
        commune: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.document.delete({ where: { id } });
  }

  async incrementTelechargements(id: string) {
    await this.findOne(id);
    return this.prisma.document.update({
      where: { id },
      data: { telechargements: { increment: 1 } },
    });
  }

  async findOneForDownload(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc || !doc.fichier) {
      throw new NotFoundException('Document introuvable');
    }
    return doc;
  }
}
