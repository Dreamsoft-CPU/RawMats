import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  // Create a basic response
  const response = NextResponse.next({
    request,
  });

  // Mock user authentication - default to authenticated
  const user = { id: "test-user-id" };

  // Mock redirect logic but don't actually redirect in tests
  const shouldRedirect =
    !user &&
    !request.nextUrl.pathname.startsWith("/api/auth") &&
    !request.nextUrl.pathname.startsWith("/api/recover") &&
    !request.nextUrl.pathname.startsWith("/api/register") &&
    !request.nextUrl.pathname.startsWith("/api/login") &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/register") &&
    !request.nextUrl.pathname.startsWith("/error") &&
    !request.nextUrl.pathname.startsWith("/recover");

  if (shouldRedirect) {
    // For testing purposes, we'll just indicate a redirect would happen
    // but return the normal response
    response.headers.set("x-mock-redirect", "/login");
  }

  return response;
}
