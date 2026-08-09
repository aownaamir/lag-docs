"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  function login(user: User) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    router.push("/");
  }

  return (
    <main className="flex min-h-screen bg-gray-50">
      <div className="hidden w-2/5 bg-gray-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div>
              <p className="text-xl font-bold tracking-tight text-white">
                Lag Docs
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Collaborative Workspace
              </p>
            </div>
          </div>

          <div className="max-w-sm">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
              Write.
              <br />
              Share.
              <br />
              Move faster.
            </h2>

            <p className="mt-6 text-sm leading-6 text-gray-400">
              A lightweight collaborative document workspace for creating,
              editing, importing, and sharing documents.
            </p>
          </div>
        </div>

        <p className="text-xs uppercase tracking-wider text-gray-600">
          Product Engineering Assessment
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-950">
                  Lag Docs
                </h1>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Collaborative Workspace
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-8">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Demo Access
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                Choose a user
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Select an account to enter the workspace.
              </p>
            </div>

            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() => login(user)}
                  className="group flex w-full items-center justify-between border border-gray-200 bg-white px-4 py-4 text-left transition hover:border-red-600 hover:bg-red-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-red-700">
                      {user.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">{user.email}</p>
                  </div>

                  <span className="text-gray-300 transition group-hover:text-red-600">
                    →
                  </span>
                </button>
              ))}

              {users.length === 0 && (
                <p className="border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                  Loading demo users...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
