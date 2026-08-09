"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToHtml(text: string) {
  const lines = text.split(/\r?\n/);
  const output: string[] = [];

  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }

      output.push("<p></p>");
      continue;
    }

    if (trimmed.startsWith("# ")) {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }

      output.push(`<h1>${escapeHtml(trimmed.slice(2))}</h1>`);

      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }

      output.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);

      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        output.push("<ul>");
        inList = true;
      }

      output.push(`<li>${escapeHtml(trimmed.slice(2))}</li>`);

      continue;
    }

    if (inList) {
      output.push("</ul>");
      inList = false;
    }

    output.push(`<p>${escapeHtml(trimmed)}</p>`);
  }

  if (inList) {
    output.push("</ul>");
  }

  return output.join("");
}

export default function FileUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension !== "txt" && extension !== "md") {
      setError("Only .txt and .md files are supported.");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");

      if (!user) {
        router.push("/login");
        return;
      }

      const text = await file.text();

      const title = file.name.replace(/\.(txt|md)$/i, "");

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id,
        },
        body: JSON.stringify({
          title: title || "Imported Document",
          content: textToHtml(text),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import file");
      }

      router.push(`/documents/${data._id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to import file",
      );
    } finally {
      setLoading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-3">
        <h3 className="font-medium">Import a document</h3>

        <p className="text-sm text-gray-500">
          Upload a .txt or .md file to create an editable document.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        onChange={handleFile}
        disabled={loading}
        className="block w-full text-sm"
      />

      {loading && <p className="mt-3 text-sm text-gray-500">Importing...</p>}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
