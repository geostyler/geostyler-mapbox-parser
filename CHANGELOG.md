## [5.0.0](https://github.com/geostyler/geostyler-mapbox-parser/compare/v4.0.0...v5.0.0) (2023-12-04)


### ⚠ BREAKING CHANGES

* use geostyler-style Sprite instead of string syntax
* This changes the typing of the MbStyle by making
the property 'source' required. Through this, we actually follow
the MapBox Style Specification. MbStyles that previously omitted the
'source' property, will now have to add it.

### Features

* add sprite support ([9d883be](https://github.com/geostyler/geostyler-mapbox-parser/commit/9d883be90463480fc1cd71e3bce48aaf43d88405))
* add spriteCache ([9043e10](https://github.com/geostyler/geostyler-mapbox-parser/commit/9043e10a93a0394cdda2e4fcb575abefbc3e9c1e))
* keep track of mapbox sources and source layers in layers ([a8f5d7c](https://github.com/geostyler/geostyler-mapbox-parser/commit/a8f5d7c787a78dc9d59d91ac14e52ef8686c4822))
* parse placement of TextSymbolizer ([#292](https://github.com/geostyler/geostyler-mapbox-parser/issues/292)) ([9acb43f](https://github.com/geostyler/geostyler-mapbox-parser/commit/9acb43f377bca6c376155e0b6b0b9d09d9c4cc4c))


### Bug Fixes

* address comments and add docs ([eca7607](https://github.com/geostyler/geostyler-mapbox-parser/commit/eca760769e3e7c4a1b6869de7050f99c0ba97fab))
* **lint:** remove test util ([9a01114](https://github.com/geostyler/geostyler-mapbox-parser/commit/9a01114f3be74aae80c46ba622d3dfecde73851b))
* merge icontext symbol from separate symbolizers when needed ([a02a565](https://github.com/geostyler/geostyler-mapbox-parser/commit/a02a5650311723cb2d741c5a890a3b3c6b59e23e))
* mutate only clones of arguments ([36a76d0](https://github.com/geostyler/geostyler-mapbox-parser/commit/36a76d0af0560ef8fce43e63144f06d61565cf9f))
* typos ([2de63cc](https://github.com/geostyler/geostyler-mapbox-parser/commit/2de63cc64d3b7c7ad81efc6308c5fa372d6f5196))
