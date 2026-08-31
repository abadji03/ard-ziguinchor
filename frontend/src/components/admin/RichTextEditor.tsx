'use client';

/**
 * Éditeur WYSIWYG (TipTap v3) pour les champs HTML de l'admin.
 * Produit du HTML standard (<strong>, <h2>, <ul>, <span style="color:...">…)
 * rendu côté public via la classe CSS "prose-content".
 */

import { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, Color, FontSize } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, List, ListOrdered, Quote, Link2,
  Undo2, Redo2, Eraser, Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  minHeight?: string;
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px'];

export function RichTextEditor({
  value,
  onChange,
  label,
  error,
  required,
  placeholder,
  minHeight = '300px',
}: RichTextEditorProps) {
  // Dernière valeur émise par l'éditeur — évite de réinitialiser le contenu
  // à chaque frappe quand le parent contrôle `value`.
  const emitted = useRef<string>(value ?? '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      TextStyle,
      Color,
      FontSize,
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose-content prose-sm max-w-none focus:outline-none min-h-full px-3 py-2',
        'data-placeholder': placeholder ?? '',
      },
    },
    onUpdate: ({ editor: e }) => {
      const html = e.isEmpty ? '' : e.getHTML();
      emitted.current = html;
      onChange(html);
    },
  });

  // Synchronisation quand la valeur change depuis l'extérieur
  // (chargement async d'un formulaire d'édition, reset du formulaire…).
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? '' : editor.getHTML();
    if ((value ?? '') !== current && (value ?? '') !== emitted.current) {
      editor.commands.setContent(value || '', { emitUpdate: false });
      emitted.current = value ?? '';
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL du lien :', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400" style={{ minHeight }}>
          Chargement de l&apos;éditeur…
        </div>
      </div>
    );
  }

  type Btn = { icon: React.ReactNode; title: string; action: () => void; active?: boolean };

  const groups: Btn[][] = [
    [
      { icon: <Undo2 className="h-4 w-4" />, title: 'Annuler (Ctrl+Z)', action: () => editor.chain().focus().undo().run() },
      { icon: <Redo2 className="h-4 w-4" />, title: 'Rétablir (Ctrl+Y)', action: () => editor.chain().focus().redo().run() },
    ],
    [
      { icon: <Bold className="h-4 w-4" />, title: 'Gras', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
      { icon: <Italic className="h-4 w-4" />, title: 'Italique', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
      { icon: <UnderlineIcon className="h-4 w-4" />, title: 'Souligné', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
      { icon: <Strikethrough className="h-4 w-4" />, title: 'Barré', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    ],
    [
      { icon: <Heading2 className="h-4 w-4" />, title: 'Titre', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
      { icon: <Heading3 className="h-4 w-4" />, title: 'Sous-titre', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    ],
    [
      { icon: <List className="h-4 w-4" />, title: 'Liste à puces', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
      { icon: <ListOrdered className="h-4 w-4" />, title: 'Liste numérotée', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
      { icon: <Quote className="h-4 w-4" />, title: 'Citation', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    ],
    [
      { icon: <Link2 className="h-4 w-4" />, title: 'Lien', action: setLink, active: editor.isActive('link') },
      { icon: <Eraser className="h-4 w-4" />, title: 'Effacer le formatage', action: () => editor.chain().focus().unsetAllMarks().clearNodes().run() },
    ],
  ];

  const currentColor = (editor.getAttributes('textStyle').color as string) || '#000000';
  const currentSize = (editor.getAttributes('textStyle').fontSize as string) || '16px';

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={cn(
          'w-full rounded-lg border bg-white overflow-hidden',
          error ? 'border-red-500' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary'
        )}
      >
        {/* Barre d'outils */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
          {groups.map((group, gi) => (
            <div key={gi} className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-gray-200 last:border-r-0">
              {group.map((btn, bi) => (
                <button
                  key={bi}
                  type="button"
                  title={btn.title}
                  onClick={btn.action}
                  className={cn(
                    'p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900',
                    btn.active && 'bg-primary/10 text-primary'
                  )}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          ))}

          {/* Taille de police */}
          <select
            title="Taille de police"
            value={currentSize}
            onChange={(e) => {
              const size = e.target.value;
              if (size === '16px') {
                editor.chain().focus().unsetFontSize().run();
              } else {
                editor.chain().focus().setFontSize(size).run();
              }
            }}
            className="h-7 rounded border border-gray-300 bg-white text-xs text-gray-700"
          >
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>{s.replace('px', '')}</option>
            ))}
          </select>

          {/* Couleur du texte */}
          <label
            title="Couleur du texte"
            className="p-1.5 rounded cursor-pointer text-gray-600 hover:bg-gray-200 relative"
          >
            <Palette className="h-4 w-4" />
            <input
              type="color"
              value={currentColor}
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>

        {/* Zone d'édition */}
        <div style={{ minHeight }} onClick={() => editor.commands.focus()}>
          <EditorContent editor={editor} />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
