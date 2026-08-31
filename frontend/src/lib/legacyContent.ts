/**
 * Conversion du contenu descriptif pour l'affichage public.
 *
 * Historique : certaines descriptions (région notamment) ont été saisies en
 * texte brut avec un mini-Markdown maison ("## Titre", "- liste"). Depuis
 * l'introduction de l'éditeur WYSIWYG, les descriptions peuvent contenir du
 * HTML. Cette fonction :
 *  - retourne le contenu tel quel s'il contient déjà du HTML ;
 *  - convertit sinon le mini-Markdown en HTML équivalent.
 */
export function legacyContentToHtml(text: string | null | undefined): string {
  const value = text ?? '';
  if (value.includes('<')) return value;

  const lines = value.split('\n');
  const out: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line === '') {
      closeList();
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      out.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith('## ')) {
      closeList();
      out.push(`<h3>${line.slice(3)}</h3>`);
    } else if (line.startsWith('# ')) {
      closeList();
      out.push(`<h2>${line.slice(2)}</h2>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${line.slice(2)}</li>`);
    } else {
      closeList();
      out.push(`<p>${line}</p>`);
    }
  }
  closeList();
  return out.join('\n');
}
