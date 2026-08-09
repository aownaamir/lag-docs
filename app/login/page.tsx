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
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Lag Docs</h1>

        <p>Select a demo user</p>

        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => login(user)}
            className="w-full border p-3 rounded"
          >
            {user.name}
          </button>
        ))}
      </div>
    </main>
  );
}
