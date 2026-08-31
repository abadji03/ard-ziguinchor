import { paginate } from './pagination.dto';

describe('paginate', () => {
  it('calcule correctement la pagination de base', () => {
    const result = paginate([1, 2, 3], 25, 1, 10);
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.meta).toEqual({
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    });
  });

  it('indique hasPrev sur les pages suivantes', () => {
    const result = paginate([], 25, 2, 10);
    expect(result.meta.hasPrev).toBe(true);
    expect(result.meta.hasNext).toBe(true);
  });

  it('gère une dernière page sans page suivante', () => {
    const result = paginate([1], 25, 3, 10);
    expect(result.meta.hasNext).toBe(false);
    expect(result.meta.hasPrev).toBe(true);
  });

  it('gère un résultat vide', () => {
    const result = paginate([], 0, 1, 10);
    expect(result.meta.total).toBe(0);
    expect(result.meta.totalPages).toBe(0);
    expect(result.meta.hasNext).toBe(false);
    expect(result.meta.hasPrev).toBe(false);
  });

  it('arrondit totalPages au plafond', () => {
    const result = paginate([], 11, 1, 10);
    expect(result.meta.totalPages).toBe(2);
  });
});
