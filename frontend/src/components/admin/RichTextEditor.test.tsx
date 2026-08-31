import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RichTextEditor } from './RichTextEditor';

describe('RichTextEditor', () => {
  it('affiche le label et la barre d\'outils', () => {
    render(<RichTextEditor label="Contenu" value="" onChange={() => {}} />);
    expect(screen.getByText('Contenu')).toBeInTheDocument();
    // Boutons de la toolbar identifiés par leur title
    expect(screen.getByTitle('Gras')).toBeInTheDocument();
    expect(screen.getByTitle('Italique')).toBeInTheDocument();
    expect(screen.getByTitle('Titre')).toBeInTheDocument();
    expect(screen.getByTitle('Lien')).toBeInTheDocument();
    expect(screen.getByTitle('Taille de police')).toBeInTheDocument();
    expect(screen.getByTitle('Couleur du texte')).toBeInTheDocument();
  });

  it('charge le contenu initial dans l\'éditeur', () => {
    const { container } = render(
      <RichTextEditor label="Contenu" value="<p>Texte initial</p>" onChange={() => {}} />
    );
    expect(container.querySelector('.ProseMirror')?.textContent).toContain('Texte initial');
  });

  it('resynchronise le contenu quand la valeur externe change (formulaire d\'édition async)', () => {
    const { container, rerender } = render(
      <RichTextEditor label="Contenu" value="<p>Versions un</p>" onChange={() => {}} />
    );
    expect(container.querySelector('.ProseMirror')?.textContent).toContain('Versions un');

    // Simulation du reset() de react-hook-form après chargement React Query
    rerender(<RichTextEditor label="Contenu" value="<p>Versions deux</p>" onChange={() => {}} />);
    expect(container.querySelector('.ProseMirror')?.textContent).toContain('Versions deux');
  });

  it('vide le contenu quand la valeur externe devient vide', () => {
    const { container, rerender } = render(
      <RichTextEditor label="Contenu" value="<p>À effacer</p>" onChange={() => {}} />
    );
    rerender(<RichTextEditor label="Contenu" value="" onChange={() => {}} />);
    expect(container.querySelector('.ProseMirror')?.textContent).toBe('');
  });

  it('les boutons de la toolbar sont des boutons (ne soumettent pas de formulaire)', () => {
    render(<RichTextEditor label="Contenu" value="" onChange={() => {}} />);
    const buttons = screen.getAllByTitle('Gras');
    for (const btn of buttons) {
      expect(btn).toHaveAttribute('type', 'button');
    }
  });

  it('affiche une erreur de validation si fournie', () => {
    render(
      <RichTextEditor label="Contenu" value="" onChange={() => {}} error="Contenu requis" />
    );
    expect(screen.getByText('Contenu requis')).toBeInTheDocument();
  });

  it('affiche l\'étoile de champ requis', () => {
    render(<RichTextEditor label="Contenu" value="" onChange={() => {}} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
