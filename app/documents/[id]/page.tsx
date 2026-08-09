"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@/components/Editor";

type DocumentData = {
  _id: string;
  title: string;
  content: string;
};

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocument() {
      const storedUser = localStorage.getItem("currentUser");

      if (!storedUser) {
        router.replace("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      try {
        const response = await fetch(`/api/documents/${params.id}`, {
          headers: {
            "x-user-id": user._id,
          },
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        setDocument(data);
      } catch {
        setError("Unable to load document");
      }
    }

    loadDocument();
  }, [params.id, router]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md border border-gray-200 bg-white p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-2 w-2 bg-red-600" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
              Document Error
            </p>
          </div>

          <h1 className="text-xl font-bold text-gray-950">
            Unable to load document
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The document could not be loaded. Please return to your workspace
            and try again.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-6 border border-red-600 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Back to Documents
          </button>
        </div>
      </main>
    );
  }

  if (!document) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-1 bg-red-600" />
          <p className="text-sm font-medium text-gray-500">
            Loading document...
          </p>
        </div>
      </main>
    );
  }

  return (
    <Editor
      documentId={document._id}
      initialTitle={document.title}
      initialContent={document.content}
    />
  );
}
