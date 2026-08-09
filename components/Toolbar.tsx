"use client";

import type { Editor } from "@tiptap/react";

type ToolbarProps = {
  editor: Editor;
};

export default function Toolbar({ editor }: ToolbarProps) {
  const buttonClass = (active = false) =>
    `border px-3 py-1.5 text-sm font-medium transition ${
      active
        ? "border-red-600 bg-red-600 text-white"
        : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
    }`;

  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-1 px-6 py-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
          aria-label="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
          aria-label="Italic"
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive("underline"))}
          aria-label="Underline"
        >
          <u>U</u>
        </button>

        <div className="mx-2 h-5 border-l border-gray-200" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(
            editor.isActive("heading", {
              level: 1,
            }),
          )}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(
            editor.isActive("heading", {
              level: 2,
            }),
          )}
        >
          H2
        </button>

        <div className="mx-2 h-5 border-l border-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
        >
          1. List
        </button>
      </div>
    </div>
  );
}
