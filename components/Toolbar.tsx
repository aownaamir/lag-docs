"use client";

import type { Editor } from "@tiptap/react";

type ToolbarProps = {
  editor: Editor;
};

export default function Toolbar({ editor }: ToolbarProps) {
  const buttonClass = (active = false) =>
    `rounded px-3 py-2 text-sm ${
      active ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
    }`;

  return (
    <div className="border-t">
      <div className="mx-auto flex max-w-5xl gap-1 px-6 py-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive("underline"))}
        >
          <u>U</u>
        </button>

        <div className="mx-1 border-l" />

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

        <div className="mx-1 border-l" />

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
