# geostyler-mapbox-parser

[![Greenkeeper badge](https://badges.greenkeeper.io/geostyler/geostyler-mapbox-parser.svg)](https://greenkeeper.io/)

GeoStyler-Style-Parser implementation for Mapbox

### Important Notes
Since mapbox works with [spritesheets](https://docs.mapbox.com/api/maps/#sprites), geostyler-mapbox-parser is only capable of handling sprites/icons if the application that is using the parser implements following API:

`GET /sprites/?name&baseurl`
- `name` - name of the sprite in the spritesheet corresponding json
- `baseurl` - baseurl for retrieving spritesheet and sprite json

The endpoint MUST return a reference to a single image.

---

Mapbox Styles require the properties [`sources`](https://docs.mapbox.com/mapbox-gl-js/style-spec/#root-sources) (root property) and [`source`](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-source) (layers property). geostyler-mapbox-parser only parses style related properties to keep a clear separation between style and data. Thus, `sources` and `source` have to be added to the created styleobject after parsing, manually. See code snippet below for an example implementation of a wrapper function.

```javascript
/**
 * Example wrapper function that maps a source to the corresponding
 * layer based on layer id. Expects a mapper object with key value
 * pairs in the format of "layerId:'sourceName'".
**/
function wrapper(sources, mapper, style) {
  if (typeof style === 'undefined') {
    return;
  }
  if (typeof mapper === 'undefined') {
    return style;
  }
  if (typeof sources === 'undefined') {
    return style;
  }

  style.sources = sources;
  style.layers.forEach(l => {
    l.source = mapper[l.id];
  });
  return style;
}

// required mapper object where the key refers to the layer id
// and the value to the source name.
var mapper = {
  "water": "mapbox-streets"
};

// mapbox sources object
var sources = {
  "mapbox-streets": {
    "type": "vector",
    "url": "mapbox://mapbox.mapbox-streets-v6"
  }
};

// mapbox style object
var mbStyle = {
  version: 8,
  layers: [...]
};

var wrappedStyle = wrapper(sources, mapper, style);
```

### Issues
Please provide related issues here https://github.com/geostyler/geostyler/issues

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
          wellKnownName: "Circle",
          color: "#FF0000",
          radius: 6
        }
      ]
    }
  ]
};

const parser = new MapboxParser();

parser
  .writeStyle(pointSimplePoint)
  .then(mbStyle => console.log(mbStyle))
  .catch(error => console.log(error));
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
  .then(function(mbStyle) {
    console.log(mbStyle);
  })
  catch(function(error) {
    console.log(error);
  });
```
