import type { Config } from "@jest/types";

const jestConfigInitialOptions: Config.InitialOptions = {
  testMatch: ["<rootDir>/**/*.(spec|test).ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  // setupFiles: ["./jest.setup.ts"],
  // setupFilesAfterEnv: ["./jest.setupAfterEnv.ts"],
};

export default jestConfigInitialOptions;
