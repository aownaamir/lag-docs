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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
              Access
            </p>

            <h2 className="text-xl font-bold tracking-tight text-gray-950">
              Share document
            </h2>
          </div>

          <button
            onClick={onClose}
            className="border border-gray-200 px-2.5 py-1 text-sm text-gray-500 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Give access to
            </label>

            <select
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
              className="w-full border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600"
            >
              <option value="">Select a user</option>

              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={shareDocument}
            disabled={!selectedUser || loading}
            className="w-full border border-red-600 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-500"
          >
            {loading ? "Sharing..." : "Share Document"}
          </button>

          {message && (
            <div
              className={`border-l-2 px-3 py-2 text-sm ${
                message.includes("successfully")
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-red-600 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
