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
      <main className="p-8">
        <p>{error}</p>

        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded border px-4 py-2"
        >
          Back to Documents
        </button>
      </main>
    );
  }

  if (!document) {
    return <main className="p-8">Loading document...</main>;
  }

  return (
    <Editor
      documentId={document._id}
      initialTitle={document.title}
      initialContent={document.content}
    />
  );
}
