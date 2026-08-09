"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
};

export default function UserSwitcher() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  function switchUser() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    router.push("/login");
  }

  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Signed in as
        </p>

        <p className="text-sm font-semibold text-gray-900">
          {currentUser.name}
        </p>
      </div>

      <button
        onClick={switchUser}
        className="border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-600 hover:bg-red-50 hover:text-red-600"
      >
        Switch User
      </button>
    </div>
  );
}
