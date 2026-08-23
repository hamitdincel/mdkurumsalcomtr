'use client'

import * as React from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * TipTap tabanlı zengin metin editörü.
 *
 * Çıktı iki biçimde saklanır:
 *  - contentJson : yeniden düzenleme için yapısal veri
 *  - contentHtml : okuma performansı için hazır HTML (server'da sanitize edilir)
 */
export function RichTextEditor({
  initialHtml,
  onChange,
}: {
  initialHtml?: string
  onChange: (payload: { html: string; json: unknown }) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
    ],
    content: initialHtml ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose-site max-w-none min-h-80 px-4 py-4 focus:outline-none [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:mt-5 [&_h3]:mb-2',
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange({ html: instance.getHTML(), json: instance.getJSON() })
    },
  })

  if (!editor) {
    return (
      <div className="min-h-96 rounded-sm border border-line bg-surface-sunken/40 p-4 text-sm text-ink-subtle">
        Editör yükleniyor…
      </div>
    )
  }

  return (
    <div className="overflow-hidden panel rounded-sm">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const buttons = [
    {
      icon: Bold,
      label: 'Kalın',
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
    },
    {
      icon: Italic,
      label: 'İtalik',
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
    },
    {
      icon: Strikethrough,
      label: 'Üstü çizili',
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive('strike'),
    },
    {
      icon: Heading2,
      label: 'Başlık 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: Heading3,
      label: 'Başlık 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: List,
      label: 'Madde listesi',
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      label: 'Numaralı liste',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      label: 'Alıntı',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive('blockquote'),
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-line bg-surface-sunken/50 p-2">
      {buttons.map(({ icon: Icon, label, action, active }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          aria-label={label}
          aria-pressed={active}
          title={label}
          className={cn(
            'flex size-8 items-center justify-center rounded-xs transition-colors',
            active ? 'bg-action text-on-action' : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
          )}
        >
          <Icon className="size-4" aria-hidden />
        </button>
      ))}

      <span className="mx-1 h-5 w-px bg-line" aria-hidden />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        aria-label="Geri al"
        title="Geri al"
        className="flex size-8 items-center justify-center rounded-xs text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
      >
        <Undo2 className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        aria-label="İleri al"
        title="İleri al"
        className="flex size-8 items-center justify-center rounded-xs text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
      >
        <Redo2 className="size-4" aria-hidden />
      </button>
    </div>
  )
}
