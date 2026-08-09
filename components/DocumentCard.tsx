"use client";

import Link from "next/link";

type DocumentCardProps = {
  document: {
    _id: string;
    title: string;
    owner?: {
      name: string;
      email: string;
    };
  };
  shared?: boolean;
};

export default function DocumentCard({
  document,
  shared = false,
}: DocumentCardProps) {
  return (
    <Link
      href={`/documents/${document._id}`}
      className="block rounded-xl border p-4 transition hover:bg-gray-50"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{document.title}</h3>

          {shared && document.owner && (
            <p className="mt-1 text-sm text-gray-500">
              Shared by {document.owner.name}
            </p>
          )}
        </div>

        <span className="text-sm text-gray-400">
          {shared ? "Shared" : "Owned"}
        </span>
      </div>
    </Link>
  );
}
