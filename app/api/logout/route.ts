import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { tokenName } from "@/constants/auth";

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(tokenName);

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
};
