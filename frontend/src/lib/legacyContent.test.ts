import { describe, it, expect } from 'vitest';
import { legacyContentToHtml } from './legacyContent';

describe('legacyContentToHtml', () => {
  it('retourne tel quel un contenu contenant déjà du HTML', () => {
    const html = '<p>Déjà <strong>enrichi</strong></p>';
    expect(legacyContentToHtml(html)).toBe(html);
  });

  it('retourne une chaîne vide pour null/undefined', () => {
    expect(legacyContentToHtml(null)).toBe('');
    expect(legacyContentToHtml(undefined)).toBe('');
    expect(legacyContentToHtml('')).toBe('');
  });

  it('convertit les titres "## " en <h3>', () => {
    const result = legacyContentToHtml('Intro\n\n## Patrimoine');
    expect(result).toContain('<p>Intro</p>');
    expect(result).toContain('<h3>Patrimoine</h3>');
  });

  it('convertit les titres "# " en <h2>', () => {
    expect(legacyContentToHtml('# Grand titre')).toContain('<h2>Grand titre</h2>');
  });

  it('regroupe les lignes "- " en une liste <ul>', () => {
    const result = legacyContentToHtml('- Item un\n- Item deux');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Item un</li>');
    expect(result).toContain('<li>Item deux</li>');
    expect(result).toContain('</ul>');
  });

  it('ferme la liste quand un paragraphe suit', () => {
    const result = legacyContentToHtml('- A\n- B\nTexte final');
    expect(result.indexOf('</ul>')).toBeLessThan(result.indexOf('<p>Texte final</p>'));
  });

  it('enveloppe les lignes de texte en paragraphes', () => {
    const result = legacyContentToHtml('Premier paragraphe');
    expect(result).toBe('<p>Premier paragraphe</p>');
  });

  it('traite un contenu réaliste du seed (paragraphes + sections)', () => {
    const seed = [
      'Mlomp est une commune du département d\'Oussouye.',
      '',
      '## Patrimoine',
      'Mlomp est célèbre pour ses cases à impluvium.',
    ].join('\n');
    const result = legacyContentToHtml(seed);
    expect(result).toContain('<p>Mlomp est une commune');
    expect(result).toContain('<h3>Patrimoine</h3>');
    expect(result).toContain('<p>Mlomp est célèbre');
    // Le résultat doit être du HTML valide utilisable avec dangerouslySetInnerHTML
    expect(result).not.toContain('##');
  });
});
