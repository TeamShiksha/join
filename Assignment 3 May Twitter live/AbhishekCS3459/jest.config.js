
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.ts'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
  };
  