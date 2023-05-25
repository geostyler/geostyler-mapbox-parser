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
  isLineSymbolizer,
  CapType,
  JoinType,
  isFilter,
  isScaleDenominator,
  isGeoStylerBooleanFunction
} from 'geostyler-style';

import MapboxStyleUtil from './Util/MapboxStyleUtil';
import _isEqual from 'lodash/isEqual';
import {
  AnyLayer,
  AnyLayout,
  AnyPaint,
  CircleLayout,
  CirclePaint,
  CustomLayerInterface,
  FillLayer,
  FillLayout,
  FillPaint,
  LineLayer,
  LineLayout,
  LinePaint,
  SymbolLayout,
  SymbolPaint,
  Style as MapboxStyle,
  Sources,
  Expression
} from 'mapbox-gl';
import { gs2mbExpression, mb2gsExpression } from './Expressions';
import { isBoolean, isString, isUndefined, omitBy, set } from 'lodash';

/**
 * The style representation of mapbox-gl but with optional sources, as these are
 * not required for reading the style and get stripped when writing.
 */
export type MbStyle = Omit<MapboxStyle, 'sources'> & { sources?: Sources };

type NoneCustomLayer = Exclude<AnyLayer, CustomLayerInterface>;

/**
 * Generated ids contain information about the position of a layer inside the
 * geostyler-style:
 * r* -> rule index
 * sy* -> symbolizer index
 * st* -> mapboxlayer index
 */
type LayerId = AnyLayer['id'];

type GeoStylerRef = {
  rules: {
    name?: string;
    symbolizers?: LayerId[][];
  }[];
};

type SymbolType = {
    textSymbolizer?: TextSymbolizer;
    iconSymbolizer?: IconSymbolizer;
};

type OptionsType = {
    ignoreConversionErrors?: boolean;
    pretty?: boolean;
};

export class MapboxStyleParser implements StyleParser<Omit<MbStyle, 'sources'>> {

  // looks like there's no way to access static properties from an instance
  // without a reference to the constructor function, so we have to duplicate
  // the title here
  public static title = 'Mapbox';

  private static readonly fillSymbolizerStrokeProperties: (keyof FillSymbolizer)[] = [
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
  unsupportedProperties ={
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
    },
    Function: {
      strAbbreviate: 'none',
      strCapitalize: 'none',
      strDefaultIfBlank: 'none',
      strEndsWith: 'none',
      strEqualsIgnoreCase: 'none',
      strIndexOf: 'none',
      strLastIndexOf: 'none',
      strMatches: 'none',
      strReplace: 'none',
      strStartsWith: 'none',
      strStripAccents: 'none',
      strSubstringStart: 'none',
      strSubstring: {
        support: 'partial',
        info: 'end index is mandatory'
      },
      strTrim: 'none',
      exp: {
        support: 'partial',
        info: 'only for x = 1'
      },
      atan2: 'none',
      random: 'none',
      rint: 'none',
      toDegrees: 'none',
      toRadians: 'none',
      double2bool: 'none',
    }
  } satisfies UnsupportedProperties;

  public ignoreConversionErrors: boolean = false;

  public pretty: boolean = false;

  private mbMetadata: {
    'geostyler:ref': GeoStylerRef;
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

  public isSymbolType(s: Symbolizer|SymbolType): s is SymbolType {
    return (<SymbolType> s).iconSymbolizer ? true : (<SymbolType> s).textSymbolizer ? true : false;
  }

  /**
   * Parses the GeoStylerStyle-SymbolizerKind from a Mapbox Style Layer
   *
   * @param type A Mapbox Style Layer
   * @return A GeoStylerStyle SymbolizerKind 'Symbol' or 'Circle'
   */
  getSymbolizerKindFromMapboxLayerType(type: AnyLayer['type']): SymbolizerKind | 'Symbol' | 'Circle' {
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
  getLabelFromTextField(label: string | Expression): (string | GeoStylerStringFunction | undefined) {
    if (typeof label === 'undefined') {
      return;
    }
    if (typeof label === 'string') {
      return MapboxStyleUtil.resolveMbTextPlaceholder(label);
    }
    if (label[0] !== 'format') {
      return mb2gsExpression(label);
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
  getMarkSymbolizerFromMapboxCircleLayer(paint: CirclePaint, layout: CircleLayout): MarkSymbolizer | undefined  {
    const symbolizer: MarkSymbolizer = {
      kind: 'Mark',
      blur: mb2gsExpression<number>(paint?.['circle-blur']),
      color: mb2gsExpression<string>(paint?.['circle-color']),
      // TODO: handle array values
      offset: paint?.['circle-translate'] as MarkSymbolizer['offset'],
      offsetAnchor: paint?.['circle-translate-anchor'],
      fillOpacity: mb2gsExpression<number>(paint?.['circle-opacity']),
      pitchAlignment: paint?.['circle-pitch-alignment'],
      pitchScale: paint?.['circle-pitch-scale'],
      radius: mb2gsExpression<number>(paint?.['circle-radius']),
      strokeColor: mb2gsExpression<string>(paint?.['circle-stroke-color']),
      strokeOpacity: mb2gsExpression<number>(paint?.['circle-stroke-opacity']),
      strokeWidth: mb2gsExpression<number>(paint?.['circle-stroke-width']),
      visibility: layout?.visibility && layout?.visibility !== 'none',
      wellKnownName: 'circle'
    };

    if (MapboxStyleUtil.symbolizerAllUndefined(symbolizer)) {
      return undefined;
    }

    return omitBy(symbolizer, isUndefined) as MarkSymbolizer;
  }

  /**
   * Creates a GeoStylerStyle-IconSymbolizer from a Mapbox Style Layer
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-IconSymbolizer
   */
  getIconSymbolizerFromMapboxSymbolLayer(paint: SymbolPaint, layout: SymbolLayout): IconSymbolizer | undefined {
    const symbolizer: IconSymbolizer = {
      kind: 'Icon',
      allowOverlap: mb2gsExpression<boolean>(layout?.['icon-allow-overlap']),
      anchor: layout?.['icon-anchor'] as IconSymbolizer['anchor'],
      avoidEdges: layout?.['symbol-avoid-edges'],
      color: mb2gsExpression<string>(paint?.['icon-color']),
      haloBlur: mb2gsExpression<number>(paint?.['icon-halo-blur']),
      haloColor: mb2gsExpression<string>(paint?.['icon-halo-color']),
      haloWidth: mb2gsExpression<number>(paint?.['icon-halo-width']),
      image: this.getIconImage(layout?.['icon-image'] as string),
      keepUpright: mb2gsExpression<boolean>(layout?.['icon-keep-upright']),
      // TODO: handle array values
      offset: layout?.['icon-offset'] as IconSymbolizer['offset'],
      offsetAnchor: paint?.['icon-translate-anchor'],
      opacity: mb2gsExpression<number>(paint?.['icon-opacity']),
      optional: mb2gsExpression<boolean>(layout?.['icon-optional']),
      padding: mb2gsExpression<number>(layout?.['icon-padding']),
      pitchAlignment: layout?.['icon-pitch-alignment'],
      rotate: mb2gsExpression<number>(layout?.['icon-rotate']),
      rotationAlignment: layout?.['icon-rotation-alignment'],
      size: mb2gsExpression<number>(layout?.['icon-size']),
      textFit: layout?.['icon-text-fit'], // TODO: handle enum values
      // TODO: handle array values
      textFitPadding: layout?.['icon-text-fit-padding'] as IconSymbolizer['textFitPadding'],
      visibility: layout?.visibility && layout?.visibility !== 'none'
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
  getTextSymbolizerFromMapboxLayer(paint: SymbolPaint, layout: SymbolLayout): TextSymbolizer | undefined {
    const symbolizer: TextSymbolizer = {
      kind: 'Text',
      allowOverlap: mb2gsExpression<boolean>(layout?.['text-allow-overlap']),
      // TODO: handle enum values
      anchor: layout?.['text-anchor'] as TextSymbolizer['anchor'],
      avoidEdges: mb2gsExpression<boolean>(layout?.['symbol-avoid-edges']),
      color: mb2gsExpression<string>(paint?.['text-color']),
      // TODO: handle array values
      font: layout?.['text-font'],
      haloBlur: mb2gsExpression<number>(paint?.['text-halo-blur']),
      haloColor: mb2gsExpression<string>(paint?.['text-halo-color']),
      haloWidth: mb2gsExpression<number>(paint?.['text-halo-width']),
      // TODO: handle enum values
      justify: layout?.['text-justify'] as TextSymbolizer['justify'],
      keepUpright: mb2gsExpression<boolean>(layout?.['text-keep-upright']),
      label: this.getLabelFromTextField(layout?.['text-field'] as string),
      letterSpacing: mb2gsExpression<number>(layout?.['text-letter-spacing']),
      lineHeight: mb2gsExpression<number>(layout?.['text-line-height']),
      maxAngle: mb2gsExpression<number>(layout?.['text-max-angle']),
      maxWidth: mb2gsExpression<number>(layout?.['text-max-width']),
      // TODO: handle array values
      offset: layout?.['text-offset'] as TextSymbolizer['offset'],
      // TODO: handle enum values
      offsetAnchor: paint?.['text-translate-anchor'],
      opacity: mb2gsExpression<number>(paint?.['text-opacity']),
      optional: mb2gsExpression<boolean>(layout?.['text-optional']),
      padding: mb2gsExpression<number>(layout?.['text-padding']),
      // TODO: handle enum values
      pitchAlignment: layout?.['text-pitch-alignment'],
      rotate: mb2gsExpression<number>(layout?.['text-rotate']),
      // TODO: handle enum values
      rotationAlignment: layout?.['text-rotation-alignment'],
      size: mb2gsExpression<number>(layout?.['text-size']),
      // TODO: handle enum values
      transform: layout?.['text-transform'] as TextSymbolizer['transform'],
      visibility: layout?.visibility && layout?.visibility !== 'none'
    };

    if (MapboxStyleUtil.symbolizerAllUndefined(symbolizer)) {
      return undefined;
    }

    return omitBy(symbolizer, isUndefined) as TextSymbolizer;
  }

  /**
   * Creates a GeoStylerStyle-FillSymbolizer from a Mapbox Style Layer.
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-FillSymbolizer
   */
  getFillSymbolizerFromMapboxFillLayer(paint: FillPaint, layout: FillLayout): FillSymbolizer {
    const fillSymbolizer: FillSymbolizer = {
      kind: 'Fill',
      visibility: layout?.visibility && layout?.visibility !== 'none',
      antialias: mb2gsExpression<boolean>(paint?.['fill-antialias']),
      opacity: mb2gsExpression<number>(paint?.['fill-opacity']),
      color: mb2gsExpression<string>(paint?.['fill-color']),
      outlineColor: mb2gsExpression<string>(paint?.['fill-outline-color']),
      graphicFill: this.getPatternOrGradientFromMapboxLayer(paint?.['fill-pattern'])
    };
    return omitBy(fillSymbolizer, isUndefined) as FillSymbolizer;
  }

  getPatternOrGradientFromMapboxLayer(icon: any): IconSymbolizer|undefined {
    if (Array.isArray(icon) && !this.ignoreConversionErrors) {
      throw new Error('Cannot parse pattern or gradient. No Mapbox expressions allowed');
    }
    if (!icon) {
      return;
    }
    return this.getIconSymbolizerFromMapboxSymbolLayer({}, {'icon-image': icon});
  }

  /**
   * Creates a GeoStylerStyle-LineSymbolizer from a Mapbox Style Layer
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   * @return A GeoStylerStyle-LineSymbolizer
   */
  getLineSymbolizerFromMapboxLineLayer(paint: LinePaint, layout: LineLayout): LineSymbolizer {
    const lineSymbolizer: LineSymbolizer = {
      kind: 'Line',
      visibility: layout?.visibility && layout?.visibility !== 'none',
      // TODO: handle enum values
      cap: layout?.['line-cap'] as CapType,
      // TODO: handle enum values
      join: layout?.['line-join'] as JoinType,
      miterLimit: mb2gsExpression<number>(layout?.['line-miter-limit']),
      roundLimit: mb2gsExpression<number>(layout?.['line-round-limit']),
      opacity: mb2gsExpression<number>(paint?.['line-opacity']),
      color: mb2gsExpression<string>(paint?.['line-color']),
      width: mb2gsExpression<number>(paint?.['line-width']),
      gapWidth: mb2gsExpression<number>(paint?.['line-gap-width']),
      perpendicularOffset: mb2gsExpression<number>(paint?.['line-offset']),
      blur: mb2gsExpression<number>(paint?.['line-blur']),
      // TODO: handle array values
      dasharray: paint?.['line-dasharray'],
      // TODO: handle enum values
      gradient: paint?.['line-gradient'],
      graphicFill: this.getPatternOrGradientFromMapboxLayer(paint?.['line-pattern'])
    };
    return omitBy(lineSymbolizer, isUndefined) as LineSymbolizer;
  }

  /**
   * Creates GeoStyler-Style TextSymbolizer and IconSymbolizer from
   * a mapbox layer paint object.
   *
   * @param paint A Mapbox paint
   * @param layout A Mapbox layout
   */
  getIconTextSymbolizersFromMapboxSymbolLayer(paint: SymbolPaint, layout: SymbolLayout): Symbolizer[] {
    const symbolizers = [
      this.getTextSymbolizerFromMapboxLayer(paint, layout),
      this.getIconSymbolizerFromMapboxSymbolLayer(paint, layout)
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
  getSymbolizersFromMapboxLayer(
    {paint, layout, type}: {paint?: AnyPaint; layout?: AnyLayout; type: AnyLayer['type']}
  ): Symbolizer[] {
    let symbolizer: Symbolizer = {} as Symbolizer;
    const kind: SymbolizerKind | 'Symbol' | 'Circle' = this.getSymbolizerKindFromMapboxLayerType(type);

    switch (kind) {
      case 'Fill':
        symbolizer = this.getFillSymbolizerFromMapboxFillLayer(
          paint as FillPaint,
          layout as FillLayout
        );
        break;
      case 'Line':
        symbolizer = this.getLineSymbolizerFromMapboxLineLayer(
          paint as LinePaint,
          layout as LineLayout
        );
        break;
      case 'Symbol':
        return this.getIconTextSymbolizersFromMapboxSymbolLayer(
          paint as SymbolPaint,
          layout as SymbolLayout
        );
      case 'Circle':
        const sym = this.getMarkSymbolizerFromMapboxCircleLayer(
          paint as CirclePaint,
          layout as CircleLayout
        );
        return sym ? [sym]: [];
      default:
        if (this.ignoreConversionErrors) {
          return [];
        }
        throw new Error('Cannot parse mapbox style. Unsupported Symbolizer kind.');
    }
    return [omitBy(symbolizer, isUndefined) as Symbolizer];
  }

  /**
   * Creates a GeoStylerStyle-Filter from a Mapbox Style Layer Filter
   *
   * @param filter A Mapbox Style Layer Filter
   * @return A GeoStylerStyle-Filter
   */
  getFilterFromMapboxFilter(filter?: any[]): Filter | undefined {
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
    if (operator in operatorMapping) {
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
      restFilter.forEach((f: any[]) => {
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
   * This merges all the passed symbolizers into one if possbile.
   *
   * @param symbolizers The array of geostyler-style Symbolizers
   * @returns
   */
  mergeSymbolizers(symbolizers: Symbolizer[]): Symbolizer {
    if (symbolizers.length === 1) {
      return symbolizers[0];
    }

    return symbolizers.reduce((s1, s2, index) => {
      if (index === 0) {
        return s1;
      }
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
    }, symbolizers[0]);
  };

  /**
   * Creates a GeoStyler-Style Rule from a mapbox layer.
   *
   * @param layer The mapbox Layer
   * @return A GeoStyler-Style Rule Array
   */
  mapboxLayersToGeoStylerRules(layers: NoneCustomLayer[]): Rule[] {
    const geoStylerRef: GeoStylerRef = this.mbMetadata?.['geostyler:ref'];
    const gsRules: Rule[] = [];

    if (geoStylerRef) {
      geoStylerRef.rules.forEach((rule, ruleIndex) => {
        const name = rule?.name || '';
        let symbolizers: Symbolizer[] = [];
        let filter: Filter | undefined;
        let scaleDenominator: ScaleDenominator | undefined;
        rule.symbolizers?.forEach((layerIds, symbolizerIndex) => {
          const matchingLayers = layers.filter(layer => layerIds.includes(layer.id));
          const flattenedSymbolizers = matchingLayers
            .map(layer => this.getSymbolizersFromMapboxLayer(layer))
            .flat();

          symbolizers[symbolizerIndex] = this.mergeSymbolizers(flattenedSymbolizers);

          // TODO: check if there are multiple layers with different filters
          // and scaledenomintors and throw a warning that we only use the first
          // one
          if (matchingLayers?.[0]) {
            filter = this.getFilterFromMapboxFilter(matchingLayers[0].filter);
            scaleDenominator = this.getScaleDenominatorFromMapboxZoom(
              matchingLayers[0].minzoom,
              matchingLayers[0].maxzoom,
            );
          }
          // TODO: care about layers not configured in the metadata
          // const noneMatchingLayes = layers.filter(layer => !layerIds.includes(layer.id));
        });
        const gsRule = {
          filter,
          name,
          scaleDenominator,
          symbolizers
        } satisfies Rule;
        gsRules[ruleIndex] = omitBy(gsRule, isUndefined) as Rule;
      });
    } else {
      // returns array of rules where one rule contains one symbolizer
      layers.forEach(layer => {
        const symbolizers = this.getSymbolizersFromMapboxLayer(layer);
        if (symbolizers.length < 1) {
          return;
        }

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
        gsRules?.push(rule);
      });
    }

    return gsRules || [];
  }

  /**
   * Creates a GeoStylerStyle-Style from a Mapbox Style
   *
   * @param mapboxStyle The Mapbox Style object
   * @return A GeoStylerStyle-Style
   */
  mapboxStyleToGeoStylerStyle(mapboxStyle: MbStyle): Style {
    let style: Style = {} as Style;
    style.name = mapboxStyle.name || '';
    style.rules = [];
    this.mbMetadata = mapboxStyle.metadata;
    if (mapboxStyle.sprite) {
      this.spriteBaseUrl = MapboxStyleUtil.getUrlForMbPlaceholder(mapboxStyle.sprite);
    }

    if (mapboxStyle.layers) {
      const layers = mapboxStyle.layers.filter(
        layer => !(layer.type === 'custom')
      ) as NoneCustomLayer[];
      const rules = this.mapboxLayersToGeoStylerRules(layers);
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
  readStyle(mapboxStyle: MbStyle): Promise<ReadStyleResult> {
    return new Promise<ReadStyleResult>(resolve => {
      try {
        const mbStyle = structuredClone(mapboxStyle);
        const geoStylerStyle: Style = this.mapboxStyleToGeoStylerStyle(mbStyle);
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
  writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<Omit<MbStyle, 'sources'>>> {
    return new Promise<WriteStyleResult<Omit<MbStyle, 'sources'>>>(resolve => {
      const unsupportedProperties = this.checkForUnsupportedProperties(geoStylerStyle);
      try {
        const gsStyle = structuredClone(geoStylerStyle);
        const output: Omit<MbStyle, 'sources'> = this.geoStylerStyleToMapboxObject(gsStyle);
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
  geoStylerStyleToMapboxObject(geoStylerStyle: Style): Omit<MbStyle, 'sources'> {
    // Mapbox Style version
    const version = 8;
    const name = geoStylerStyle.name;
    const {layers, geoStylerRef} = this.getMapboxLayersFromRules(geoStylerStyle.rules);
    const sprite = MapboxStyleUtil.getMbPlaceholderForUrl(this.spriteBaseUrl);

    let mapboxObject = omitBy({
      version,
      name,
      layers,
      sprite,
    }, isUndefined) as Omit<MbStyle, 'sources'>;

    if (geoStylerRef){
      mapboxObject = {
        ...mapboxObject,
        metadata: {
          'geostyler:ref': geoStylerRef
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
  getMapboxLayersFromRules(rules: Rule[]): {layers: NoneCustomLayer[]; geoStylerRef: GeoStylerRef}
  {
    // one layer corresponds to a single symbolizer within a rule
    // so filters and scaleDenominators have to be set for each symbolizer explicitly
    const layers: NoneCustomLayer[] = [];
    const geoStylerRef: GeoStylerRef = {
      rules: []
    };

    rules.forEach((rule: Rule, ruleIndex: number) => {
      // create new layer object
      let layer: Partial<NoneCustomLayer> = {};

      // set filters and scaleDenominator
      if (isFilter(rule.filter)) {
        const filterClone = structuredClone(rule.filter);
        layer.filter = this.getMapboxFilterFromFilter(filterClone);
      }

      if (isScaleDenominator(rule.scaleDenominator)) {
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
        geoStylerRef.rules[ruleIndex] = {
          name: rule.name
        };

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

          let lyrClone = structuredClone(lyr);

          lyrClone.type = type;
          if (!MapboxStyleUtil.allUndefined(paint)) {
            lyrClone.paint = paint;
          }
          if (!MapboxStyleUtil.allUndefined(layout)) {
            lyrClone.layout = layout;
          }
          lyrClone.id = `r${ruleIndex}_sy${symbolizerIndex}_st${styleIndex}`;

          layers.push(omitBy(lyrClone, isUndefined) as NoneCustomLayer);

          if (!Array.isArray(geoStylerRef?.rules?.[ruleIndex]?.symbolizers)) {
            geoStylerRef.rules[ruleIndex].symbolizers = [[]];
          }
          geoStylerRef.rules[ruleIndex]?.symbolizers?.[symbolizerIndex].push(lyrClone.id);
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

    return zoom;
  }

  /**
   * Writes a Mapbox-filter from a GeoStylerStyle-Filter
   *
   * @param filter A GeoStylerStyle-Filter
   * @return A Mapbox filter array
   */
  // TODO: Move to Expression evaluation as mapbox Filter are deprecated
  // (replaced by Expressions)
  getMapboxFilterFromFilter(filter: Filter): Expression {
    if (isGeoStylerBooleanFunction(filter) || isBoolean(filter)) {
      return gs2mbExpression<any>(filter);
    }

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

    return mbFilter as Expression;
  }

  /**
   * Creates a Mapbox Layer Paint object and the layerType from a GeoStylerStyle-Symbolizer
   *
   * @param symbolizer A GeoStylerStyle-Symbolizer
   * @return [{layerType, paint, layout}] A list of objects consisting of the MapboxLayerType,
   *    the Mapbox Layer Paint and Layout
   */
  getStyleFromSymbolizer(symbolizer: Symbolizer):
    { type: NoneCustomLayer['type']; paint?: AnyPaint; layout?: AnyLayout }[]
  {
    const symbolizerClone = structuredClone(symbolizer);
    let type: NoneCustomLayer['type'];
    let paint: AnyPaint | undefined = undefined;
    let layout: AnyLayout | undefined = undefined;

    let fillSplitStyles: [Omit<FillLayer, 'id'>, Omit<LineLayer, 'id'>] | [] = [];

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
          paint = this.getCirclePaintFromMarkSymbolizer(symbolizerClone as MarkSymbolizer);
          layout = this.getCircleLayoutFromMarkSymbolizer(symbolizerClone as MarkSymbolizer);
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

    if (fillSplitStyles.length === 2) {
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
  getSplitStyleFromFillSymbolizer(symbolizer: FillSymbolizer):
    [Omit<FillLayer, 'id'>, Omit<LineLayer, 'id'>]
  {
    let symbolizerClone: FillSymbolizer = structuredClone(symbolizer);
    delete symbolizerClone?.outlineColor;

    const fillPaint = this.getPaintFromFillSymbolizer(symbolizerClone as FillSymbolizer);
    const fillLayer: Omit<FillLayer, 'id'> = {
      type: 'fill',
      paint : fillPaint,
      layout : this.getLayoutFromFillSymbolizer(symbolizerClone as FillSymbolizer)
    };

    symbolizerClone = structuredClone(symbolizer as FillSymbolizer);
    const lineSymbolizer: LineSymbolizer = {
      kind: 'Line',
      color: symbolizerClone?.outlineColor,
      opacity: symbolizerClone?.outlineOpacity,
      width: symbolizerClone?.outlineWidth,
      join: symbolizerClone?.outlineJoin,
      cap: symbolizerClone?.outlineCap,
    };

    const outlineLayer: Omit<LineLayer, 'id'> = {
      type: 'line',
      paint: this.getPaintFromLineSymbolizer(lineSymbolizer),
      layout: this.getLayoutFromLineSymbolizer(lineSymbolizer)
    };

    return [fillLayer, outlineLayer];
  }

  /**
   * Creates a Mapbox Layer Paint object from a GeostylerStyle-FillSymbolizer
   *
   * @param symbolizer A GeostylerStyle-FillSymbolizer
   * @return A Mapbox Layer Paint object
   */
  getPaintFromFillSymbolizer(symbolizer: FillSymbolizer): FillPaint {
    const {
      opacity,
      color,
      outlineColor,
      graphicFill,
      antialias
    } = symbolizer;

    const paint: FillPaint = {
      'fill-antialias': gs2mbExpression<boolean>(antialias),
      'fill-opacity': gs2mbExpression<number>(opacity),
      'fill-color': gs2mbExpression<string>(color),
      'fill-outline-color': gs2mbExpression<string>(outlineColor),
      'fill-pattern': this.getPatternOrGradientFromPointSymbolizer(graphicFill)
    };
    return omitBy(paint, isUndefined);
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeostylerStyle-FillSymbolizer
   *
   * @param symbolizer A GeostylerStyle-FillSymbolizer
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromFillSymbolizer(symbolizer: FillSymbolizer): FillLayout {
    const {
      visibility
    } = symbolizer;

    const layout: FillLayout = {
      visibility: this.getVisibility(visibility)
    };
    return omitBy(layout, isUndefined);
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
  getVisibility(visibility: boolean | GeoStylerBooleanFunction | undefined): AnyLayout['visibility'] {
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
  getPaintFromLineSymbolizer(symbolizer: LineSymbolizer): LinePaint {
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

    const paint: LinePaint = {
      'line-opacity': gs2mbExpression<number>(opacity),
      'line-color': color as LinePaint['line-color'],
      'line-width': gs2mbExpression<number>(width),
      'line-gap-width': gs2mbExpression<number>(gapWidth),
      'line-offset': gs2mbExpression<number>(perpendicularOffset),
      'line-blur': gs2mbExpression<number>(blur),
      // TODO: handle array values
      'line-dasharray': dasharray as LinePaint['line-dasharray'],
      'line-pattern': this.getPatternOrGradientFromPointSymbolizer(graphicFill),
      // TODO: handle array values
      'line-gradient': gradient as LinePaint['line-gradient']
    };
    return omitBy(paint, isUndefined);
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeoStylerStyle-LineSymbolizer
   *
   * @param symbolizer A GeoStylerStyle-LineSymbolizer
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromLineSymbolizer(symbolizer: LineSymbolizer): LineLayout {
    const {
      cap,
      join,
      miterLimit,
      roundLimit,
      visibility,
    } = symbolizer;

    const layout: LineLayout = {
      'line-cap': gs2mbExpression<LineLayout['line-cap']>(cap),
      'line-join': gs2mbExpression<LineLayout['line-join']>(join),
      'line-miter-limit': gs2mbExpression<number>(miterLimit),
      'line-round-limit': gs2mbExpression<number>(roundLimit),
      visibility: this.getVisibility(visibility)
    };
    return omitBy(layout, isUndefined);
  }

  /**
   * Creates a Mapbox Layer Paint object from a GeoStylerStyle-IconSymbolizer
   *
   * @param symbolizer A GeoStylerStyle-IconSymbolizer
   * @return A Mapbox Layer Paint object
   */
  getPaintFromIconSymbolizer(symbolizer: IconSymbolizer): SymbolPaint {
    const {
      haloBlur,
      haloColor,
      haloWidth,
      color,
      opacity,
    } = symbolizer;

    const paint: SymbolPaint = {
      'icon-opacity': gs2mbExpression<number>(opacity),
      'icon-color': gs2mbExpression<string>(color),
      'icon-halo-color': gs2mbExpression<string>(haloColor),
      'icon-halo-width': gs2mbExpression<number>(haloWidth),
      'icon-halo-blur': gs2mbExpression<number>(haloBlur)
    };
    return omitBy(paint, isUndefined);
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeoStylerStyle-IconSymbolizer
   *
   * @param symbolizer A GeoStylerStyle-IconSymbolizer
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromIconSymbolizer(symbolizer: IconSymbolizer): SymbolLayout {
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

    const layout: SymbolLayout = {
      'symbol-avoid-edges': avoidEdges as SymbolLayout['symbol-avoid-edges'],
      'icon-allow-overlap': gs2mbExpression<boolean>(allowOverlap),
      'icon-optional': optional as SymbolLayout['icon-optional'],
      'icon-rotation-alignment': gs2mbExpression<SymbolLayout['icon-rotation-alignment']>
      (rotationAlignment) as SymbolLayout['icon-rotation-alignment'],
      'icon-size': gs2mbExpression<number>(size),
      'icon-text-fit': gs2mbExpression<SymbolLayout['icon-text-fit']>(textFit) as SymbolLayout['icon-text-fit'],
      // TODO: handle array values
      'icon-text-fit-padding': textFitPadding as SymbolLayout['icon-text-fit-padding'],
      // TODO: check sprite handling
      'icon-image': image ? this.handleSprite(image) : undefined,
      'icon-rotate': gs2mbExpression<number>(rotate),
      'icon-padding': gs2mbExpression<number>(padding),
      'icon-keep-upright': keepUpright as SymbolLayout['icon-keep-upright'],
      // TODO: handle array values
      'icon-offset': offset as SymbolLayout['icon-offset'],
      'icon-anchor': gs2mbExpression<SymbolLayout['icon-anchor']>(anchor),
      'icon-pitch-alignment': gs2mbExpression<SymbolLayout['icon-pitch-alignment']>
      (pitchAlignment) as SymbolLayout['icon-pitch-alignment'],
      visibility: this.getVisibility(visibility)
    };
    return omitBy(layout, isUndefined);
  }

  /**
   * Creates a Mapbox Layer Paint object from a GeoStylerStyle-TextSymbolizer
   *
   * @param symbolizer A GeoStylerStyle TextSymbolizer
   * @return A Mapbox Layer Paint object
   */
  getPaintFromTextSymbolizer(symbolizer: TextSymbolizer): SymbolPaint {
    const {
      haloBlur,
      haloColor,
      haloWidth,
      color,
      opacity,
    } = symbolizer;

    const paint: SymbolPaint = {
      'text-opacity': gs2mbExpression<number>(opacity),
      'text-color': gs2mbExpression<string>(color),
      'text-halo-color': gs2mbExpression<string>(haloColor),
      'text-halo-width': gs2mbExpression<number>(haloWidth),
      'text-halo-blur': gs2mbExpression<number>(haloBlur)
    };

    return omitBy(paint, isUndefined);
  }

  /**
   * Creates a Mapbox Layer Layout object from a GeoStylerStyle-TextSymbolizer
   *
   * @param symbolizer A GeoStylerStyle TextSymbolizer
   * @return A Mapbox Layer Layout object
   */
  getLayoutFromTextSymbolizer(symbolizer: TextSymbolizer): SymbolLayout {
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

    const paint: SymbolLayout = {
      'symbol-avoid-edges': avoidEdges as SymbolLayout['symbol-avoid-edges'],
      'text-pitch-alignment': gs2mbExpression<SymbolLayout['text-pitch-alignment']>
      (pitchAlignment) as SymbolLayout['text-pitch-alignment'],
      'text-rotation-alignment': gs2mbExpression<SymbolLayout['text-rotation-alignment']>
      (rotationAlignment) as SymbolLayout['text-rotation-alignment'],
      'text-field': this.getTextFieldFromLabel(label),
      // TODO: handle array values
      'text-font': font as SymbolLayout['text-font'],
      'text-size': gs2mbExpression<number>(size),
      'text-max-width': gs2mbExpression<number>(maxWidth),
      'text-line-height': gs2mbExpression<number>(lineHeight),
      'text-letter-spacing': gs2mbExpression<number>(letterSpacing),
      'text-justify': gs2mbExpression<SymbolLayout['text-justify']>(justify),
      'text-anchor': gs2mbExpression<SymbolLayout['text-anchor']>(anchor),
      'text-max-angle': gs2mbExpression<number>(maxAngle),
      'text-rotate': gs2mbExpression<number>(rotate),
      'text-padding': gs2mbExpression<number>(padding),
      'text-keep-upright': keepUpright as SymbolLayout['text-keep-upright'],
      'text-transform': gs2mbExpression<SymbolLayout['text-transform']>(transform),
      // TODO: handle array values
      'text-offset': offset as SymbolLayout['text-offset'],
      'text-allow-overlap': allowOverlap as SymbolLayout['text-allow-overlap'],
      'text-optional': optional as SymbolLayout['text-optional'],
      visibility: this.getVisibility(visibility)
    };

    return omitBy(paint, isUndefined);
  }

  /**
   * Creates a Mapbox text Format from a GeoStylerStyle-TextSymbolizer Label
   *
   * @param template A GeoStylerStyle-TextSymbolizer Label
   * @return The static text as string if no template was used, or a Mapbox text Format array
   */
  getTextFieldFromLabel(template?: string | GeoStylerStringFunction): (string | Expression | undefined) {
    if (!template) {
      return;
    }

    if (isGeoStylerFunction(template)) {
      return gs2mbExpression<string>(template);
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
  getCirclePaintFromMarkSymbolizer(symbolizer: MarkSymbolizer): CirclePaint {
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

    const paint: CirclePaint = {
      'circle-radius': gs2mbExpression<number>(radius),
      'circle-color': gs2mbExpression<string>(color),
      'circle-blur': gs2mbExpression<number>(blur),
      'circle-opacity': gs2mbExpression<number>(fillOpacity),
      // TODO: handle array values
      'circle-translate': offset as CirclePaint['circle-translate'],
      'circle-translate-anchor': gs2mbExpression<CirclePaint['circle-translate-anchor']>
      (offsetAnchor) as CirclePaint['circle-translate-anchor'],
      'circle-pitch-scale': gs2mbExpression<CirclePaint['circle-pitch-scale']>
      (pitchScale) as CirclePaint['circle-pitch-scale'],
      'circle-pitch-alignment': gs2mbExpression<CirclePaint['circle-pitch-alignment']>
      (pitchAlignment) as CirclePaint['circle-pitch-alignment'],
      'circle-stroke-width': gs2mbExpression<number>(strokeWidth),
      'circle-stroke-color': gs2mbExpression<string>(strokeColor),
      'circle-stroke-opacity': gs2mbExpression<number>(strokeOpacity)
    };
    return omitBy(paint, isUndefined);
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
  getCircleLayoutFromMarkSymbolizer(symbolizer: MarkSymbolizer): CircleLayout {
    const {
      visibility
    } = symbolizer;

    const layout: CircleLayout = {
      visibility: this.getVisibility(visibility)
    };
    return omitBy(layout, isUndefined);
  }

  checkForUnsupportedProperties(geoStylerStyle: Style): UnsupportedProperties | undefined {
    const unsupportedProperties: UnsupportedProperties = {};

    geoStylerStyle.rules.forEach(rule => {
      // ScaleDenominator and Filters are completely supported so we just check for symbolizers
      rule.symbolizers.forEach(symbolizer => {
        const key: `${SymbolizerKind}Symbolizer` = `${symbolizer.kind}Symbolizer`;
        if (key in this.unsupportedProperties.Symbolizer) {
          const value = this.unsupportedProperties.Symbolizer[key];
          if (value) {
            if (isString(value)) {
              set(unsupportedProperties, `Symbolizer.${key}`, value);
            } else {
              Object.keys(symbolizer).forEach((property: keyof UnsupportedProperties['Symbolizer']) => {
                if (value[property]) {
                  set(unsupportedProperties, `Symbolizer.${key}.${property}`, value);
                }
              });
            }
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
