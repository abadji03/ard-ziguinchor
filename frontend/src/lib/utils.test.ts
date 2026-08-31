import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  formatDateShort,
  formatFileSize,
  truncate,
  slugify,
  buildQueryString,
} from './utils';

describe('cn', () => {
  it('combine les classes', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('ignore les valeurs falsy', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });
});

describe('formatDate', () => {
  it('formate une date ISO en français (jour, mois, année)', () => {
    const result = formatDate('2026-08-15');
    expect(result).toMatch(/15/);
    expect(result).toMatch(/août/);
    expect(result).toMatch(/2026/);
  });
  it('accepte un objet Date', () => {
    expect(formatDate(new Date('2026-01-01T12:00:00Z'))).toMatch(/2026/);
  });
});

describe('formatDateShort', () => {
  it('formate jj/mm/aaaa', () => {
    const result = formatDateShort('2026-08-15');
    expect(result).toMatch(/15\/08\/2026/);
  });
});

describe('formatFileSize', () => {
  it('retourne "0 B" pour zéro octet', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });
  it('convertit en Ko et Mo', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
  });
  it('convertit en Go', () => {
    expect(formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2 GB');
  });
});

describe('truncate', () => {
  it('ne tronque pas une chaîne plus courte que la limite', () => {
    expect(truncate('court', 10)).toBe('court');
  });
  it('tronque et ajoute une ellipse', () => {
    expect(truncate('chaine-trop-longue', 5)).toBe('chain…');
  });
});

describe('slugify', () => {
  it('minuscule et tirets', () => {
    expect(slugify('Titre Simple')).toBe('titre-simple');
  });
  it('supprime les accents', () => {
    expect(slugify('Ziguinchor — Région Économique')).toBe('ziguinchor-region-economique');
  });
  it('supprime les caractères spéciaux', () => {
    expect(slugify("L'actualité ! 2026")).toBe('l-actualite-2026');
  });
  it('ne laisse pas de tirets en début/fin', () => {
    expect(slugify('  -- Test --  ')).toBe('test');
  });
});

describe('buildQueryString', () => {
  it('construit une query string', () => {
    expect(buildQueryString({ page: 2, limit: 10 })).toBe('page=2&limit=10');
  });
  it('ignore undefined, null et chaînes vides', () => {
    expect(buildQueryString({ a: 1, b: undefined, c: null, d: '' })).toBe('a=1');
  });
  it('mappe `search` vers `q` (attendu par le backend)', () => {
    expect(buildQueryString({ search: 'ziguinchor' })).toBe('q=ziguinchor');
  });
  it('encode les caractères spéciaux', () => {
    expect(buildQueryString({ q: 'cahier des charges' })).toBe('q=cahier+des+charges');
  });
});
