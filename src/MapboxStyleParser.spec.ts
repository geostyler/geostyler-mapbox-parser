import MapboxStyleParser from './MapboxStyleParser';
import { Style } from 'geostyler-style';

import line_simpleline from '../data/styles/line_simpleline';
import mb_line_simpleline from '../data/mapbox/line_simpleline';
import fill_simplefill from '../data/styles/fill_simplefill';
import mb_fill_simplefill from '../data/mapbox/fill_simplefill';
import point_simpletext from '../data/styles/point_simpletext';
import mb_point_simpletext from '../data/mapbox/point_simpletext';
import point_placeholdertext from '../data/styles/point_placeholderText';
import mb_point_placeholdertext from '../data/mapbox/point_placeholderText';
import multi_simpleline_simplefill from '../data/styles/multi_simpleline_simplefill';
import mb_multi_simpleline_simplefill from '../data/mapbox/multi_simpleline_simplefill';
import multi_rule_line_fill from '../data/styles/multi_rule_line_fill';
import mb_multi_rule_line_fill from '../data/mapbox/multi_rule_line_fill';
import line_simpleline_basefilter from '../data/styles/line_simpleline_basefilter';
import mb_line_simpleline_basefilter from '../data/mapbox/line_simpleline_basefilter';
import line_simpleline_filter from '../data/styles/line_simpleline_filter';
import mb_line_simpleline_filter from '../data/mapbox/line_simpleline_filter';
import line_simpleline_zoom from '../data/styles/line_simpleline_zoom';
import mb_line_simpleline_zoom from '../data/mapbox/line_simpleline_zoom';
import icon_simpleicon from '../data/styles/icon_simpleicon';
import mb_icon_simpleicon from '../data/mapbox/icon_simpleicon';

it('MapboxStyleParser is defined', () => {
  expect(MapboxStyleParser).toBeDefined();
});

describe('MapboxStyleParser implements StyleParser', () => {
  let styleParser: MapboxStyleParser;

  beforeEach(() => {
    styleParser = new MapboxStyleParser();
  });

  describe('#readStyle', () => {
    it('can read a mapbox Line style', () => {
      expect.assertions(2);
      return styleParser.readStyle(mb_line_simpleline)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_simpleline);
        });
    });

    it('can read a mapbox style with a basefilter', () => {
      expect.assertions(2);
      return styleParser.readStyle(mb_line_simpleline_basefilter)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_simpleline_basefilter);
        });
    });

    it('can read a mapbox style with a filter', () => {
      expect.assertions(2);
      return styleParser.readStyle(mb_line_simpleline_filter)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_simpleline_filter);
        });
    });

    it('can read a mapbox style with min and max zoom', () => {
      expect.assertions(2);
      return styleParser.readStyle(mb_line_simpleline_zoom)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_simpleline_zoom);
        });
    });

    it('can read a mapbox Text style', () => {
      expect.assertions(2);
      return styleParser.readStyle(mb_point_simpletext)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simpletext);
        });
    });

    it('can read a mapbox Text style with placeholder Text', () => {
      expect.assertions(2);
      return styleParser.readStyle(mb_point_placeholdertext)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_placeholdertext);
        });
    });

    it('can read a mapbox style with multiple layers', () => {
      expect.assertions(2);
      return styleParser.readStyle(mb_multi_simpleline_simplefill)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(multi_simpleline_simplefill);
        });
    });

    it('can read a mapbox style with an icon', () => {
      expect.assertions(2);
      return styleParser.readStyle(mb_icon_simpleicon)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(icon_simpleicon);
        });
    });
  });

  describe('#writeStyle', () => {
    it('can write a mapbox Line style', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_simpleline)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_line_simpleline);
        });
    });

    it('can write a mapbox Fill style', () => {
      expect.assertions(2);
      return styleParser.writeStyle(fill_simplefill)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_fill_simplefill);
        });
    });

    it('can write a mapbox Text style', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simpletext)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_point_simpletext);
        });
    });

    it('can write a mapbox Text style with a placeholder Text', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_placeholdertext)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_point_placeholdertext);
        });
    });

    it('can write a mapbox style with multiple symbolizers', () => {
      expect.assertions(2);
      return styleParser.writeStyle(multi_simpleline_simplefill)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_multi_simpleline_simplefill);
        });
    });

    it('can write a mapbox style with multiple rules', () => {
      expect.assertions(2);
      return styleParser.writeStyle(multi_rule_line_fill)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_multi_rule_line_fill);
        });
    });

    it('can write a mapbox style with a complex filter', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_simpleline_basefilter)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_line_simpleline_basefilter);
        });
    });

    it('can write a mapbox style with min and max zoom', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_simpleline_zoom)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_line_simpleline_zoom);
        });
    });

    it('can write a mapbox style with an icon', () => {
      expect.assertions(2);
      return styleParser.writeStyle(icon_simpleicon)
        .then((mbStyle: any) => {
          expect(mbStyle).toBeDefined();
          expect(mbStyle).toEqual(mb_icon_simpleicon);
        });
    });
  });
});