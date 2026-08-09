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
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="border-r border-gray-200 pr-5 text-lg text-gray-400 transition hover:text-red-600"
            >
              ←
            </button>

            <div className="min-w-0 flex-1">
              <input
                value={title}
                onChange={(event) => {
                  const newTitle = event.target.value;

                  setTitle(newTitle);

                  if (editor) {
                    scheduleSave(editor.getHTML(), newTitle);
                  }
                }}
                className="w-full border-none bg-transparent text-2xl font-bold tracking-tight text-gray-950 outline-none placeholder:text-gray-300"
                placeholder="Untitled Document"
              />
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <span
                className={`text-xs font-medium ${
                  saveStatus === "Failed to save"
                    ? "text-red-600"
                    : saveStatus === "Saving..."
                      ? "text-gray-400"
                      : "text-gray-500"
                }`}
              >
                {saveStatus}
              </span>

              <button
                type="button"
                onClick={() => setShowShareDialog(true)}
                className="border border-red-600 bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>

        <Toolbar editor={editor} />
      </div>

      <div className="mx-auto max-w-4xl px-8 py-14">
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
