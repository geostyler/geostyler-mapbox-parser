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
