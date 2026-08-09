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
      className="group block border border-gray-200 bg-white px-5 py-4 transition hover:border-red-500 hover:bg-red-50/30"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900 group-hover:text-red-700">
            {document.title}
          </h3>

          {shared && document.owner && (
            <p className="mt-1 text-sm text-gray-500">
              Shared by{" "}
              <span className="font-medium text-gray-700">
                {document.owner.name}
              </span>
            </p>
          )}
        </div>

        <span
          className={`shrink-0 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            shared
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-gray-200 bg-gray-50 text-gray-500"
          }`}
        >
          {shared ? "Shared" : "Owned"}
        </span>
      </div>
    </Link>
  );
}
