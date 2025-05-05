import { POST } from "../../src/app/api/login/route";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

// Mock the supabase server client
jest.mock("@/utils/supabase/server");

describe("POST /api/login", () => {
  // Create a reusable mock request function that returns a NextRequest
  const createMockRequest = (body: any): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body),
      nextUrl: {
        clone: jest.fn().mockReturnValue({
          pathname: "/",
        }),
      },
      cookies: {
        getAll: () => [],
        get: () => undefined,
        set: jest.fn(),
        delete: jest.fn(),
        has: jest.fn(),
      },
      // Additional required NextRequest properties
      geo: {} as any,
      ip: "",
      url: "http://localhost:3000/api/login",
      formData: jest.fn(),
      headers: new Headers(),
      blob: jest.fn(),
      text: jest.fn(),
      arrayBuffer: jest.fn(),
      bodyUsed: false,
      body: null,
      cache: undefined,
      credentials: undefined,
      destination: "",
      integrity: "",
      keepalive: false,
      method: "POST",
      mode: undefined,
      redirect: undefined,
      referrer: "",
      referrerPolicy: undefined,
      signal: {} as AbortSignal,
    } as unknown as NextRequest;
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should successfully log in with correct credentials", async () => {
    // Setup
    const mockAuthResponse = {
      data: {
        user: {
          id: "test-user-id",
          email: "test@example.com",
        },
        session: {},
      },
      error: null,
    };

    // Mock the supabase client implementation for this test
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue(mockAuthResponse),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    // Create a mock request with valid login data
    const mockRequest = createMockRequest({
      email: "test@example.com",
      password: "correctPassword",
    });

    // Act
    const response = await POST(mockRequest);
    const responseData = await response.json();

    // Assert
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "correctPassword",
    });
    expect(response.status).toBe(200);
    expect(responseData).toEqual({ status: 204 });
  });

  it("should fail with incorrect credentials", async () => {
    // Setup
    const mockAuthResponse = {
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    };

    // Mock the supabase client implementation for this test
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue(mockAuthResponse),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    // Create a mock request with invalid login data
    const mockRequest = createMockRequest({
      email: "test@example.com",
      password: "wrongPassword",
    });

    // Act
    const response = await POST(mockRequest);
    const responseData = await response.json();

    // Assert
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "wrongPassword",
    });
    expect(response.status).toBe(400);
    expect(responseData.error).toBe(true);
    expect(responseData.message).toBe("Invalid login credentials");
  });

  it("should handle missing user data", async () => {
    // Setup - auth succeeds but returns no user
    const mockAuthResponse = {
      data: { user: null, session: {} },
      error: null,
    };

    // Mock the supabase client implementation for this test
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue(mockAuthResponse),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    // Create a mock request
    const mockRequest = createMockRequest({
      email: "test@example.com",
      password: "somePassword",
    });

    // Act
    const response = await POST(mockRequest);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(responseData.error).toBe(true);
    expect(responseData.message).toBe("User does not exist!");
  });

  it("should handle unexpected exceptions", async () => {
    // Setup - simulate a server-side exception
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockImplementation(() => {
          throw new Error("Unexpected error");
        }),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    // Create a mock request
    const mockRequest = createMockRequest({
      email: "test@example.com",
      password: "somePassword",
    });

    // Act
    const response = await POST(mockRequest);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(responseData.error).toBe(true);
    expect(responseData.message).toBe("Unexpected error");
  });

  it("should handle malformed request data", async () => {
    // Setup - json parsing fails
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      nextUrl: {
        clone: jest.fn().mockReturnValue({
          pathname: "/",
        }),
      },
      cookies: {
        getAll: () => [],
        get: () => undefined,
        set: jest.fn(),
        delete: jest.fn(),
        has: jest.fn(),
      },
      // Additional required NextRequest properties
      geo: {} as any,
      ip: "",
      url: "http://localhost:3000/api/login",
      formData: jest.fn(),
      headers: new Headers(),
      blob: jest.fn(),
      text: jest.fn(),
      arrayBuffer: jest.fn(),
      bodyUsed: false,
      body: null,
      cache: undefined,
      credentials: undefined,
      destination: "",
      integrity: "",
      keepalive: false,
      method: "POST",
      mode: undefined,
      redirect: undefined,
      referrer: "",
      referrerPolicy: undefined,
      signal: {} as AbortSignal,
    } as unknown as NextRequest;

    // Act
    const response = await POST(mockRequest);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(responseData.error).toBe(true);
    expect(responseData.message).toBe("Invalid JSON");
  });
});
