const testRegex = 'src/.*\\.spec.ts$';

module.exports = {
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "\\.(ts)$": "ts-jest"
  },
  testRegex: testRegex,
  collectCoverageFrom: [
    'src/*.ts',
    '!' + testRegex
  ]
};
