/* eslint-disable id-blacklist */
import {
  PointSymbolizer,
  Rule,
  Style,
  StyleParser,
  Symbolizer,
  FillSymbolizer,
  LineSymbolizer,
  IconSymbolizer,
  TextSymbolizer,
  Filter,
  Operator,
  SymbolizerKind,
  MarkSymbolizer,
  ScaleDenominator,
  UnsupportedProperties,
  ReadStyleResult,
  isGeoStylerFunction,
  GeoStylerBooleanFunction,
  GeoStylerStringFunction,
  WriteStyleResult,
  isFillSymbolizer,
  isLineSymbolizer
} from 'geostyler-style';

import MapboxStyleUtil from './Util/MapboxStyleUtil';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import { get, set } from 'lodash';

type SymbolizerPath =`rules[${number}].symbolizers[${number}]`;
type LayerId = string;

type GeoStylerRef = {
  [path: SymbolizerPath]: LayerId[];
  ruleNames?: string[];
};

type MapboxLayerType = 'fill' | 'line' | 'symbol' | 'circle' | 'heatmap' |
    'fill-extrusion' | 'raster' | 'hillshade' | 'background';

type SymbolType = {
    textSymbolizer?: TextSymbolizer;
    iconSymbolizer?: IconSymbolizer;
};

type OptionsType = {
    ignoreConversionErrors?: boolean;
    pretty?: boolean;
};

export class MapboxStyleParser implements StyleParser {

  // looks like there's no way to access static properties from an instance
  // without a reference to the constructor function, so we have to duplicate
  // the title here
  public static title = 'Mapbox';

  private static readonly fillSymbolizerStrokeProperties: string[] = [
    'outlineOpacity',
    'outlineWidth',
    'outlineCap',
    'outlineJoin',
    'outlineDasharray'
  ];

  public title = 'Mapbox';
  /**
   * Object of unsupported properties.
   */
  unsupportedProperties: UnsupportedProperties = {
    Symbolizer: {
      FillSymbolizer: {
        fillOpacity: {
          support: 'none',
          info: 'Use opacity instead.'
        },
        outlineWidthUnit: 'none'
      },
      LineSymbolizer: {
        dashOffset: 'none',
        graphicStroke: 'none',
        gapWidthUnit: 'none',
        spacing: 'none',
        spacingUnit: 'none',
        widthUnit: 'none'
      },
      MarkSymbolizer: {
        support: 'partial',
        wellKnownName: {
          support: 'partial',
          info: 'Only circle symbolizers are supported for the moment.'
        },
        opacity: {
          support: 'none',
          info: 'General opacity is not supported. Use fillOpacity and strokeOpacity instead.'
        },
      },
      IconSymbolizer: {
        haloOpacity: 'none',
        haloWidthUnit: 'none',
        sizeUnit: 'none'
      },
      RasterSymbolizer: 'none',
      TextSymbolizer: {
        fontStyle: 'none',
        fontWeight: 'none',
        haloOpacity: 'none',
        haloWidthUnit: 'none',
        letterSpacingUnit: 'none',
        lineHeightUnit: 'none'
      }
    }
  };

  public ignoreConversionErrors: boolean = false;

  public pretty: boolean = false;

  private mbMetadata: any = {
    ruleNames: []
  };

  private spriteBaseUrl: string;

  constructor(options?: OptionsType) {
    if (options && options.ignoreConversionErrors) {
      this.ignoreConversionErrors = options.ignoreConversionErrors;
    }
    if (options?.pretty !== undefined) {
      this.pretty = options?.pretty;
    }
  }

  isSymbolType(s: Symbolizer|SymbolType): s is SymbolType {
    return (<SymbolType> s).iconSymbolizer ? true : (<SymbolType> s).textSymbolizer ? true : false;
  }

  /**
   * Parses the GeoStylerStyle-SymbolizerKind from a Mapbox Style Layer
   *
   * @param type A Mapbox Style Layer
   * @return A GeoStylerStyle-SymbolizerKind
   */
  getSymbolizerKindFromMapboxLayerType(type: string): SymbolizerKind|'Symbol'|'Circle' {
    switch (type) {
      case 'fill':
        return 'Fill';
      case 'line':
        return 'Line';
      case 'symbol':
        return 'Symbol';
      case 'circle':
        return 'Circle';
      default:
        if (this.ignoreConversionErrors) {
          return 'Circle';
        }
        throw new Error(`Could not parse mapbox style. Unsupported layer type.
                We support types 'fill', 'line', 'circle' and 'symbol' only.`);
    }
  }

  /**
   * Creates a GeoStylerStyle-TextSymbolizer label from a Mapbox Layer Paint Symbol text-field
   *
   * @param label A Mapbox Layer Paint Symbol text-field
   * @return A GeoStylerStyle-TextSymbolizer label
   */
  getLabelFromTextField(label: string | any[]): (string|undefined) {
    if (typeof label === 'undefined') {
      return;
    }
    if (typeof label === 'string') {
      return MapboxStyleUtil.resolveMbTextPlaceholder(label);
    }
    if (label[0] !== 'format' && !this.ignoreConversionErrors) {
      throw new Error('Cannot parse mapbox style. Unsupported text format.');
    }
    let gsLabel = '';
    // ignore all even indexes since we cannot handle them
    for (let i = 1; i < label.length; i = i + 2) {
      if (typeof label[i] === 'string') {
        gsLabel += label[i];
      } else {
        if (label[i][0] !== 'get' && !this.ignoreConversionErrors) {
          throw new Error('Cannot parse mapbox style. Unsupported lookup type.');
        }
        gsLabel += '{{' + label[i][1] + '}}';
      }
    }
    return gsLabel;
  }

  /**
   * Creates a GeoStylerStyle-MarkSymbolizer from a Mapbox Style Layer
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-MarkSymbolizer
   */
  getMarkSymbolizerFromMapboxLayer(paint: any, layout: any): MarkSymbolizer {
    // TODO: parse MarkSymbolizer
    return {
      kind: 'Mark',
      wellKnownName: 'circle'
    };
  }

  /**
   * Creates an image url based on the sprite baseurl and the sprite name.
   *
   * @param spriteName Name of the sprite
   * @return the url that returns the single image
   */
  getIconImage(spriteName: string): (string|undefined) {
    if (!spriteName) {
      return;
    }
    if (!this.spriteBaseUrl) {
      return;
    }
    // TODO update endpoint as soon as api specification was made
    let url: string = '/sprites/?';
    url += 'name=' + spriteName;
    url += '&baseurl=' + encodeURIComponent(this.spriteBaseUrl);
    return url;
  }

  /**
   * Creates a GeoStylerStyle-MarkSymbolizer with wellKnownName 'circle'
   * from a Mapbox Style Layer. This one will be handled explicitly
   * because mapbox has a dedicated layer type for circles. Other shapes are covered
   * in layer type 'symbol' using fonts.
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-MarkSymbolizer
   */
  getCircleSymbolizerFromMapboxLayer(paint: any, layout: any): MarkSymbolizer | undefined  {
    const symbolizer: MarkSymbolizer = {
      kind: 'Mark',
      blur: paint?.['circle-blur'],
      color: paint?.['circle-color'],
      offset: paint?.['circle-translate'],
      offsetAnchor: paint?.['circle-translate-anchor'],
      fillOpacity: paint?.['circle-opacity'],
      pitchAlignment: paint?.['circle-pitch-alignment'],
      pitchScale: paint?.['circle-pitch-scale'],
      radius: paint?.['circle-radius'],
      strokeColor: paint?.['circle-stroke-color'],
      strokeOpacity: paint?.['circle-stroke-opacity'],
      strokeWidth: paint?.['circle-stroke-width'],
      visibility: layout?.visibility,
      wellKnownName: 'circle'
    };

    if (MapboxStyleUtil.symbolizerAllUndefined(symbolizer)) {
      return undefined;
    }

    return symbolizer;
  }

  /**
   * Creates a GeoStylerStyle-IconSymbolizer from a Mapbox Style Layer
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-IconSymbolizer
   */
  getIconSymbolizerFromMapboxLayer(paint: any, layout: any): IconSymbolizer | undefined {
    const symbolizer: IconSymbolizer = {
      kind: 'Icon',
      allowOverlap: layout?.['icon-allow-overlap'],
      anchor: layout?.['icon-anchor'],
      avoidEdges: layout?.['symbol-avoid-edges'],
      color: paint?.['icon-color'],
      haloBlur: paint?.['icon-halo-blur'],
      haloColor: paint?.['icon-halo-color'],
      haloWidth: paint?.['icon-halo-width'],
      image: this.getIconImage(layout?.['icon-image']),
      keepUpright: layout?.['icon-keep-upright'],
      offset: layout?.['icon-offset'],
      offsetAnchor: paint?.['icon-translate-anchor'],
      opacity: paint?.['icon-opacity'],
      optional: layout?.['icon-optional'],
      padding: layout?.['icon-padding'],
      pitchAlignment: layout?.['icon-pitch-alignment'],
      rotate: layout?.['icon-rotate'],
      rotationAlignment: layout?.['icon-rotation-alignment'],
      size: layout?.['icon-size'],
      textFit: layout?.['icon-text-fit'],
      textFitPadding: layout?.['icon-text-fit-padding'],
      visibility: layout?.visibility
    };

    if (MapboxStyleUtil.symbolizerAllUndefined(symbolizer)) {
      return undefined;
    }

    return symbolizer;
  }

  /**
   * Creates a GeoStylerStyle-TextSymbolizer from a Mapbox Style Layer
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-TextSymbolizer
   */
  getTextSymbolizerFromMapboxLayer(paint: any, layout: any): TextSymbolizer | undefined {
    const symbolizer: TextSymbolizer = {
      kind: 'Text',
      allowOverlap: layout?.['text-allow-overlap'],
      anchor: layout?.['text-anchor'],
      avoidEdges: layout?.['symbol-avoid-edges'],
      color: paint?.['text-color'],
      font: layout?.['text-font'],
      haloBlur: paint?.['text-halo-blur'],
      haloColor: paint?.['text-halo-color'],
      haloWidth: paint?.['text-halo-width'],
      justify: layout?.['text-justify'],
      keepUpright: layout?.['text-keep-upright'],
      label: this.getLabelFromTextField(layout?.['text-field']),
      letterSpacing: layout?.['text-letter-spacing'],
      lineHeight: layout?.['text-line-height'],
      maxAngle: layout?.['text-max-angle'],
      maxWidth: layout?.['text-max-width'],
      offset: layout?.['text-offset'],
      offsetAnchor: paint?.['text-translate-anchor'],
      opacity: paint?.['text-opacity'],
      optional: layout?.['text-optional'],
      padding: layout?.['text-padding'],
      pitchAlignment: layout?.['text-pitch-alignment'],
      rotate: layout?.['text-rotate'],
      rotationAlignment: layout?.['text-rotation-alignment'],
      size: layout?.['text-size'],
      transform: layout?.['text-transform'],
      visibility: layout?.visibility,
    };

    if (MapboxStyleUtil.symbolizerAllUndefined(symbolizer)) {
      return undefined;
    }

    return symbolizer;
  }

  /**
   * Creates a GeoStylerStyle-FillSymbolizer from a Mapbox Style Layer.
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-FillSymbolizer
   */
  getFillSymbolizerFromMapboxLayer(paint: any, layout: any): FillSymbolizer {
    return {
      kind: 'Fill',
      visibility: layout?.visibility,
      antialias: paint?.['fill-antialias'],
      opacity: paint?.['fill-opacity'],
      color: paint?.['fill-color'],
      outlineColor: paint?.['fill-outline-color'],
      graphicFill: this.getPatternOrGradientFromMapboxLayer(paint?.['fill-pattern'])
    };
  }

  getPatternOrGradientFromMapboxLayer(icon: any): IconSymbolizer|undefined {
    if (Array.isArray(icon) && !this.ignoreConversionErrors) {
      throw new Error('Cannot parse pattern or gradient. No Mapbox expressions allowed');
    }
    if (!icon) {
      return;
    }
    return this.getIconSymbolizerFromMapboxLayer({}, {'icon-image': icon});
  }

  /**
   * Creates a GeoStylerStyle-LineSymbolizer from a Mapbox Style Layer
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-LineSymbolizer
   */
  getLineSymbolizerFromMapboxLayer(paint: any, layout: any): LineSymbolizer {
    return {
      kind: 'Line',
      visibility: layout?.visibility,
      cap: layout?.['line-cap'],
      join: layout?.['line-join'],
      miterLimit: layout?.['line-miter-limit'],
      roundLimit: layout?.['line-round-limit'],
      opacity: paint?.['line-opacity'],
      color: paint?.['line-color'],
      width: paint?.['line-width'],
      gapWidth: paint?.['line-gap-width'],
      perpendicularOffset: paint?.['line-offset'],
      blur: paint?.['line-blur'],
      dasharray: paint?.['line-dasharray'],
      gradient: paint?.['line-gradient'],
      graphicFill: this.getPatternOrGradientFromMapboxLayer(paint?.['line-pattern'])
    };
  }

  /**
   * Creates GeoStyler-Style TextSymbolizer and IconSymbolizer from
   * a mapbox layer paint object.
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   */
  getIconTextSymbolizersFromMapboxLayer(paint: any, layout: any): Symbolizer[] {
    const symbolizers = [
      this.getTextSymbolizerFromMapboxLayer(paint, layout),
      this.getIconSymbolizerFromMapboxLayer(paint, layout)
    ];

    return symbolizers.filter(symbolizer => !!symbolizer) as Symbolizer[];
  }

  /**
   * Creates a GeoStylerStyle-Symbolizer from a Mapbox Style Layer
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @param type A Mapbox LayerType
   * @return A GeoStylerStyle-Symbolizer
   */
  getSymbolizersFromMapboxLayer({paint, layout, type}: any): Symbolizer[] {
    let symbolizer: Symbolizer = {} as Symbolizer;
    const kind: SymbolizerKind | 'Symbol' | 'Circle' = this.getSymbolizerKindFromMapboxLayerType(type);

    switch (kind) {
      case 'Fill':
        symbolizer = this.getFillSymbolizerFromMapboxLayer(paint, layout);
        break;
      case 'Line':
        symbolizer = this.getLineSymbolizerFromMapboxLayer(paint, layout);
        break;
      case 'Symbol':
        return this.getIconTextSymbolizersFromMapboxLayer(paint, layout);
      case 'Circle':
        const sym = this.getCircleSymbolizerFromMapboxLayer(paint, layout);
        return sym ? [sym]: [];
      case 'Mark':
        symbolizer = this.getMarkSymbolizerFromMapboxLayer(paint, layout);
        break;
      default:
        if (this.ignoreConversionErrors) {
          return [];
        }
        throw new Error('Cannot parse mapbox style. Unsupported Symbolizer kind.');
    }
    return [symbolizer];
  }

  /**
   * Creates a GeoStylerStyle-Filter from a Mapbox Style Layer Filter
   *
   * @param filter A Mapbox Style Layer Filter
   * @return A GeoStylerStyle-Filter
   */
  getFilterFromMapboxFilter(filter: any[]): Filter | undefined {
    if (!filter) {
      return;
    }

    const operatorMapping = {
      all: true,
      any: true,
      '!': true
    };

    const operator: Operator = filter[0];
    let isNestedFilter: boolean = false;
    if (operatorMapping[operator]) {
      isNestedFilter = true;
    }
    if (isNestedFilter) {
      switch (filter[0]) {
        case 'all':
          filter[0] = '&&';
          break;
        case 'any':
          filter[0] = '||';
          break;
        default:
          break;
      }
      let restFilter = filter.slice(1);
      restFilter.forEach((f: Filter) => {
        this.getFilterFromMapboxFilter(f);
      });
    }
    return filter as Filter;
  }

  /**
   * Creates a GeoStylerStyle-ScaleDenominator from a Mapvox Style Layer Min/Max Zoom
   *
   * @param minZoom A Mapbox Style Layer minZoom property
   * @param maxZoom A Mapbox Style Layer maxZoom property
   * @return A GeoStylerStyle-ScaleDenominator
   */
  getScaleDenominatorFromMapboxZoom(minZoom?: number, maxZoom?: number): ScaleDenominator|undefined {
    let scaleDenominator: ScaleDenominator = {};
    if (typeof minZoom !== 'undefined') {
      scaleDenominator.max = MapboxStyleUtil.zoomToScale(minZoom);
    }
    if (typeof maxZoom !== 'undefined') {
      scaleDenominator.min = MapboxStyleUtil.zoomToScale(maxZoom);
    }
    if (typeof scaleDenominator.min === 'undefined' && typeof scaleDenominator.max === 'undefined') {
      return undefined;
    }
    return scaleDenominator;
  }

  /**
   * Merges the baseFilter and the attribute filter to a single filter.
   * If both filters are defined, they will be merged via '&&' operator.
   * If only one of the filters is defined, the defined filter will be returned.
   *
   * @param baseFilter The value of the mapbox layer's filter property
   * @param filter The value of the mapbox paint attribute filter
   */
  mergeFilters(baseFilter: Filter|undefined, filter: Filter|undefined): Filter|undefined {
    let gsBaseFilter: Filter|undefined = undefined;
    let gsFilter: Filter|undefined = undefined;
    if (baseFilter && filter) {
      gsBaseFilter = this.getFilterFromMapboxFilter(baseFilter) as Filter;
      gsFilter = this.getFilterFromMapboxFilter(filter) as Filter;
      return [
        '&&',
        gsBaseFilter,
        gsFilter
      ];
    }
    if (filter) {
      gsFilter = this.getFilterFromMapboxFilter(filter);
      return gsFilter;
    }
    if (baseFilter) {
      gsBaseFilter = this.getFilterFromMapboxFilter(baseFilter);
      return gsBaseFilter;
    }
    return undefined;
  }

  /**
   * Compares an arbitrary number of filters for equality
   *
   * @param filters Array of mapbox filters
   */
  equalMapboxAttributeFilters(filters: any[]): boolean {
    // convert filters to strings
    const filterStrings: string[][] = [];
    let equal: boolean = true;
    for (let i = 0; i < filters.length; i++) {
      const filterString: string[] = [];
      filters[i].forEach((exp: any, index: number, f: any) => {
        if (index % 2 === 1 && index !== f.length - 1) {
          filterString.push(JSON.stringify(exp));
        }
      });
      filterStrings.forEach((filter: any) => {
        if (!_isEqual(filterString, filter)) {
          equal = false;
        }
      });
      if (equal) {
        filterStrings.push(filterString);
      } else {
        break;
      }
    }
    return equal;
  }

  /**
   * Creates valid GeoStyler-Style Symbolizers from possibly invalid Symbolizers.
   * Symbolizers are invalid if at least one of their attributes' values is a mapbox filter expression.
   * This function detects such expressions and creates a symbolizer for each possible outcome.
   * Related property values will be set accordingly. Thus, creating valid Symbolizers.
   *
   * IMPORTANT: Currently only the 'case' filter expression is supported. Furthermore, handling of multiple properties
   * with filter expressions is only supported if all filter expressions are equal. Otherwise errors will be thrown.
   *
   * @param tmpSymbolizer A possibly invalid GeoStyler-Style Symbolizer
   * @return Array of valid Symbolizers and optional mapbox filters
   */
  mapboxAttributeFiltersToSymbolizer(tmpSymbolizer: Symbolizer): {filter?: Filter; symbolizers: Symbolizer[]}[] {
    const pseudoRules: {filter?: Filter; symbolizers: Symbolizer[] }[] = [];
    const props = Object.keys(tmpSymbolizer);
    const filterProps: string[] = [];
    const filters: any[] = [];
    props.forEach((prop: string) => {
      if (typeof prop === 'undefined') {
        return;
      }
      if (!Array.isArray(tmpSymbolizer[prop])) {
        return;
      }
      if (typeof tmpSymbolizer[prop][0] !== 'string') {
        return;
      }
      if (prop === 'font' && !(tmpSymbolizer[prop].some((x: any) => typeof x !== 'string'))) {
        return;
      }
      // is expression
      // switch (tmpSymbolizer[prop][0]) {
      //     case 'case':
      //         break;
      //     case 'match':
      //         break;
      //     default:
      //         throw new Error(`Unsupported expression.
      // Only expressions of type 'case' and 'match' are allowed.`);
      // }
      if (tmpSymbolizer[prop][0] !== 'case' && !this.ignoreConversionErrors) {
        throw new Error('Unsupported expression. Only expressions of type \'case\' are allowed.');
      }
      filterProps.push(prop);
      filters.push(tmpSymbolizer[prop]);
    });

    if (filters.length > 0) {
      const equalFilters: boolean = this.equalMapboxAttributeFilters(filters);
      if (!equalFilters && !this.ignoreConversionErrors) {
        throw new Error('Cannot parse attributes. Filters do not match');
      }
      // iterate over each value in a single filter
      // we can use filters[0] as we checked beforehand if all filters are equal.
      filters[0].forEach((filter: any, index: number) => {
        // ignore all even indexes as we are not interested in the values at this point
        if (index % 2 !== 1) {
          return;
        }
        // make a deep clone to avoid call-by-reference issues
        let symbolizer: Symbolizer = _cloneDeep(tmpSymbolizer);
        let values: any[] = [];
        // iterate over each filter and push the corresponding value of the current filter expression
        filters.forEach((f: any) => {
          values.push(f[index + 1]);
        });
        // set the value of the corresponding symbolizer property to value of current filter expression
        values.forEach((val: any, i: number) => {
          const p = filterProps[i];
          symbolizer[p] = val;
        });
        // push the created symbolizers and the corresponding filter expression.
        // Results in an object containing a single Filter expression (in mapbox expression format)
        // and the corresponding symbolizers only containing values.
        // Number of symbolizers corresponds to the number of outcomes of a filter expression.
        pseudoRules.push({
          symbolizers: [symbolizer],
          filter: filter
        });
      });
    } else {
      pseudoRules.push({
        symbolizers: [tmpSymbolizer]
      });
    }
    return pseudoRules;
  }

  // /**
  //  * Creates GeoStyler-Style Rules from a mapbox paint object.
  //  *
  //  * @param paint A mapbox layer paint object
  //  * @param type The type of the mapbox layer
  //  * @return Array of GeoStyler-Style Rules
  //  */
  // mapboxPaintToGeoStylerRules(paint: any, layout: any, type: string): Rule[] {
  //   const rules: Omit<Rule, 'name'>[] = [];
  //   const tmpSymbolizer: Symbolizer|SymbolType|undefined = this.getSymbolizerFromMapboxLayer(paint, layout, type);
  //   if (tmpSymbolizer === undefined) {
  //     return rules;
  //   }
  //   const pseudoRules: any[] = [];
  //   if (this.isSymbolType(tmpSymbolizer)) {
  //     // Concatenates all pseudorules.
  //     if (tmpSymbolizer.hasOwnProperty('iconSymbolizer')) {
  //       // check if all properties except 'kind' are undefined. If so, skip
  //       if (!MapboxStyleUtil.symbolizerAllUndefined(tmpSymbolizer.iconSymbolizer as Symbolizer)) {
  //         pseudoRules.push(
  //           ...this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer.iconSymbolizer as Symbolizer)
  //         );
  //       }
  //     }
  //     if (tmpSymbolizer.hasOwnProperty('textSymbolizer')) {
  //       // check if all properties except 'kind' are undefined. If so, skip
  //       if (!MapboxStyleUtil.symbolizerAllUndefined(tmpSymbolizer.textSymbolizer as Symbolizer)) {
  //         pseudoRules.push(
  //           ...this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer.textSymbolizer as Symbolizer)
  //         );
  //       }
  //     }
  //   } else {
  //     pseudoRules.push(...this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer as Symbolizer));
  //   }
  //   pseudoRules.forEach((rule: any) => {
  //     const {
  //       filter,
  //       symbolizers
  //     } = rule;
  //     rules.push({
  //       filter,
  //       symbolizers
  //     });
  //   });

  //   return rules;
  // };

  /**
   *
   * @param s1
   * @param s2
   * @returns
   */
  mergeSymbolizers(s1: Symbolizer, s2: Symbolizer): Symbolizer {
    let merged = Object.assign({}, s1,s2);
    if (s1.kind !== s2.kind) {
      const s1IsFill = isFillSymbolizer(s1);
      const s2IsFill = isFillSymbolizer(s2);
      if (s1IsFill || s2IsFill) {
        const s1IsLine = isLineSymbolizer(s1);
        const fillSymbolizer: FillSymbolizer = s1IsFill ? s1 : s2 as FillSymbolizer;
        const lineSymbolizer: LineSymbolizer = s1IsLine ? s1 : s2 as LineSymbolizer;
        merged = fillSymbolizer;
        merged.outlineColor = lineSymbolizer.color;
        merged.outlineOpacity = lineSymbolizer.opacity;
        merged.outlineCap = lineSymbolizer.cap;
        merged.outlineJoin = lineSymbolizer.join;
        merged.outlineWidth = lineSymbolizer.width;
      } else {
        throw new Error(`Trying to merge to symbolizers of differnt kinds: ${s1.kind}, ${s2.kind}`);
      }
    }
    return merged;
  };

  /**
   * Creates a GeoStyler-Style Rule from a mapbox layer.
   *
   * @param layer The mapbox Layer
   * @return A GeoStyler-Style Rule Array
   */
  mapboxLayersToGeoStylerRules(layers: any[]): Rule[] {
    const geoStylerRef: GeoStylerRef = this.mbMetadata?.geoStylerRef;
    const tempStyle: Partial<Style> = {
      rules: []
    };

    // convenience functions to get the corresponding
    // path for the lodash get function
    const ruleLevel = (key: string) => key.split('.')[0];
    const symbolizersLevel = (key: string) => key.split('symbolizers')[0] + 'symbolizers';
    const index = (key: string) => key.split('[')[1].split(']')[0];

    // returns array of rules where one rule contains one symbolizer
    layers.forEach((layer: any) => {
      const symbolizers = this.getSymbolizersFromMapboxLayer(layer);
      if (symbolizers.length < 1) {
        return;
      }

      // if the mapboxstyle has a metadata object with geoStylerRef we have to
      // follow it to construct the rules and symbolizers
      if (geoStylerRef) {
        // iterate over the symbolizerPathes
        for (const [key, value] of Object.entries(geoStylerRef)) {
          if (key !== 'ruleNames') {
            // …if the id of the layer is associated to this symbolizer
            if ((value as string[]).includes(layer.id)) {
              const matchingRule = get(tempStyle, ruleLevel(key));
              // …if there exists a rule in the temporaryStyle
              if (matchingRule) {
                const matchingSymbolizer = get(tempStyle, key);
                // …if there is an existing symbolizer with this id we have to merge them
                if (matchingSymbolizer) {
                  const mergedSymbolizer = symbolizers.reduce((prev, current) => {
                    return this.mergeSymbolizers(prev, current);
                  }, matchingSymbolizer);
                  set(tempStyle, key, mergedSymbolizer);
                } else {
                  // …we can just set symbolizers on this rule
                  set(tempStyle, symbolizersLevel(key), symbolizers);
                }
              // … if there is no matching rule in the temporaryStyle we have to create
              // a new one
              } else {
                const filter = this.getFilterFromMapboxFilter(layer.filter);
                const name = geoStylerRef?.ruleNames?.[index(key)];
                const scaleDenominator = this.getScaleDenominatorFromMapboxZoom(
                  layer.minzoom,
                  layer.maxzoom,
                );
                const newRule: Omit<Rule, 'symbolizers'> = {
                  filter,
                  name,
                  scaleDenominator
                };
                set(tempStyle, ruleLevel(key), newRule);
                set(tempStyle, symbolizersLevel(key), symbolizers);
              }
            }
          }
        }
      // if there is no metadat.geoStylerRef object in the mapbox style we create
      // a new rule for every layer
      } else {
        const filter = this.getFilterFromMapboxFilter(layer.filter);
        const scaleDenominator = this.getScaleDenominatorFromMapboxZoom(
          layer.minzoom,
          layer.maxzoom,
        );
        const rule = {
          filter,
          name: layer.id,
          scaleDenominator,
          symbolizers
        };
        tempStyle.rules?.push(rule);
      }
    });

    return tempStyle.rules || [];
  }

  /**
   * Creates a GeoStylerStyle-Style from a Mapbox Style
   *
   * @param mapboxStyle The Mapbox Style object
   * @return A GeoStylerStyle-Style
   */
  mapboxLayerToGeoStylerStyle(mapboxStyle: any): Style {
    if (!(mapboxStyle instanceof Object)) {
      mapboxStyle = JSON.parse(mapboxStyle);
    }
    let style: Style = {} as Style;
    style.name = mapboxStyle.name;
    style.rules = [];
    this.mbMetadata = mapboxStyle.metadata;
    if (mapboxStyle.sprite) {
      this.spriteBaseUrl = MapboxStyleUtil.getUrlForMbPlaceholder(mapboxStyle.sprite);
    }

    if (mapboxStyle.layers) {
      const rules = this.mapboxLayersToGeoStylerRules(mapboxStyle.layers);
      style.rules = style.rules.concat(rules);

    }
    return style;
  }

  /**
   * The readStyle implementation of the GeoStyler-Style StylerParser interface.
   * It reads a Mapbox Style and returns a Promise resolving with a GeoStylerStyle-ReadStyleResult.
   *
   * @param mapboxStyle The Mapbox Style object
   * @return The Promise resolving with a GeoStylerStyle-ReadStyleResult
   */
  readStyle(mapboxStyle: any): Promise<ReadStyleResult> {
    return new Promise<ReadStyleResult>(resolve => {
      try {
        const mbStyle = _cloneDeep(mapboxStyle);
        const geoStylerStyle: Style = this.mapboxLayerToGeoStylerStyle(mbStyle);
        resolve({
          output: geoStylerStyle
        });
      } catch (e) {
        resolve({
          errors: [e]
        });
      }
    });
  }

  /**
   * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a GeoStyler-Style Style and returns a Promise.
   *
   * @param geoStylerStyle A GeoStylerStyle-Style
   * @return The Promise resolving with a GeoStylerStyle-WriteStyleResult
   */
  writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<string>> {
    return new Promise<WriteStyleResult<string>>(resolve => {
      const unsupportedProperties = this.checkForUnsupportedProperties(geoStylerStyle);
      try {
        const gsStyle = _cloneDeep(geoStylerStyle);
        const mapboxStyle: any = this.geoStylerStyleToMapboxObject(gsStyle);
        const output = this.pretty
          ? JSON.stringify(mapboxStyle, null, 2)
          : JSON.stringify(mapboxStyle);
        resolve({
          output,
          unsupportedProperties,
          warnings: unsupportedProperties && ['Your style contains unsupportedProperties!']
        });
      } catch (e) {
        resolve({
          errors: [e]
        });
      }
    });
  }

  /**
   * Write a Mapbox Style Object based on a GeoStylerStyle.
   *
   * @param geoStylerStyle A GeoStylerStyle-Style
   * @return A Mapbox Style object
   */
  geoStylerStyleToMapboxObject(geoStylerStyle: Style): any {
    // Mapbox Style version
    const version = 8;
    const name = geoStylerStyle.name;
    const {layers, geoStylerRef} = this.getMapboxLayersFromRules(geoStylerStyle.rules);
    const sprite = MapboxStyleUtil.getMbPlaceholderForUrl(this.spriteBaseUrl);

    let mapboxObject: any = {
      version,
      name,
      layers,
      sprite,
    };

    if (geoStylerRef){
      mapboxObject = {
        ...mapboxObject,
        metadata: {
          geoStylerRef
        }
      };
    }

    return mapboxObject;
  }

  /**
   * Creates a layer for each Rule and each Symbolizer.
   *
   * @param rules An array of GeoStylerStyle-Rules
   * @return An array of Mapbox Layers
   */
  getMapboxLayersFromRules(rules: Rule[]): any {
    // one layer corresponds to a single symbolizer within a rule
    // so filters and scaleDenominators have to be set for each symbolizer explicitly
    const layers: any[] = [];
    const geoStylerRef: any = {
      ruleNames: []
    };

    rules.forEach((rule: Rule, ruleIndex: number) => {
      // create new layer object
      let layer: any = {};

      // set filters and scaleDenominator
      if (rule.filter && rule.filter.length !== 0) {
        const filterClone = _cloneDeep(rule.filter);
        layer.filter = this.getMapboxFilterFromFilter(filterClone);
      }

      if (rule.scaleDenominator) {
        // calculate zoomLevel from scaleDenominator
        if (typeof rule.scaleDenominator.min !== 'undefined') {
          if (!isGeoStylerFunction(rule.scaleDenominator.min)) {
            layer.maxzoom = this.getMapboxZoomFromScaleDenominator(rule.scaleDenominator.min);
          }
        }
        if (typeof rule.scaleDenominator.max !== 'undefined') {
          if (!isGeoStylerFunction(rule.scaleDenominator.max)) {
            layer.minzoom = this.getMapboxZoomFromScaleDenominator(rule.scaleDenominator.max);
          }
        }
      }

      rule.symbolizers.forEach((symbolizer: Symbolizer, symbolizerIndex: number) => {
        const symbolizerPath: SymbolizerPath = `rules[${ruleIndex}].symbolizers[${symbolizerIndex}]`;
        geoStylerRef.ruleNames.push(rule.name);

        // use existing layer properties
        let lyr: any = {};
        lyr.filter = layer.filter;
        lyr.minzoom = layer.minzoom;
        lyr.maxzoom = layer.maxzoom;
        // get symbolizer type and paint

        const styles = this.getStyleFromSymbolizer(symbolizer);

        styles.forEach((style: any, styleIndex: number) => {
          const {
            type, paint, layout
          } = style;

          let lyrClone = _cloneDeep(lyr);

          lyrClone.type = type;
          lyrClone.paint = !MapboxStyleUtil.allUndefined(paint) ? paint : undefined;
          lyrClone.layout = !MapboxStyleUtil.allUndefined(layout) ? layout : undefined;
          layers.push(lyrClone);
          lyrClone.id = `r${ruleIndex}_sy${symbolizerIndex}_st${styleIndex}`;
          if (!Array.isArray(geoStylerRef[symbolizerPath])) {
            geoStylerRef[symbolizerPath] = [];
          }
          geoStylerRef[symbolizerPath].push(lyrClone.id);
        });
      });
    });

    return {layers, geoStylerRef};
  }

  /**
   * Get the mapbox zoomlevel from a scaleDenominator.
   * Interpolates the zoomlevel if calculated resolutions do not match.
   *
   * @param scaleDenominator The scaleDenominator of the GeoStyler-Style Rule
   * @return number The corresponding zoom level
   */
  getMapboxZoomFromScaleDenominator(scaleDenominator: number): number {
    // transform scaledenom to resolution
    const resolution: number = MapboxStyleUtil.getResolutionForScale(scaleDenominator);
    let pre: number|undefined = undefined;
    let post: number|undefined = undefined;
    let zoom: number;
    const resolutions = MapboxStyleUtil.getResolutions();
    zoom = resolutions.indexOf(resolution);
    if (zoom === -1) {
      zoom = MapboxStyleUtil.getZoomForResolution(resolution);
    }

    if (typeof pre !== 'undefined' && typeof post !== 'undefined') {
      // interpolate between zoomlevels
      const preVal = resolutions[pre];
      const postVal = resolutions[post];
      const range = preVal - postVal;
      const diff = resolution - postVal;
      const percentage = 1 - (diff / range);
      if (percentage === 0) {
        return pre;
      }
      zoom = pre + percentage;
    }

    return zoom!;
  }

  /**
   * Writes a Mapbox-filter from a GeoStylerStyle-Filter
   *
   * @param filter A GeoStylerStyle-Filter
   * @return A Mapbox filter array
   */
  getMapboxFilterFromFilter(filter: Filter): any[] {
    let mbFilter = [...filter];
    const nestingOperators = ['&&', '||', '!'];
    const operator: Operator = mbFilter[0] as Operator;
    let isNestedFilter = nestingOperators.includes(operator);

    if (isNestedFilter) {
      switch (operator) {
        case '&&':
          mbFilter[0] = 'all';
          break;
        case '||':
          mbFilter[0] = 'any';
          break;
        default:
          break;
      }

      mbFilter = mbFilter.map((f: Filter, index) => {
        if (index > 1) {
          return this.getMapboxFilterFromFilter(f);
        } else {
          return f as any;
        }
      });
    }

    return mbFilter;
  }

  /**
   * Creates a Mapbox Layer Paint object and the layerType from a GeoStylerStyle-Symbolizer
   *
   * @param symbolizer A GeoStylerStyle-Symbolizer
   * @return [{layerType, paint, layout}] A list of objects consisting of the MapboxLayerType,
   *    the Mapbox Layer Paint and Layout
   */
  getStyleFromSymbolizer(symbolizer: Symbolizer): { type: MapboxLayerType; paint: any; layout: any }[]  {
    const symbolizerClone = _cloneDeep(symbolizer);
    let type: MapboxLayerType;
    let paint: any;
    let layout: any;

    let fillSplitStyles = [];

    switch (symbolizer.kind) {
      case 'Fill':
        type = 'fill';

        const intersection = MapboxStyleParser.fillSymbolizerStrokeProperties
          .filter(prop => Object.keys(symbolizer).includes(prop));

        // fill symbolizer contains stroke properties, so the symbolizer will be split into 2 symbolizers fill and line
        let needSplit = intersection.length > 0;
        if (needSplit) {
          fillSplitStyles = this.getSplitStyleFromFillSymbolizer(symbolizer as FillSymbolizer);
        } else {
          paint = this.getPaintFromFillSymbolizer(symbolizerClone as FillSymbolizer);
          layout = this.getLayoutFromFillSymbolizer(symbolizerClone as FillSymbolizer);
        }
        break;
      case 'Line':
        type = 'line';
        paint = this.getPaintFromLineSymbolizer(symbolizerClone as LineSymbolizer);
        layout = this.getLayoutFromLineSymbolizer(symbolizerClone as LineSymbolizer);
        break;
      case 'Icon':
        type = 'symbol';
        paint = this.getPaintFromIconSymbolizer(symbolizerClone as IconSymbolizer);
        layout = this.getLayoutFromIconSymbolizer(symbolizerClone as IconSymbolizer);
        break;
      case 'Text':
        type = 'symbol';
        paint = this.getPaintFromTextSymbolizer(symbolizerClone as TextSymbolizer);
        layout = this.getLayoutFromTextSymbolizer(symbolizerClone as TextSymbolizer);
        break;
      case 'Mark':
        if (symbolizer.wellKnownName === 'circle') {
          type = 'circle';
          paint = this.getPaintFromCircleSymbolizer(symbolizerClone as MarkSymbolizer);
          layout = this.getLayoutFromCircleSymbolizer(symbolizerClone as MarkSymbolizer);
          break;
        } else if (!this.ignoreConversionErrors) {
          throw new Error('Cannot get Style. Unsupported MarkSymbolizer');
        } else {
          type = 'symbol';
        }
        break;
        // TODO check if mapbox can generate regular shapes
      default:
        if (!this.ignoreConversionErrors) {
          throw new Error('Cannot get Style. Unsupported kind.');
        } else {
          type = 'symbol';
        }
    }

    if (fillSplitStyles.length > 0) {
      return fillSplitStyles;
    }

    return [{
      type,
      paint,
      layout
    }];
  }

  /**
   * Splits a fill symbolizer having outline properties into a fill and line styles
   *
   * @param symbolizer
   * @returns
   */
  getSplitStyleFromFillSymbolizer(symbolizer: FillSymbolizer): any[] {
    let symbolizerClone: FillSymbolizer = _cloneDeep(symbolizer);
    delete symbolizerClone?.outlineColor;

    const fillPaint = this.getPaintFromFillSymbolizer(symbolizerClone as FillSymbolizer);
    const fillStyle = {
      type: 'fill',
      paint : fillPaint,
      layout : this.getLayoutFromFillSymbolizer(symbolizerClone as FillSymbolizer)
    };

    symbolizerClone = _cloneDeep(symbolizer as FillSymbolizer);
    const lineSymbolizer: LineSymbolizer = {
      kind: 'Line',
      color: symbolizerClone?.outlineColor,
      opacity: symbolizerClone?.outlineOpacity,
      width: symbolizerClone?.outlineWidth,
      join: symbolizerClone?.outlineJoin,
      cap: symbolizerClone?.outlineCap,
    };

    const outlineStyle = {
      type: 'line',
      paint: this.getPaintFromLineSymbolizer(lineSymbolizer),
      layout: this.getLayoutFromLineSymbolizer(lineSymbolizer)
    };

    return [fillStyle, outlineStyle];
  }

  /**
   * Creates a Mapbox Layer Paint object from a GeostylerStyle-FillSymbolizer
   *
   * @param symbolizer A GeostylerStyle-FillSymbolizer
   * @return A Mapbox Layer Paint object
   */
  getPaintFromFillSymbolizer(symbolizer: FillSymbolizer): any {
    const {
      opacity,
      color,
      outlineColor,
      graphicFill,
      antialias
    } = symbolizer;

    const paint: any = {
      'fill-antialias': antialias,
      'fill-opacity': opacity,
      'fill-color': color,
      'fill-outline-color': outlineColor,
      'fill-pattern': this.getPatternOrGradientFromPointSymbolizer(graphicFill)
    };
    return paint;
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeostylerStyle-FillSymbolizer
   *
   * @param symbolizer A GeostylerStyle-FillSymbolizer
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromFillSymbolizer(symbolizer: FillSymbolizer): any {
    const {
      visibility
    } = symbolizer;

    const layout: any = {
      visibility: this.getVisibility(visibility)
    };
    return layout;
  }

  /**
   * Creates a fill pattern or gradient from a GeoStylerStyle-Symbolizer
   *
   * @param symbolizer The Symbolizer that is being used for pattern or gradient
   * @return The name of the sprite or undefined, if no image source was specified
   */
  getPatternOrGradientFromPointSymbolizer(symbolizer: (PointSymbolizer | undefined)): (string | undefined) {
    if (!symbolizer) {
      return undefined;
    }
    if (symbolizer.kind !== 'Icon') {
      if (this.ignoreConversionErrors) {
        return;
      }
      throw new Error('Cannot parse pattern or gradient. Mapbox only supports Icons.');
    }
    if (!symbolizer.image) {
      return undefined;
    }
    const sprite = this.handleSprite(symbolizer.image);
    return sprite;
  }

  /**
   * Adds a sprite to the Mapbox Style object
   *
   * @param {string} path The source of an image
   * @return {string} The name of the sprite
   */
  handleSprite(path: string | GeoStylerStringFunction): (string|undefined) {
    if (isGeoStylerFunction(path)) {
      return;
    }

    let spritename: string = '';
    let baseurl: string = '';
    const query = path.split('?')[1];
    if (query.length === 0) {
      return;
    }

    const params = query.split('&');
    params.forEach((param: string) => {
      const [key, value] = param.split('=');
      if (key === 'name') {
        spritename = value;
      } else if (key === 'baseurl') {
        baseurl = decodeURIComponent(value);
      }
    });

    this.spriteBaseUrl = baseurl;
    return spritename;
  }

  /**
   * Transforms the visibility attribute of a GeoStylerStyle-Symbolizer to a Mapbox visibility attribute
   *
   * @param {boolean|undefined} visibility The visibility of a layer
   * @return {'none'|'visible'|undefined} The Mapbox visibility attribute. If undefined Mapbox's default will be used
   */
  getVisibility(visibility: boolean | GeoStylerBooleanFunction | undefined): 'none' | 'visible' | undefined {
    if (visibility === true) {
      return 'visible';
    } else if (visibility === false) {
      return 'none';
    } else {
      return undefined;
    }
  }

  /**
   * Creates a Mapbox Layer Paint object from a GeoStylerStyle-LineSymbolizer
   *
   * @param symbolizer A GeoStylerStyle-LineSymbolizer
   * @return A Mapbox Layer Paint object
   */
  getPaintFromLineSymbolizer(symbolizer: LineSymbolizer): any {
    const {
      opacity,
      color,
      perpendicularOffset,
      width,
      blur,
      dasharray,
      graphicFill,
      gapWidth,
      gradient
    } = symbolizer;

    const paint: any = {
      'line-opacity': opacity,
      'line-color': color,
      'line-width': width,
      'line-gap-width': gapWidth,
      'line-offset': perpendicularOffset,
      'line-blur': blur,
      'line-dasharray': dasharray,
      'line-pattern': this.getPatternOrGradientFromPointSymbolizer(graphicFill),
      'line-gradient': gradient
    };
    return paint;
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeoStylerStyle-LineSymbolizer
   *
   * @param symbolizer A GeoStylerStyle-LineSymbolizer
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromLineSymbolizer(symbolizer: LineSymbolizer): any {
    const {
      cap,
      join,
      miterLimit,
      roundLimit,
      visibility,
    } = symbolizer;

    const layout = {
      'line-cap': cap,
      'line-join': join,
      'line-miter-limit': miterLimit,
      'line-round-limit': roundLimit,
      visibility: this.getVisibility(visibility)
    };
    return layout;
  }

  /**
   * Creates a Mapbox Layer Paint object from a GeoStylerStyle-IconSymbolizer
   *
   * @param symbolizer A GeoStylerStyle-IconSymbolizer
   * @return A Mapbox Layer Paint object
   */
  getPaintFromIconSymbolizer(symbolizer: IconSymbolizer): any {
    const {
      haloBlur,
      haloColor,
      haloWidth,
      color,
      opacity,
    } = symbolizer;

    const paint: any = {
      'icon-opacity': opacity,
      'icon-color': color,
      'icon-halo-color': haloColor,
      'icon-halo-width': haloWidth,
      'icon-halo-blur': haloBlur
    };
    return paint;
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeoStylerStyle-IconSymbolizer
   *
   * @param symbolizer A GeoStylerStyle-IconSymbolizer
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromIconSymbolizer(symbolizer: IconSymbolizer): any {
    const {
      avoidEdges,
      allowOverlap,
      optional,
      rotationAlignment,
      size,
      textFit,
      textFitPadding,
      image,
      rotate,
      padding,
      keepUpright,
      offset,
      anchor,
      pitchAlignment,
      visibility
    } = symbolizer;

    const layout = {
      'symbol-avoid-edges': avoidEdges,
      'icon-allow-overlap': allowOverlap,
      'icon-optional': optional,
      'icon-rotation-alignment': rotationAlignment,
      'icon-size': size,
      'icon-text-fit': textFit,
      'icon-text-fit-padding': textFitPadding,
      'icon-image': image ? this.handleSprite(image) : undefined,
      'icon-rotate': rotate,
      'icon-padding': padding,
      'icon-keep-upright': keepUpright,
      'icon-offset': offset,
      'icon-anchor': anchor,
      'icon-pitch-alignment': pitchAlignment,
      visibility: this.getVisibility(visibility)
    };
    return layout;
  }

  /**
   * Creates a Mapbox Layer Paint object from a GeoStylerStyle-TextSymbolizer
   *
   * @param symbolizer A GeoStylerStyle TextSymbolizer
   * @return A Mapbox Layer Paint object
   */
  getPaintFromTextSymbolizer(symbolizer: TextSymbolizer): any {
    const {
      haloBlur,
      haloColor,
      haloWidth,
      color,
      opacity,
    } = symbolizer;

    const paint: any = {
      'text-opacity': opacity,
      'text-color': color,
      'text-halo-color': haloColor,
      'text-halo-width': haloWidth,
      'text-halo-blur': haloBlur
    };

    return paint;
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeoStylerStyle-TextSymbolizer
   *
   * @param symbolizer A GeoStylerStyle TextSymbolizer
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromTextSymbolizer(symbolizer: TextSymbolizer): any {
    const {
      allowOverlap,
      anchor,
      label,
      font,
      justify,
      keepUpright,
      letterSpacing,
      lineHeight,
      maxAngle,
      maxWidth,
      offset,
      optional,
      padding,
      pitchAlignment,
      rotate,
      rotationAlignment,
      size,
      transform,
      avoidEdges,
      visibility
    } = symbolizer;

    const paint: any = {
      'symbol-avoid-edges': avoidEdges,
      'text-pitch-alignment': pitchAlignment,
      'text-rotation-alignment': rotationAlignment,
      'text-field': label ? this.getTextFieldFromLabel(label) : undefined,
      'text-font': font,
      'text-size': size,
      'text-max-width': maxWidth,
      'text-line-height': lineHeight,
      'text-letter-spacing': letterSpacing,
      'text-justify': justify,
      'text-anchor': anchor,
      'text-max-angle': maxAngle,
      'text-rotate': rotate,
      'text-padding': padding,
      'text-keep-upright': keepUpright,
      'text-transform': transform,
      'text-offset': offset,
      'text-allow-overlap': allowOverlap,
      'text-optional': optional,
      visibility: this.getVisibility(visibility)
    };

    return paint;
  }

  /**
   * Creates a Mapbox text Format from a GeoStylerStyle-TextSymbolizer Label
   *
   * @param template A GeoStylerStyle-TextSymbolizer Label
   * @return The static text as string if no template was used, or a Mapbox text Format array
   */
  getTextFieldFromLabel(template: string | GeoStylerStringFunction): (string | any[]) {
    if (isGeoStylerFunction(template)) {
      return '';
    }

    // prefix indicating that a template is being used
    const prefix: string = '\\{\\{';
    // suffix indicating that a template is being used
    const suffix: string = '\\}\\}';
    // RegExp to match all occurences encapsuled between two curly braces
    // including the curly braces
    let regExp: RegExp = new RegExp(prefix + '.*?' + suffix, 'g');
    return template.replace(regExp, (match: string) => {
      return match.slice(1, -1);
    });
  }

  /**
   * Creates a Mapbox Layer Paint object from a GeoStylerStyle-MarkSymbolizer
   * that uses the wellKnownName 'circle'. This one will be handled explicitly
   * because mapbox has a dedicated layer type for circles. Other shapes are covered
   * in layer type 'symbol' using fonts.
   *
   * @param symbolizer A GeoStylerStyle MarkSymbolizer with wkn 'circle'
   * @return A Mapbox Layer Paint object
   */
  getPaintFromCircleSymbolizer(symbolizer: MarkSymbolizer): any {
    const {
      radius,
      color,
      fillOpacity,
      blur,
      offset,
      offsetAnchor,
      pitchScale,
      pitchAlignment,
      strokeWidth,
      strokeColor,
      strokeOpacity
    } = symbolizer;

    const paint = {
      'circle-radius': radius,
      'circle-color': color,
      'circle-blur': blur,
      'circle-opacity': fillOpacity,
      'circle-translate': offset,
      'circle-translate-anchor': offsetAnchor,
      'circle-pitch-scale': pitchScale,
      'circle-pitch-alignment': pitchAlignment,
      'circle-stroke-width': strokeWidth,
      'circle-stroke-color': strokeColor,
      'circle-stroke-opacity': strokeOpacity
    };
    return paint;
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeoStylerStyle-MarkSymbolizer
   * that uses the wellKnownName 'circle'. This one will be handled explicitly
   * because mapbox has a dedicated layer type for circles. Other shapes are covered
   * in layer type 'symbol' using fonts.
   *
   * @param symbolizer A GeoStylerStyle MarkSymbolizer with wkn 'circle'
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromCircleSymbolizer(symbolizer: MarkSymbolizer): any {
    const {
      visibility
    } = symbolizer;

    const layout = {
      visibility: visibility
    };
    return layout;
  }

  checkForUnsupportedProperties(geoStylerStyle: Style): UnsupportedProperties | undefined {
    const capitalizeFirstLetter = (a: string) => a[0].toUpperCase() + a.slice(1);
    const unsupportedProperties: UnsupportedProperties = {};
    geoStylerStyle.rules.forEach(rule => {
      // ScaleDenominator and Filters are completely supported so we just check for symbolizers
      rule.symbolizers.forEach(symbolizer => {
        const key = capitalizeFirstLetter(`${symbolizer.kind}Symbolizer`);
        const value = this.unsupportedProperties?.Symbolizer?.[key];
        if (value) {
          if (typeof value === 'string' || value instanceof String) {
            if (!unsupportedProperties.Symbolizer) {
              unsupportedProperties.Symbolizer = {};
            }
            unsupportedProperties.Symbolizer[key] = value;
          } else {
            Object.keys(symbolizer).forEach(property => {
              if (value[property]) {
                if (!unsupportedProperties.Symbolizer) {
                  unsupportedProperties.Symbolizer = {};
                }
                if (!unsupportedProperties.Symbolizer[key]) {
                  unsupportedProperties.Symbolizer[key] = {};
                }
                unsupportedProperties.Symbolizer[key][property] = value[property];
              }
            });
          }
        }
      });
    });
    if (Object.keys(unsupportedProperties).length > 0) {
      return unsupportedProperties;
    }
    return undefined;
  }

}

export default MapboxStyleParser;
