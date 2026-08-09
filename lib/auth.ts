import { headers } from "next/headers";

export async function getCurrentUserId() {
  const headerList = await headers();

  return headerList.get("x-user-id");
}
