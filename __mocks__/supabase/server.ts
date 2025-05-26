import { User } from "@supabase/supabase-js";

// Mock user data
const mockUser: User = {
  id: "test-user-id",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

// Mock database responses
const mockData = {
  users: [mockUser],
  // Add other mock data collections as needed
};

export async function createClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: mockUser }, error: null }),
      getSession: async () => ({
        data: { session: { user: mockUser } },
        error: null,
      }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          data: mockData[table as keyof typeof mockData] || [],
          error: null,
        }),
        data: mockData[table as keyof typeof mockData] || [],
        error: null,
      }),
      insert: () => ({ data: {}, error: null }),
      update: () => ({ data: {}, error: null }),
      delete: () => ({ data: {}, error: null }),
    }),
  };
}
