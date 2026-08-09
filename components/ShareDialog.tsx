"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
};

type ShareDialogProps = {
  documentId: string;
  onClose: () => void;
};

export default function ShareDialog({ documentId, onClose }: ShareDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  async function shareDocument() {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );

    if (!currentUser || !selectedUser) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser._id,
        },
        body: JSON.stringify({
          userId: selectedUser,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to share");
      }

      setMessage("Document shared successfully");

      setSelectedUser("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to share document",
      );
    } finally {
      setLoading(false);
    }
  }

  const currentUser = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("currentUser") || "null"
      : "null",
  );

  const availableUsers = users.filter((user) => user._id !== currentUser?._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Share document</h2>

          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <select
            value={selectedUser}
            onChange={(event) => setSelectedUser(event.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">Select a user</option>

            {availableUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <button
            onClick={shareDocument}
            disabled={!selectedUser || loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-40"
          >
            {loading ? "Sharing..." : "Share"}
          </button>

          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
