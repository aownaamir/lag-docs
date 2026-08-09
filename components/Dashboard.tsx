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
      <div className="border-l-4 border-red-600 bg-red-50 p-5">
        <p className="text-sm font-medium text-red-700">{error}</p>

        <button
          onClick={loadDocuments}
          className="mt-4 border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <p className="text-sm font-medium text-gray-500">Loading documents...</p>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
            Workspace
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            Documents
          </h2>
        </div>

        <button
          onClick={createDocument}
          className="border border-red-600 bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          + New Document
        </button>
      </div>

      <FileUpload />

      <section>
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            My Documents
          </h3>

          <span className="text-xs font-medium text-gray-400">
            {owned.length} {owned.length === 1 ? "document" : "documents"}
          </span>
        </div>

        {owned.length === 0 ? (
          <div className="border border-dashed border-gray-300 bg-white px-5 py-8">
            <p className="text-sm text-gray-500">
              You don&apos;t have any documents yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {owned.map((document) => (
              <DocumentCard key={document._id} document={document} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            Shared With Me
          </h3>

          <span className="text-xs font-medium text-gray-400">
            {shared.length} {shared.length === 1 ? "document" : "documents"}
          </span>
        </div>

        {shared.length === 0 ? (
          <div className="border border-dashed border-gray-300 bg-white px-5 py-8">
            <p className="text-sm text-gray-500">
              No documents have been shared with you.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {shared.map((document) => (
              <DocumentCard key={document._id} document={document} shared />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
