import "@testing-library/jest-dom";

// Mock Next.js modules
jest.mock("next/headers", () => ({
  cookies: () => ({
    getAll: () => [],
    set: () => {},
  }),
}));

// Mock Supabase modules
jest.mock("./src/utils/supabase/server", () =>
  require("./__mocks__/supabase/server")
);
jest.mock("./src/utils/supabase/middleware", () =>
  require("./__mocks__/supabase/middleware")
);
jest.mock("./src/utils/supabase/client", () =>
  require("./__mocks__/supabase/client")
);
