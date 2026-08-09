// "use client";

// import { useRouter } from "next/navigation";

// export default function UserSwitcher() {
//   const router = useRouter();
//   const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

//   function switchUser() {
//     localStorage.removeItem("currentUser");
//     router.push("/login");
//   }

//   if (!currentUser) return null;

//   return (
//     <button onClick={switchUser} className="border rounded px-3 py-2">
//       {currentUser.name}
//     </button>
//   );
// }

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
    <div>
      <button onClick={switchUser} className="border rounded px-3 py-2">
        {currentUser.name}
      </button>
    </div>
  );
}
