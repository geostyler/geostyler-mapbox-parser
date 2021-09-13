const testRegex = 'src/.*\\.spec.ts$';

module.exports = {
  "testURL": "http://localhost/",
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "transform": {
    "\\.(ts)$": "ts-jest"
  },
  "testRegex": testRegex,
  'collectCoverageFrom': [
    'src/*.ts',
    '!' + testRegex
  ]
};
