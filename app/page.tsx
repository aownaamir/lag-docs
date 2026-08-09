"use client";

import Dashboard from "@/components/Dashboard";
import UserSwitcher from "@/components/UserSwitcher";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Lag Docs</h1>

          <UserSwitcher />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <Dashboard />
      </div>
    </main>
  );
}
