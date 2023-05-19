import expression_get from '../data/mapbox/expression_get';
import expression_get_metadata from '../data/mapbox_metadata/expression_get';
import gs_expression_property from '../data/styles/gs_expression_property';
import MapboxStyleParser from './MapboxStyleParser';

describe('MapboxStyleParser can parse Expressions', () => {
  let styleParser: MapboxStyleParser;

  beforeEach(() => {
    styleParser = new MapboxStyleParser();
  });

  describe('#readStyle', () => {
    it('can read the "get" expression', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(expression_get);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(gs_expression_property);
      return;
    });
  });

  describe('#writeStyle', () => {
    it('can write the "property" expression', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_property);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_get_metadata);
      return;
    });
  });
});
