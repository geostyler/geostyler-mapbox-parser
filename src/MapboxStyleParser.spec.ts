/* eslint-disable no-console */
import MapboxStyleParser from './MapboxStyleParser';

import line_simpleline from '../data/styles/line_simpleline';
import mb_line_simpleline from '../data/mapbox/line_simpleline';
import mb_line_simpleline_metadata from '../data/mapbox_metadata/line_simpleline';
import fill_simplefill from '../data/styles/fill_simplefill';
import mb_fill_simplefill from '../data/mapbox/fill_simplefill';
import mb_fill_simplefill_metadata from '../data/mapbox_metadata/fill_simplefill';
import fill_simplefill_outline from '../data/styles/fill_simple_outline';
import mb_fill_simplefill_outline_metadata from '../data/mapbox_metadata/fill_simple_outline';
import point_simpletext from '../data/styles/point_simpletext';
import mb_point_simpletext from '../data/mapbox/point_simpletext';
import mb_point_simpletext_metadata from '../data/mapbox_metadata/point_simpletext';
import point_placeholdertext from '../data/styles/point_placeholderText';
import mb_point_placeholdertext from '../data/mapbox/point_placeholderText';
// import mb_point_placeholdertext_metadata from '../data/mapbox_metadata/point_placeholderText';
import multi_simpleline_simplefill from '../data/styles/multi_simpleline_simplefill';
import mb_multi_simpleline_simplefill from '../data/mapbox/multi_simpleline_simplefill';
import mb_multi_simpleline_simplefill_metadata from '../data/mapbox_metadata/multi_simpleline_simplefill';
import multi_rule_line_fill from '../data/styles/multi_rule_line_fill';
// import mb_multi_rule_line_fill from '../data/mapbox/multi_rule_line_fill';
import mb_multi_rule_line_fill_metadata from '../data/mapbox_metadata/multi_rule_line_fill';
import line_simpleline_basefilter from '../data/styles/line_simpleline_basefilter';
import mb_line_simpleline_basefilter from '../data/mapbox/line_simpleline_basefilter';
import mb_line_simpleline_basefilter_metadata from '../data/mapbox_metadata/line_simpleline_basefilter';
// import line_simpleline_expression from '../data/styles/line_simpleline_expression';
// import mb_line_simpleline_expression from '../data/mapbox/line_simpleline_expression';
// import mb_line_simpleline_expression_metadata from '../data/mapbox_metadata/line_simpleline_expression';
import line_simpleline_zoom from '../data/styles/line_simpleline_zoom';
import mb_line_simpleline_zoom from '../data/mapbox/line_simpleline_zoom';
import mb_line_simpleline_zoom_metadata from '../data/mapbox_metadata/line_simpleline_zoom';
import icon_simpleicon from '../data/styles/icon_simpleicon';
import mb_icon_simpleicon from '../data/mapbox/icon_simpleicon';
import mb_icon_simpleicon_metadata from '../data/mapbox_metadata/icon_simpleicon';
import icon_simpleicon_mapboxapi from '../data/styles/icon_simpleicon_mapboxapi';
import mb_icon_simpleicon_mapboxapi from '../data/mapbox/icon_simpleicon_mapboxapi';
import mb_icon_simpleicon_mapboxapi_metadata from '../data/mapbox_metadata/icon_simpleicon_mapboxapi';
import circle_simplecircle from '../data/styles/circle_simplecircle';
import mb_circle_simplecircle from '../data/mapbox/circle_simplecircle';
import mb_circle_simplecircle_metadata from '../data/mapbox_metadata/circle_simplecircle';
import fill_patternfill from '../data/styles/fill_patternfill';
import mb_fill_patternfill from '../data/mapbox/fill_patternfill';
import mb_fill_patternfill_metadata from '../data/mapbox_metadata/fill_patternfill';
import line_patternline from '../data/styles/line_patternline';
import mb_line_patternline from '../data/mapbox/line_patternline';
import mb_line_patternline_metadata from '../data/mapbox_metadata/line_patternline';
import point_placeholdertext_simple from '../data/styles/point_placeholderText_simple';
import mb_point_placeholdertext_simple from '../data/mapbox/point_placeholderText_simple';
import mb_point_placeholdertext_simple_metadata from '../data/mapbox_metadata/point_placeholderText_simple';
import icontext_symbolizer_metadata from '../data/styles_metadata/icontext_symbolizer';
import mb_icontext_symbolizer from '../data/mapbox/icontext_symbolizer';
import mb_icontext_symbolizer_metadata from '../data/mapbox_metadata/icontext_symbolizer';
import source_mapping from '../data/styles/source_mapping';
import mb_source_mapping from '../data/mapbox/source_mapping';
import mb_source_mapping_metadata from '../data/mapbox_metadata/source_mapping';
import source_layer_mapping from '../data/styles/source_layer_mapping';
import mb_source_layer_mapping from '../data/mapbox/source_layer_mapping';
import mb_source_layer_mapping_metadata from '../data/mapbox_metadata/source_layer_mapping';
import { CustomLayerInterface } from 'mapbox-gl';
import { AnyLayer } from 'mapbox-gl';
import text_placement_line_center from '../data/styles/text_placement_line_center';
import mb_placement_line_center from '../data/mapbox/text_placement_line_center';
import mb_text_placement_line_center_metadata from '../data/mapbox_metadata/text_placement_line_center';
import mb_text_placement_line from '../data/mapbox/text_placement';
import text_placement_line from '../data/styles/text_placement_line';
import mb_text_placement_line_metadata from '../data/mapbox_metadata/text_placement_line';
import mb_text_placement_point from '../data/mapbox/text_placement_point';
import text_placement_point from '../data/styles/text_placement_point';
import mb_text_placement_point_metadata from '../data/mapbox_metadata/text_placement_point';
it('MapboxStyleParser is defined', () => {
  expect(MapboxStyleParser).toBeDefined();
});

describe('MapboxStyleParser implements StyleParser', () => {
  let styleParser: MapboxStyleParser;
  beforeEach(() => {
    styleParser = new MapboxStyleParser();
  });
  describe('#readStyle', () => {
    it('can read a mapbox Line style', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_line_simpleline);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_simpleline);
    });

    it('can read a mapbox Line style with fill pattern', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_line_patternline);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_patternline);
    });
    it('can read a mapbox text placement line value', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_text_placement_line);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(text_placement_line);
    });

    it('can read a mapbox text placement point value', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_text_placement_point);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(text_placement_point);
    });

    it('can read a mapbox text placement line center value', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_placement_line_center);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(text_placement_line_center);
    });

    it('can read a mapbox Fill style with outline', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_fill_simplefill_outline_metadata);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(fill_simplefill_outline);
    });

    it('can read a mapbox Fill style', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_fill_simplefill);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(fill_simplefill);
    });

    it('can read a mapbox Fill style with fill pattern', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_fill_patternfill);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(fill_patternfill);
    });

    it('can read a mapbox style with a basefilter', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_line_simpleline_basefilter);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_simpleline_basefilter);
    });

    // TODO: readd this test once the expressions do work
    // it('can read a mapbox style with an expression', async () => {
    //   expect.assertions(2);
    //   const { output: geoStylerStyle } = await styleParser.readStyle(mb_line_simpleline_expression);
    //   expect(geoStylerStyle).toBeDefined();
    //   expect(geoStylerStyle).toEqual(line_simpleline_expression);
    // });

    it('can read a mapbox style with min and max zoom', async () => {
      expect.assertions(3);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_line_simpleline_zoom);
      expect(geoStylerStyle).toBeDefined();
      const min = geoStylerStyle?.rules[0].scaleDenominator?.min;
      const max = geoStylerStyle?.rules[0].scaleDenominator?.max;
      const gotMin = line_simpleline_zoom.rules[0].scaleDenominator?.min as number;
      const gotMax = line_simpleline_zoom.rules[0].scaleDenominator?.max as number;
      expect(min).toBeCloseTo(gotMin, 4);
      expect(max).toBeCloseTo(gotMax, 4);
    });

    it('can write and read a mapbox style with min and max zoom', async () => {
      expect.assertions(3);
      const { output: mbStyle } = await styleParser.writeStyle(line_simpleline_zoom);
      const { output: geoStylerStyle } = await styleParser.readStyle(mbStyle!);
      expect(geoStylerStyle).toBeDefined();
      const min = geoStylerStyle?.rules[0].scaleDenominator?.min;
      const max = geoStylerStyle?.rules[0].scaleDenominator?.max;
      const gotMin = line_simpleline_zoom.rules[0].scaleDenominator?.min as number;
      const gotMax = line_simpleline_zoom.rules[0].scaleDenominator?.max as number;
      expect(min).toBeCloseTo(gotMin, 4);
      expect(max).toBeCloseTo(gotMax, 4);
    });

    it('can read a mapbox Text style', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_point_simpletext);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simpletext);
    });

    it('can read a mapbox Text style with placeholder Text', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_point_placeholdertext);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_placeholdertext);
    });

    it('can read a mapbox Text style with formatted Text', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_point_placeholdertext_simple);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_placeholdertext_simple);
    });

    it('can read a mapbox Circle style', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_circle_simplecircle);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(circle_simplecircle);
    });

    it('can read a mapbox style with multiple layers', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_multi_simpleline_simplefill);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(multi_simpleline_simplefill);
    });

    it('can read a mapbox style with an icon', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_icon_simpleicon);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(icon_simpleicon);
    });

    it('can read a mapbox style with an icon and resolves mapbox api', async () => {
      expect.assertions(2);
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_icon_simpleicon_mapboxapi);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(icon_simpleicon_mapboxapi);
    });

    it('can read a mapbox style with icontext symbolizer', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_icontext_symbolizer);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(icontext_symbolizer_metadata);
    });

    it('can keep track of a mapbox style sources', async () => {
      const { output: geoStylerStyle } = await styleParser.readStyle(mb_source_mapping);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(source_mapping);
    });

    it('can keep track of a mapbox style layer source', async () => {
      const { output: geostylerStyle } = await styleParser.readStyle(mb_source_layer_mapping);
      expect(geostylerStyle).toBeDefined();
      expect(geostylerStyle).toEqual(source_layer_mapping);
    });
  });

  describe('#writeStyle', () => {
    it('can write a mapbox Line style', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(line_simpleline);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_line_simpleline_metadata);
    });

    it('can write a mapbox Line style with fill pattern', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(line_patternline);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_line_patternline_metadata);
    });

    it('can write a mapbox Fill style', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(fill_simplefill);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_fill_simplefill_metadata);
    });

    it('can write a mapbox Fill style with fill pattern', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(fill_patternfill);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_fill_patternfill_metadata);
    });

    it('can write a mapbox Fill style with outline', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(fill_simplefill_outline);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_fill_simplefill_outline_metadata);
    });

    it('can write a mapbox Text style', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(point_simpletext);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_point_simpletext_metadata);
    });

    it('can write a mapbox Text style with a placeholder Text', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(point_placeholdertext_simple);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_point_placeholdertext_simple_metadata);
    });

    it('can write a mapbox Circle style', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(circle_simplecircle);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_circle_simplecircle_metadata);
    });

    it('can write a mapbox style with multiple symbolizers', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(multi_simpleline_simplefill);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_multi_simpleline_simplefill_metadata);
    });

    it('can write a mapbox style with multiple rules', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(multi_rule_line_fill);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_multi_rule_line_fill_metadata);
    });

    it('can write a mapbox text line placement', async() => {
      expect.assertions(2);
      const {output: mbStyle} = await styleParser.writeStyle(text_placement_line);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_text_placement_line_metadata);
    });
    it('can write a mapbox text line center placement', async() => {
      expect.assertions(2);
      const {output: mbStyle} = await styleParser.writeStyle(text_placement_line_center);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_text_placement_line_center_metadata);
    });
    it('can write a mapbox text point placement', async() => {
      expect.assertions(2);
      const {output: mbStyle} = await styleParser.writeStyle(text_placement_point);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_text_placement_point_metadata);
    });
    it('can write a mapbox style with a complex filter', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(line_simpleline_basefilter);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_line_simpleline_basefilter_metadata);
    });

    it('can write a mapbox style with min and max zoom', async () => {
      expect.assertions(3);
      const { output: mbStyle } = await styleParser.writeStyle(line_simpleline_zoom);
      expect(mbStyle).toBeDefined();
      const layer = mbStyle?.layers?.[0] as Exclude<AnyLayer, CustomLayerInterface>;
      const mbLayers = mb_line_simpleline_zoom_metadata.layers as (Exclude<AnyLayer, CustomLayerInterface>)[];
      expect(layer.minzoom).toBeCloseTo(mbLayers[0].minzoom!, 0);
      expect(layer.maxzoom).toBeCloseTo(mbLayers[0].maxzoom!, 0);
    });

    it('can write a mapbox style with an icon', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(icon_simpleicon);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_icon_simpleicon_metadata);
    });

    it('can write a mapbox style with an icon and resolves mapbox api', async () => {
      expect.assertions(2);
      const { output: mbStyle } = await styleParser.writeStyle(icon_simpleicon_mapboxapi);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_icon_simpleicon_mapboxapi_metadata);
    });

    it('can write a mapbox style with icontext symbolizer', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(icontext_symbolizer_metadata);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_icontext_symbolizer_metadata);
    });

    it('can properly resolve the source mapping', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(source_mapping);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_source_mapping_metadata);
    });

    it('can properly resolve the source layer mapping', async () => {
      const { output: mbStyle } = await styleParser.writeStyle(source_layer_mapping);
      expect(mbStyle).toBeDefined();
      expect(mbStyle).toEqual(mb_source_layer_mapping_metadata);
    });
  });
});
