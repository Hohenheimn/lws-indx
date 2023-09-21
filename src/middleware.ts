// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";




export function middleware(req: NextRequest) {
  return NextResponse.rewrite(req.nextUrl);
}

export const config = {
  matcher: "/",
};
