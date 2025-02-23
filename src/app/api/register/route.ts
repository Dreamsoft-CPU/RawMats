import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  console.log("Request path:", req.nextUrl.pathname);
  return NextResponse.json({ message: "Hello, World!" });
};
