## [6.1.0](https://github.com/geostyler/geostyler-mapbox-parser/compare/v6.0.1...v6.1.0) (2024-12-02)


### Features

* add interpolate function ([#325](https://github.com/geostyler/geostyler-mapbox-parser/issues/325)) ([6567d8b](https://github.com/geostyler/geostyler-mapbox-parser/commit/6567d8b14c0158f96856de8786081d4fd0f554ff))


### Bug Fixes

* **deps:** update dependency @types/mapbox-gl to v2.7.21 ([d7cf5ea](https://github.com/geostyler/geostyler-mapbox-parser/commit/d7cf5ea2d80a4baae9b5990f9b90ac7c5fa5b330))
* preserve outline dash array ([77edffb](https://github.com/geostyler/geostyler-mapbox-parser/commit/77edffbf967d31c668e6b4a2e8c3a8d90b9517a4))

## [6.0.1](https://github.com/geostyler/geostyler-mapbox-parser/compare/v6.0.0...v6.0.1) (2024-11-11)


### Bug Fixes

* preserve visibility in line symbolizer during cloning ([dfda998](https://github.com/geostyler/geostyler-mapbox-parser/commit/dfda9982199eb1769d3b1a103d26940517949874))

## [6.0.0](https://github.com/geostyler/geostyler-mapbox-parser/compare/v5.0.1...v6.0.0) (2024-06-25)


### ⚠ BREAKING CHANGES

* Switches to esm build and to vite. Users possibly
need to adapt their imports and their bundler.

### Features

* prepare next release ([f110eec](https://github.com/geostyler/geostyler-mapbox-parser/commit/f110eecbdedd3830a03be0b31cb13615fbc03027))
* read rgba color values into hex ([#323](https://github.com/geostyler/geostyler-mapbox-parser/issues/323)) ([e47192d](https://github.com/geostyler/geostyler-mapbox-parser/commit/e47192d7a62b9e70f9e1d2fd36e8f74f1abe6dcd))


### Bug Fixes

* update dependencies ([5926b1b](https://github.com/geostyler/geostyler-mapbox-parser/commit/5926b1b087ca05ac3825b9fb262756f27510112f))
* update resolutions to levels 0-24 ([#320](https://github.com/geostyler/geostyler-mapbox-parser/issues/320)) ([b02d9a5](https://github.com/geostyler/geostyler-mapbox-parser/commit/b02d9a5bbafba4d544f935c3ac40a785cbb7ecec))

## [6.0.0-next.2](https://github.com/geostyler/geostyler-mapbox-parser/compare/v6.0.0-next.1...v6.0.0-next.2) (2024-06-25)


### Bug Fixes

* update dependencies ([5926b1b](https://github.com/geostyler/geostyler-mapbox-parser/commit/5926b1b087ca05ac3825b9fb262756f27510112f))

## [6.0.0-next.1](https://github.com/geostyler/geostyler-mapbox-parser/compare/v5.0.1...v6.0.0-next.1) (2024-06-21)


### ⚠ BREAKING CHANGES

* Switches to esm build and to vite. Users possibly
need to adapt their imports and their bundler.

### Features

* prepare next release ([f110eec](https://github.com/geostyler/geostyler-mapbox-parser/commit/f110eecbdedd3830a03be0b31cb13615fbc03027))
* read rgba color values into hex ([#323](https://github.com/geostyler/geostyler-mapbox-parser/issues/323)) ([e47192d](https://github.com/geostyler/geostyler-mapbox-parser/commit/e47192d7a62b9e70f9e1d2fd36e8f74f1abe6dcd))


### Bug Fixes

* update resolutions to levels 0-24 ([#320](https://github.com/geostyler/geostyler-mapbox-parser/issues/320)) ([b02d9a5](https://github.com/geostyler/geostyler-mapbox-parser/commit/b02d9a5bbafba4d544f935c3ac40a785cbb7ecec))

## [5.0.1](https://github.com/geostyler/geostyler-mapbox-parser/compare/v5.0.0...v5.0.1) (2023-12-05)


### Bug Fixes

* allow scale to be a GeoStylerFunction ([73d2271](https://github.com/geostyler/geostyler-mapbox-parser/commit/73d2271e536b14604ca222aaa9af6972014930aa))
* treat ison-size as scale ([ebc9434](https://github.com/geostyler/geostyler-mapbox-parser/commit/ebc9434443ffa4ead4d0bf0296b3422cc73aa2c4))
* use width and multiply directly ([113ef5e](https://github.com/geostyler/geostyler-mapbox-parser/commit/113ef5e8c051e4433971fd3034ff102922f74adf))

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
