"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import { useRouter } from "next/navigation";
import ShareDialog from "./ShareDialog";

type EditorProps = {
  documentId: string;
  initialTitle: string;
  initialContent: string;
};
export default function Editor({
  documentId,
  initialTitle,
  initialContent,
}: EditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const router = useRouter();

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const scheduleSave = (content: string, currentTitle: string) => {
    setSaveStatus("Saving...");

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");

      if (!user) return;

      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user._id,
          },
          body: JSON.stringify({
            title: currentTitle,
            content,
          }),
        });

        if (!response.ok) {
          throw new Error();
        }

        setSaveStatus("Saved");
      } catch {
        setSaveStatus("Failed to save");
      }
    }, 800);
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],

    content: initialContent,

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      scheduleSave(editor.getHTML(), title);
    },
  });

  async function saveDocument(content: string, currentTitle: string) {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!user) return;

    try {
      await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id,
        },
        body: JSON.stringify({
          title: currentTitle,
          content,
        }),
      });

      setSaveStatus("Saved");
    } catch {
      setSaveStatus("Failed to save");
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
            >
              ←
            </button>
            <input
              value={title}
              onChange={(event) => {
                const newTitle = event.target.value;

                setTitle(newTitle);

                if (editor) {
                  scheduleSave(editor.getHTML(), newTitle);
                }
              }}
              className="w-full max-w-xl border-none text-2xl font-bold outline-none"
              placeholder="Untitled Document"
            />
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{saveStatus}</span>

              <button
                type="button"
                onClick={() => setShowShareDialog(true)}
                className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                Share
              </button>
            </div>{" "}
          </div>
        </div>

        <Toolbar editor={editor} />
      </div>

      <div className="mx-auto max-w-4xl px-8 py-12">
        <EditorContent editor={editor} />
      </div>

      {showShareDialog && (
        <ShareDialog
          documentId={documentId}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}
