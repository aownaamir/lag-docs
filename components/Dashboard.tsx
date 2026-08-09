"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DocumentCard from "@/components/DocumentCard";
import FileUpload from "./FileUpload";

type Document = {
  _id: string;
  title: string;
  updatedAt: string;
  owner?: {
    name: string;
    email: string;
  };
};

export default function Dashboard() {
  const router = useRouter();

  const [owned, setOwned] = useState<Document[]>([]);
  const [shared, setShared] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDocuments() {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const response = await fetch("/api/documents", {
        headers: {
          "x-user-id": user._id,
        },
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setOwned(data.owned || []);
      setShared(data.shared || []);
    } catch {
      setError("Unable to load your documents.");
      setOwned([]);
      setShared([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function createDocument() {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!user) {
      router.push("/login");
      return;
    }

    const response = await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user._id,
      },
      body: JSON.stringify({
        title: "Untitled Document",
        content: "<p></p>",
      }),
    });

    if (!response.ok) {
      return;
    }

    const document = await response.json();

    router.push(`/documents/${document._id}`);
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm text-red-700">{error}</p>

        <button
          onClick={loadDocuments}
          className="mt-3 rounded-lg border px-3 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return <p>Loading documents...</p>;
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Documents</h2>

        <button
          onClick={createDocument}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          + New Document
        </button>
      </div>

      <FileUpload />

      <section>
        <h3 className="mb-4 text-lg font-medium">My Documents</h3>

        {owned.length === 0 ? (
          <p className="text-sm text-gray-500">
            You don&apos;t have any documents yet.
          </p>
        ) : (
          <div className="space-y-3">
            {owned.map((document) => (
              <DocumentCard key={document._id} document={document} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-medium">Shared With Me</h3>

        {shared.length === 0 ? (
          <p className="text-sm text-gray-500">
            No documents have been shared with you.
          </p>
        ) : (
          <div className="space-y-3">
            {shared.map((document) => (
              <DocumentCard key={document._id} document={document} shared />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
