import expression_case from '../data/mapbox/expression_case';
import expression_metadata from '../data/mapbox_metadata/expression_case';
import expression_get from '../data/mapbox/expression_get';
import expression_get_metadata from '../data/mapbox_metadata/expression_get';
import gs_expression_case from '../data/styles/gs_expression_case';
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
    it('can read the "case" expression', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(expression_case);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(gs_expression_case);
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
    it('can write the "case" expression', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_case);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_metadata);
      return;
    });
  });
});
