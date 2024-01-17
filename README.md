# geostyler-mapbox-parser

[![Coverage Status](https://coveralls.io/repos/github/geostyler/geostyler-mapbox-parser/badge.svg?branch=master)](https://coveralls.io/github/geostyler/geostyler-mapbox-parser?branch=master)
[![License](https://img.shields.io/github/license/geostyler/geostyler-mapbox-parser)](https://github.com/geostyler/geostyler-mapbox-parser/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/geostyler-mapbox-parser.svg)](https://www.npmjs.com/package/geostyler-mapbox-parser)

## :rocket: GeoStyler Code Sprint 2024

We are happy to announce the third GeoStyler Code Sprint from **17.-21.06.2024** in Paris. Be part of it! More infos on https://geostyler.org/.

GeoStyler-Style-Parser implementation for Mapbox

### Important Notes
Since mapbox works with [spritesheets](https://docs.mapbox.com/api/maps/#sprites), geostyler-mapbox-parser is only capable of handling sprites/icons if the application that is using the parser implements following API:

`GET /sprites/?name&baseurl`
- `name` - name of the sprite in the spritesheet corresponding json
- `baseurl` - baseurl for retrieving spritesheet and sprite json

The endpoint MUST return a reference to a single image.

---

Mapbox styles require the properties [`sources`](https://docs.mapbox.com/mapbox-gl-js/style-spec/#root-sources) (root property)
and [`source`](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-source) (layers property).
In order to keep a clear separation between style and data, geostyler-mapbox-parser puts the source-related attributes into the metadata block of
a geostyler-style under `mapbox:ref`. There, the original sources object, as well as the mappings between layers and sources will be stored
(properties `sources`, `sourceMapping` and `layerSourceMapping`). Applications can then use these mappings for re-creating the same layer structure
using their map library of choice (e.g. OpenLayers, etc.).

### How to use

ES6:
```js
import MapboxParser from "geostyler-mapbox-parser";

const pointSimplePoint = {
  name: "My Style",
  rules: [
    {
      name: "My Rule",
      symbolizers: [
        {
          kind: "Mark",
          wellKnownName: "circle",
          color: "#FF0000",
          radius: 6
        }
      ]
    }
  ]
};

const parser = new MapboxParser();

const { output: mbStyle } = await parser.writeStyle(pointSimplePoint);
console.log(mbStyle);
```

Browser:

```js
const pointSimplePoint = {
  name: "My Style",
  rules: [
    {
      name: "My Rule",
      symbolizers: [
        {
          kind: "Mark",
          wellKnownName: "Circle",
          color: "#FF0000",
          radius: 6
        }
      ]
    }
  ]
};
var parser = new GeoStylerMapboxParser.MapboxStyleParser();
parser
  .writeStyle(pointSimplePoint)
  .then(function(res) {
    var mbStyle = res.output;
    console.log(mbStyle);
  });
```

## <a name="funding"></a>Funding & financial sponsorship

Maintenance and further development of this code can be funded through the
[GeoStyler Open Collective](https://opencollective.com/geostyler). All contributions and
expenses can transparently be reviewed by anyone; you see what we use the donated money for.
Thank you for any financial support you give the GeoStyler project 💞

