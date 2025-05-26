import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Path to Next.js app
  dir: "./src/",
});

// Custom Jest config
const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you when using Next.js)
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
};

// Export the combined config
export default createJestConfig(config);
