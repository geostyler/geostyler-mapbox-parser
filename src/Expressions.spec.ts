/* eslint-disable camelcase */
import { beforeEach, expect, it, describe } from 'vitest';

import expression_case from '../data/mapbox/expression_case';
import expression_case_metadata from '../data/mapbox_metadata/expression_case';
import expression_get from '../data/mapbox/expression_get';
import expression_get_metadata from '../data/mapbox_metadata/expression_get';
import gs_expression_case from '../data/styles/gs_expression_case';
import gs_expression_property from '../data/styles/gs_expression_property';
import MapboxStyleParser from './MapboxStyleParser';
import expression_decisions_metadata from '../data/mapbox_metadata/expression_decisions';
import gs_expression_decisions from '../data/styles/gs_expression_decisions';
import gs_expression_math from '../data/styles/gs_expression_math';
import expression_math_metadata from '../data/mapbox_metadata/expression_math';
import gs_expression_string from '../data/styles/gs_expression_string';
import expression_string_metadata from '../data/mapbox_metadata/expression_string';
import expression_lookup_metadata from '../data/mapbox_metadata/expression_lookup';
import gs_expression_lookup from '../data/styles/gs_expression_lookup';
import gs_expression_interpolate from '../data/styles/gs_expression_interpolate';
import expression_interpolate from '../data/mapbox/expression_interpolate';
import expression_interpolate_metadata from '../data/mapbox_metadata/expression_interpolate';

describe('MapboxStyleParser can parse Expressions', () => {
  let styleParser: MapboxStyleParser;

  beforeEach(() => {
    styleParser = new MapboxStyleParser();
  });

  describe('#readStyle', () => {
    it('can read the "case" expression', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(expression_case);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(gs_expression_case);
      return;
    });
    it('can read the "decision" expressions', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(expression_decisions_metadata);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(gs_expression_decisions);
      return;
    });
    it('can read the "get" expression', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(expression_get);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(gs_expression_property);
      return;
    });
    it('can read the "lookup" expressions', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(expression_lookup_metadata);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(gs_expression_lookup);
      return;
    });
    it('can read the "math" expressions', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(expression_math_metadata);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(gs_expression_math);
      return;
    });
    it('can read the "string" expressions', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(expression_math_metadata);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(gs_expression_math);
      return;
    });

    it('can read the "interpolate" expressions', async () => {
      const { output: geostylerStyle } = await styleParser.readStyle(expression_interpolate);
      expect(geostylerStyle).toBeDefined();
      expect(geostylerStyle).toEqual(gs_expression_interpolate);
    });
  });

  describe('#writeStyle', () => {
    it('can write the "case" expression', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_case);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_case_metadata);
      return;
    });
    it('can write the "decision" expressions', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_decisions);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_decisions_metadata);
      return;
    });
    it('can write the "lookup" expressions', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_lookup);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_lookup_metadata);
      return;
    });
    it('can write the "math" expressions', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_math);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_math_metadata);
      return;
    });
    it('can write the "property" expression', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_property);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_get_metadata);
      return;
    });
    it('can write the "string" expression', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_string);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_string_metadata);
      return;
    });
    it('can write the "interpolate" expression', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(gs_expression_interpolate);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(expression_interpolate_metadata);
    });
  });
});
