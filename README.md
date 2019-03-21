# geostyler-mapbox-parser
GeoStyler-Style-Parser implementation for Mapbox

### Important Notes
Since mapbox works with [spritesheets](https://docs.mapbox.com/api/maps/#sprites), geostyler-mapbox-parser is only capable of handling sprites/icons if the application that is using the parser implements following API:

`GET /sprites/?name&baseurl`
- `name` - name of the sprite in the spritesheet corresponding json
- `baseurl` - baseurl for retrieving spritesheet and sprite json

The endpoint MUST return a reference to a single image.

---

Mapbox Styles require the properties [`sources`](https://docs.mapbox.com/mapbox-gl-js/style-spec/#root-sources) (root property) and [`source`](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-source) (layers property). geostyler-mapbox-parser only parses style related properties to keep a clear separation between style and data. Thus, `sources` and `source` have to be added to the created styleobject after parsing, manually.


### Issues
Please provide related issues here https://github.com/terrestris/geostyler/issues

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
