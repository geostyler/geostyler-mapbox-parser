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
    UnsupportedProperties
} from 'geostyler-style';

import MapboxStyleUtil from './Util/MapboxStyleUtil';

const _cloneDeep = require('lodash/cloneDeep');
const _isEqual = require('lodash/isEqual');

type MapboxLayerType = 'fill' | 'line' | 'symbol' | 'circle' | 'heatmap' |
    'fill-extrusion' | 'raster' | 'hillshade' | 'background';

type SymbolType = {
    textSymbolizer?: TextSymbolizer;
    iconSymbolizer?: IconSymbolizer;
};

export class MapboxStyleParser implements StyleParser {
    isSymbolType(s: Symbolizer|SymbolType): s is SymbolType {
        return (<SymbolType> s).iconSymbolizer ? true : (<SymbolType> s).textSymbolizer ? true : false;
    }

    _spriteBaseUrl: string;

    /**
     * Object of unsupported properties.
     */
    static unsupportedProperties: UnsupportedProperties = {
        Symbolizer: {
            FillSymbolizer: {
                outlineWidth: 'unsupported',
                outlineDasharray: 'unsupported'
            },
            LineSymbolizer: {
                dashOffset: 'unsupported',
                graphicStroke: 'unsupported'
            },
            MarkSymbolizer: 'unsupported'
        }
    };

    /**
     * Parses the GeoStylerStyle-SymbolizerKind from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {SymbolizerKind} A GeoStylerStyle-SymbolizerKind
     */
    getSymbolizerKindFromMapboxLayer(type: string): SymbolizerKind|'Symbol'|'Circle' {
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
                throw new Error(`Could not parse mapbox style. Unsupported layer type.
                We support types 'fill', 'line' and 'symbol' only.`);
        }
    }

    /**
     * Creates a GeoStylerStyle-TextSymbolizer label from a Mapbox Layer Paint Symbol text-field
     *
     * @param {string | any[]} label A Mapbox Layer Paint Symbol text-field
     * @return {string} A GeoStylerStyle-TextSymbolizer label
     */
    getLabelFromTextField(label: string | any[]): (string|undefined) {
        if (typeof label === 'undefined') {
            return;
        }
        if (typeof label === 'string') {
            return label;
        }
        if (label[0] !== 'format') {
            throw new Error(`Cannot parse mapbox style. Unsupported text format.`);
        }
        let gsLabel = '';
        // ignore all even indexes since we cannot handle them 
        for (let i = 1; i < label.length; i = i + 2) {
            if (typeof label[i] === 'string') {
                gsLabel += label[i];
            } else {
                if (label[i][0] !== 'get') {
                    throw new Error(`Cannot parse mapbox style. Unsupported lookup type.`);
                }
                gsLabel += '{{' + label[i][1] + '}}';
            }
        }
        return gsLabel;
    }

    /**
     * Creates a GeoStylerStyle-MarkSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {MarkSymbolizer} A GeoStylerStyle-MarkSymbolizer
     */
    getMarkSymbolizerFromMapboxLayer(paint: any, layout: any): MarkSymbolizer {
        // TODO parse MarkSymbolizer
        return {
            kind: 'Mark',
            wellKnownName: 'Circle'
        };
    }

    /**
     * Creates an image url based on the sprite baseurl and the sprite name.
     *
     * @param {string} spriteName Name of the sprite
     * @return {string} the url that returns the single image
     */
    getIconImage(spriteName: string): (string|undefined) {
        if (!spriteName) {
            return;
        }
        if (!this._spriteBaseUrl) {
            return;
        }
        // TODO update endpoint as soon as api specification was made
        let url: string = '/sprites/?';
        url += 'name=' + spriteName;
        url += '&baseurl=' + encodeURIComponent(this._spriteBaseUrl);
        return url;
    }

    /**
     * Creates a GeoStylerStyle-MarkSymbolizer with wellKnownName 'circle'
     * from a Mapbox Style Layer. This one will be handled explicitly
     * because mapbox has a dedicated layer type for circles. Other shapes are covered
     * in layer type 'symbol' using fonts.
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {MarkSymbolizer} A GeoStylerStyle-MarkSymbolizer
     */
    getCircleSymbolizerFromMapboxLayer(paint: any, layout: any): MarkSymbolizer {
        return {
            kind: 'Mark',
            wellKnownName: 'Circle',
            visibility: layout['visibility'],
            radius: paint['circle-radius'],
            color: paint['circle-color'],
            blur: paint['circle-blur'],
            opacity: paint['circle-opacity'],
            translate: paint['circle-translate'],
            translateAnchor: paint['circle-translate-anchor'],
            pitchScale: paint['circle-pitch-scale'],
            pitchAlignment: paint['circle-pitch-alignment'],
            strokeWidth: paint['circle-stroke-width'],
            strokeColor: paint['circle-stroke-color'],
            strokeOpacity: paint['circle-stroke-opacity']
        };
    }

    /**
     * Creates a GeoStylerStyle-IconSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {IconSymbolizer} A GeoStylerStyle-IconSymbolizer
     */
    getIconSymbolizerFromMapboxLayer(paint: any, layout: any): IconSymbolizer {
        return {
            kind: 'Icon',
            spacing: layout['symbol-spacing'],
            avoidEdges: layout['symbol-avoid-edges'],
            allowOverlap: layout['icon-allow-overlap'],
            ignorePlacement: layout['icon-ignore-placement'],
            optional: layout['icon-optional'],
            rotationAlignment: layout['icon-rotation-alignment'],
            size: layout['icon-size'],
            textFit: layout['icon-text-fit'],
            textFitPadding: layout['icon-text-fit-padding'],
            image: this.getIconImage(layout['icon-image']),
            rotate: layout['icon-rotate'],
            padding: layout['icon-padding'],
            keepUpright: layout['icon-keep-upright'],
            offset: layout['icon-offset'],
            anchor: layout['icon-anchor'],
            pitchAlignment: layout['icon-pitch-alignment'],
            visibility: layout['visibility'],
            opacity: paint['icon-opacity'],
            color: paint['icon-color'],
            haloColor: paint['icon-halo-color'],
            haloWidth: paint['icon-halo-width'],
            haloBlur: paint['icon-halo-blur'],
            translate: paint['icon-translate'],
            translateAnchor: paint['icon-translate-anchor']
        };
    }

    /**
     * Creates a GeoStylerStyle-TextSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {TextSymbolizer} A GeoStylerStyle-TextSymbolizer
     */
    getTextSymbolizerFromMapboxLayer(paint: any, layout: any): TextSymbolizer {
        return {
            kind: 'Text',
            spacing: layout['symbol-spacing'],
            avoidEdges: layout['symbol-avoid-edges'],
            pitchAlignment: layout['text-pitch-alignment'],
            rotationAlignment: layout['text-rotation-alignment'],
            label: this.getLabelFromTextField(layout['text-field']),
            font: layout['text-font'],
            size: layout['text-size'],
            maxWidth: layout['text-max-width'],
            lineHeight: layout['text-line-height'],
            letterSpacing: layout['text-letter-spacing'],
            justify: layout['text-justify'],
            anchor: layout['text-anchor'],
            maxAngle: layout['text-max-angle'],
            rotate: layout['text-rotate'],
            padding: layout['text-padding'],
            keepUpright: layout['text-keep-upright'],
            transform: layout['text-transform'],
            offset: layout['text-offset'],
            allowOverlap: layout['text-allow-overlap'],
            ignorePlacement: layout['text-ignore-placement'],
            optional: layout['text-optional'],
            visibility: layout['visibility'],
            opacity: paint['text-opacity'],
            color: paint['text-color'],
            haloColor: paint['text-halo-color'],
            haloWidth: paint['text-halo-width'],
            haloBlur: paint['text-halo-blur'],
            translate: paint['text-translate'],
            translateAnchor: paint['text-translate-anchor']
        };
    }

    /**
     * Creates a GeoStylerStyle-FillSymbolizer from a Mapbox Style Layer.
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {FillSymbolizer} A GeoStylerStyle-FillSymbolizer
     */
    getFillSymbolizerFromMapboxLayer(paint: any, layout: any): FillSymbolizer {
        return {
            kind: 'Fill',
            visibility: layout['visibility'],
            antialias: paint['fill-antialias'],
            opacity: paint['fill-opacity'],
            color: paint['fill-color'],
            outlineColor: paint['fill-outline-color'],
            translate: paint['fill-translate'],
            translateAnchor: paint['fill-translate-anchor'],
            graphicFill: this.getPatternOrGradientFromMapboxLayer(paint['fill-pattern'])
        };
    }

    getPatternOrGradientFromMapboxLayer(icon: any): IconSymbolizer|undefined {
        if (Array.isArray(icon)) {
            throw new Error(`Cannot parse pattern or gradient. No Mapbox expressions allowed`);
        }
        if (!icon) {
            return;
        }
        return this.getIconSymbolizerFromMapboxLayer({}, {'icon-image': icon});
    }

    /**
     * Creates a GeoStylerStyle-LineSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {LineSymbolizer} A GeoStylerStyle-LineSymbolizer
     */
    getLineSymbolizerFromMapboxLayer(paint: any, layout: any): LineSymbolizer {
        return {
            kind: 'Line',
            visibility: layout.visibility,
            cap: layout['line-cap'],
            join: layout['line-join'],
            miterLimit: layout['line-miter-limit'],
            roundLimit: layout['line-round-limit'],
            opacity: paint['line-opacity'],
            color: paint['line-color'],
            translate: paint['line-translate'],
            translateAnchor: paint['line-translate-anchor'],
            width: paint['line-width'],
            gapWidth: paint['line-gap-width'],
            perpendicularOffset: paint['line-offset'],
            blur: paint['line-blur'],
            dasharray: paint['line-dasharray'],
            gradient: paint['line-gradient'],
            graphicFill: this.getPatternOrGradientFromMapboxLayer(paint['line-pattern'])
        };
    }

    /**
     * Creates GeoStyler-Style TextSymbolizer and IconSymbolizer from
     * a mapbox layer paint object.
     * 
     * @param paint The paint object of a mapbox layer
     */
    getIconTextSymbolizersFromMapboxLayer(paint: any, layout: any): SymbolType {
        return {
            textSymbolizer: this.getTextSymbolizerFromMapboxLayer(paint, layout),
            iconSymbolizer: this.getIconSymbolizerFromMapboxLayer(paint, layout)
        };
    }

    /**
     * Creates a GeoStylerStyle-Symbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {Symbolizer} A GeoStylerStyle-Symbolizer
     */
    getSymbolizerFromMapboxLayer(paint: any, layout: any, type: string): Symbolizer|SymbolType {
        let symbolizer: Symbolizer = {} as Symbolizer;
        const kind: SymbolizerKind|'Symbol'|'Circle' = this.getSymbolizerKindFromMapboxLayer(type);

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
                return this.getCircleSymbolizerFromMapboxLayer(paint, layout);
            case 'Mark':
                symbolizer = this.getMarkSymbolizerFromMapboxLayer(paint, layout);
                break;
            default:
                throw new Error(`Cannot parse mapbox style. Unsupported Symbolizer kind.`);
        }
        return symbolizer;
    }

    /**
     * Creates a GeoStylerStyle-Filter from a Mapbox Style Layer Filter
     *
     * @param filter A Mapbox Style Layer Filter
     * @return {Filter} A GeoStylerStyle-Filter
     */
    getFilterFromMapboxFilter(filter: any[]): Filter {
        const operatorMapping = {
            'all': true,
            'any': true,
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
        } else {
            filter[1] = filter[1][1];
        }
        return filter;
    }

    /**
     * Creates a GeoStylerStyle-ScaleDenominator from a Mapvox Style Layer Min/Max Zoom
     *
     * @param {number} minZoom A Mapbox Style Layer minZoom property
     * @param {number} maxZoom A Mapbox Style Layer maxZoom property
     * @return {ScaleDenominator} A GeoStylerStyle-ScaleDenominator
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
           gsBaseFilter = this.getFilterFromMapboxFilter(baseFilter); 
           gsFilter = this.getFilterFromMapboxFilter(filter);
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
     * @return {{filter?: Filter; symbolizers: Symbolizer[]}} Array of valid Symbolizers and optional mapbox filters
     */
    mapboxAttributeFiltersToSymbolizer(tmpSymbolizer: Symbolizer): {filter?: Filter; symbolizers: Symbolizer[]}[] {
        const pseudoRules: {filter?: Filter; symbolizers: Symbolizer[]; }[] = [];
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
            if (tmpSymbolizer[prop][0] !== 'case') {
                throw new Error(`Unsupported expression. Only expressions of type 'case' are allowed.`);
            }
            filterProps.push(prop);
            filters.push(tmpSymbolizer[prop]);
        });

        if (filters.length > 0) {
            const equalFilters: boolean = this.equalMapboxAttributeFilters(filters);
            if (!equalFilters) {
                throw new Error(`Cannot parse attributes. Filters do not match`);
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

    /**
     * Creates GeoStyler-Style Rules from a mapbox paint object.
     *
     * @param {any} paint A mapbox layer paint object
     * @param {string} type The type of the mapbox layer
     * @return {Rule[]} Array of GeoStyler-Style Rules
     */
    mapboxPaintToGeoStylerRules(paint: any, layout: any, type: string): Rule[] {
        const rules: Rule[] = [];
        const tmpSymbolizer: Symbolizer|SymbolType = this.getSymbolizerFromMapboxLayer(paint, layout, type);
        const pseudoRules: any[] = [];
        if (this.isSymbolType(tmpSymbolizer)) {
            // Concatenates all pseudorules.
            if (tmpSymbolizer.hasOwnProperty('iconSymbolizer')) {
                // check if all properties except 'kind' are undefined. If so, skip
                if (!MapboxStyleUtil.symbolizerAllUndefined(tmpSymbolizer.iconSymbolizer as Symbolizer)) {
                    pseudoRules.push(
                        ...this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer.iconSymbolizer as Symbolizer)
                    );
                }
            }
            if (tmpSymbolizer.hasOwnProperty('textSymbolizer')) {
                // check if all properties except 'kind' are undefined. If so, skip
                if (!MapboxStyleUtil.symbolizerAllUndefined(tmpSymbolizer.textSymbolizer as Symbolizer)) {
                    pseudoRules.push(
                        ...this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer.textSymbolizer as Symbolizer)
                    );
                }
            }
        } else {
            pseudoRules.push(...this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer as Symbolizer));
        }
        pseudoRules.forEach((rule: any) => {
            const {
                filter,
                symbolizers
            } = rule;
            rules.push({
                name: '',
                filter,
                symbolizers
            });
        });

        return rules;
    }

    /**
     * Creates a GeoStyler-Style Rule from a mapbox layer.
     *
     * @param {any} layer The mapbox Layer
     * @return {Rule[]} A GeoStyler-Style Rule Array
     */
    mapboxLayerToGeoStylerRules(layer: any): Rule[] {
        let rules: Rule[] = [];
        if (!layer.layout) {
            layer.layout = {};
        }
        if (!layer.paint) {
            layer.paint = {};
        }
        // returns array of rules where one rule contains one symbolizer
        const symbolizerRules: Rule[] = this.mapboxPaintToGeoStylerRules(layer.paint, layer.layout, layer.type);
        symbolizerRules.forEach((rule: Rule, index: number) => {
            const filter = layer.filter ? _cloneDeep(layer.filter) : undefined;
            const ruleFilter = _cloneDeep(rule.filter);
            rules.push({
                name: layer.id,
                scaleDenominator: this.getScaleDenominatorFromMapboxZoom(layer.minzoom, layer.maxzoom),
                // merge layer filter with attribute filters
                filter: this.mergeFilters(filter, ruleFilter),
                symbolizers: rule.symbolizers
            });
        });
        return rules;
    }

    /**
     * Creates a GeoStylerStyle-Style from a Mapbox Style
     *
     * @param {any} mapboxStyle The Mapbox Style object
     * @return {Style} A GeoStylerStyle-Style
     */
    mapboxLayerToGeoStylerStyle(mapboxStyle: any): Style {
        let style: Style = {} as Style;
        style.name = mapboxStyle.name;
        style.rules = [];
        if (mapboxStyle.sprite) {
            this._spriteBaseUrl = MapboxStyleUtil.getUrlForMbPlaceholder(mapboxStyle.sprite);
        }
        // style.rules = this.mapboxLayerToGeoStylerRules(mapboxStyle);
        if (mapboxStyle.layers) {
            mapboxStyle.layers.forEach((layer: any) => {
                const rules = this.mapboxLayerToGeoStylerRules(layer);
                style.rules = style.rules.concat(rules);
            });
        }
        return style;
    }

    /**
     * The readStyle implementation of the GeoStyler-Style StylerParser interface.
     * It reads a Mapbox Style and returns a Promise resolving with a GeoStylerStyle-ReadResponse.
     *
     * @param mapboxLayer The Mapbox Style object
     * @return {Promise<ReadResponse>} The Promise resolving with a GeoStylerStyle-ReadResponse
     */
    readStyle(mapboxStyle: any): Promise<Style> {
        return new Promise<Style>((resolve, reject) => {
            try {
                const mbStyle = _cloneDeep(mapboxStyle);
                const geoStylerStyle: Style = this.mapboxLayerToGeoStylerStyle(mbStyle);
                resolve(geoStylerStyle);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads a GeoStyler-Style Style and returns a Promise.
     *
     * @param {Style} geoStylerStyle A GeoStylerStyle-Style
     * @return {Promise<any>} The Promise resolving with an mapbox style object 
     */
    writeStyle(geoStylerStyle: Style): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                const gsStyle = _cloneDeep(geoStylerStyle);
                const mapboxStyle: any = this.geoStylerStyleToMapboxObject(gsStyle);
                // const mapboxStyle: any = this.getMapboxLayersFromRules(geoStylerStyle.rules);
                resolve(mapboxStyle);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Write a Mapbox Style Object based on a GeoStylerStyle.
     *
     * @param {Style} geoStylerStyle A GeoStylerStyle-Style
     * @return {any} A Mapbox Style object
     */
    geoStylerStyleToMapboxObject(geoStylerStyle: Style): any {
        // Mapbox Style version
        const version = 8;
        const name = geoStylerStyle.name;
        const layers = this.getMapboxLayersFromRules(geoStylerStyle.rules);
        const sprite = MapboxStyleUtil.getMbPlaceholderForUrl(this._spriteBaseUrl);
        return {
            version,
            name,
            layers,
            sprite
        };
    }

    /**
     * Creates a layer for each Rule and each Symbolizer.
     *
     * @param {Rule[]} rules An array of GeoStylerStyle-Rules
     * @return {any[]} An array of Mapbox Layers
     */
    getMapboxLayersFromRules(rules: Rule[]): any[] {
        // one layer corresponds to a single symbolizer within a rule
        // so filters and scaleDenominators have to be set for each symbolizer explicitly
        const layers: any[] = [];
        rules.forEach((rule: Rule, i: number) => {
            // create new layer object
            let layer: any = {};
            // just setting the temporary id here
            // after iterating over each symbolizer, we will add the index of each symbolizer
            // as a suffix to the layerId;
            const layerId: string = rule.name; // + '-gs-r' + i;
            // set filters and scaleDenominator
            if (rule.filter && rule.filter.length !== 0) {
                const filterClone = _cloneDeep(rule.filter);
                layer.filter = this.getMapboxFilterFromFilter(filterClone);
            }

            if (rule.scaleDenominator) {
                // calculate zoomLevel from scaleDenominator
                if (typeof rule.scaleDenominator.min !== 'undefined') {
                    layer.maxzoom = this.getMapboxZoomFromScaleDenominator(rule.scaleDenominator.min);
                }
                if (typeof rule.scaleDenominator.max !== 'undefined') {
                    layer.minzoom = this.getMapboxZoomFromScaleDenominator(rule.scaleDenominator.max);
                }
            }

            rule.symbolizers.forEach((symbolizer: Symbolizer, index: number) => {
                // use existing layer properties
                let lyr: any = {};
                lyr.filter = layer.filter;
                lyr.minzoom = layer.minzoom;
                lyr.maxzoom = layer.maxzoom;
                // set name
                // lyr.id = layerId + '-s' + index;
                lyr.id = layerId;
                // get symbolizer type and paint
                const {
                    layerType,
                    paint,
                    layout
                } = this.getStyleFromSymbolizer(symbolizer);
                lyr.type = layerType;
                lyr.paint = !MapboxStyleUtil.allUndefined(paint) ? paint : undefined;
                lyr.layout = !MapboxStyleUtil.allUndefined(layout) ? layout : undefined;
                layers.push(lyr);
            });
        });
        return layers;
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
     * @param {Filter} filter A GeoStylerStyle-Filter 
     * @return {any[]} A Mapbox filter array
     */
    getMapboxFilterFromFilter(filter: Filter): any[] {
        const operatorMapping = {
            '&&': true,
            '||': true,
            '!': true
        };
        const operator: Operator = filter[0];
        let isNestedFilter: boolean = false;
        if (operatorMapping[operator]) {
            isNestedFilter = true;
        }
        if (isNestedFilter) {
            switch (filter[0]) {
                case '&&':
                    filter[0] = 'all';
                    break;
                case '||':
                    filter[0] = 'any';
                    break;
                default:
                    break;
            }

            let restFilter = filter.slice(1);
            restFilter.forEach((f: Filter) => {
                this.getMapboxFilterFromFilter(f);
            });
        } else {
            filter[1] = ['get', filter[1]];
        }
        return filter;
    }

    /**
     * Creates a Mapbox Layer Paint object and the layerType from a GeoStylerStyle-Symbolizer
     *
     * @param {Symbolizer} symbolizer A GeoStylerStyle-Symbolizer
     * @return {MapboxLayerType, any} {layertype, paint} An object consisting of the MapboxLayerType
     *                                                   and the Mapbox Layer Paint
     */
    getStyleFromSymbolizer(symbolizer: Symbolizer): { layerType: MapboxLayerType; paint: any; layout: any; } {
        const symbolizerClone = _cloneDeep(symbolizer);
        let layerType: MapboxLayerType;
        let paint: any;
        let layout: any;
        switch (symbolizer.kind) {
            case 'Fill':
                layerType = 'fill';
                paint = this.getPaintFromFillSymbolizer(symbolizerClone as FillSymbolizer);
                layout = this.getLayoutFromFillSymbolizer(symbolizerClone as FillSymbolizer);
                break;
            case 'Line':
                layerType = 'line';
                paint = this.getPaintFromLineSymbolizer(symbolizerClone as LineSymbolizer);
                layout = this.getLayoutFromLineSymbolizer(symbolizerClone as LineSymbolizer);
                break;
            case 'Icon':
                layerType = 'symbol';
                paint = this.getPaintFromIconSymbolizer(symbolizerClone as IconSymbolizer);
                layout = this.getLayoutFromIconSymbolizer(symbolizerClone as IconSymbolizer);
                break;
            case 'Text':
                layerType = 'symbol';
                paint = this.getPaintFromTextSymbolizer(symbolizerClone as TextSymbolizer);
                layout = this.getLayoutFromTextSymbolizer(symbolizerClone as TextSymbolizer);
                break;
            case 'Mark':
                if (symbolizer.wellKnownName === 'Circle') {
                    layerType = 'circle';
                    paint = this.getPaintFromCircleSymbolizer(symbolizerClone as MarkSymbolizer);
                    layout = this.getLayoutFromCircleSymbolizer(symbolizerClone as MarkSymbolizer);
                    break;
                } else {
                    throw new Error(`Cannot get Style. Unsupported MarkSymbolizer`);
                }

            // TODO check if mapbox can generate regular shapes
            default:
                throw new Error(`Cannot get Style. Unsupported kind.`);
        }
        return {
            layerType,
            paint,
            layout
        };
    }

    /**
     * Creates a Mapbox Layer Paint object from a GeostylerStyle-FillSymbolizer
     *
     * @param {FillSymbolizer} symbolizer A GeostylerStyle-FillSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromFillSymbolizer(symbolizer: FillSymbolizer): any {
        const {
            opacity,
            color,
            outlineColor,
            graphicFill,
            antialias,
            translate,
            translateAnchor
        } = symbolizer;

        const paint: any = {
            'fill-antialias': antialias,
            'fill-opacity': opacity,
            'fill-color': color,
            'fill-outline-color': outlineColor,
            'fill-translate': translate,
            'fill-translate-anchor': translateAnchor,
            'fill-pattern': this.getPatternOrGradientFromPointSymbolizer(graphicFill)
        };
        return paint;
    }

    /**
     * Creates a Mapbox Layer Layout object from a GeostylerStyle-FillSymbolizer
     *
     * @param {FillSymbolizer} symbolizer A GeostylerStyle-FillSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromFillSymbolizer(symbolizer: FillSymbolizer): any {
        const {
            visibility
        } = symbolizer;

        const layout: any = {
            'visibility': this.getVisibility(visibility)
        };
        return layout;
    }

    /**
     * Creates a fill pattern or gradient from a GeoStylerStyle-Symbolizer
     *
     * @param {PointSymbolizer|undefined} symbolizer The Symbolizer that is being used for pattern or gradient
     * @return {string|undefined} The name of the sprite or undefined, if no image source was specified
     */
    getPatternOrGradientFromPointSymbolizer(symbolizer: (PointSymbolizer | undefined)): (string | undefined) {
        if (!symbolizer) {
            return undefined;
        }
        if (symbolizer.kind !== 'Icon') {
            throw new Error(`Cannot parse pattern or gradient. Mapbox only supports Icons.`);
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
    handleSprite(path: string): (string|undefined) {
        let spritename: string = '';
        let baseurl: string = '';
        const query = path.split('?')[1];
        if (query.length === 0) {
            return ;
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

        this._spriteBaseUrl = baseurl;
        return spritename;
    }

    /**
     * Transforms the visibility attribute of a GeoStylerStyle-Symbolizer to a Mapbox visibility attribute
     *
     * @param {boolean|undefined} visibility The visibility of a layer
     * @return {'none'|'visible'|undefined} The Mapbox visibility attribute. If undefined Mapbox's default will be used
     */
    getVisibility(visibility: boolean | undefined): 'none' | 'visible' | undefined {
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
     * @param {LineSymbolizer} symbolizer A GeoStylerStyle-LineSymbolizer
     * @return {any} A Mapbox Layer Paint object
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
            gradient,
            translate,
            translateAnchor
        } = symbolizer;

        const paint: any = {
            'line-opacity': opacity,
            'line-color': color,
            'line-translate': translate,
            'line-translate-anchor': translateAnchor,
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
     * @param {LineSymbolizer} symbolizer A GeoStylerStyle-LineSymbolizer
     * @return {any} A Mapbox Layer Layout object
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
            'visibility': this.getVisibility(visibility)
        };
        return layout;
    }

    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-IconSymbolizer
     *
     * @param {IconSymbolizer} symbolizer A GeoStylerStyle-IconSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromIconSymbolizer(symbolizer: IconSymbolizer): any {
        const {
            haloBlur,
            haloColor,
            haloWidth,
            color,
            opacity,
            translate,
            translateAnchor,
        } = symbolizer;

        const paint: any = {
            'icon-opacity': opacity,
            'icon-color': color,
            'icon-halo-color': haloColor,
            'icon-halo-width': haloWidth,
            'icon-halo-blur': haloBlur,
            'icon-translate': translate,
            'icon-translate-anchor': translateAnchor
        };
        return paint;
    }

    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-IconSymbolizer
     *
     * @param {IconSymbolizer} symbolizer A GeoStylerStyle-IconSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromIconSymbolizer(symbolizer: IconSymbolizer): any {
        const {
            spacing,
            avoidEdges,
            allowOverlap,
            ignorePlacement,
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
            'symbol-spacing': spacing,
            'symbol-avoid-edges': avoidEdges,
            'icon-allow-overlap': allowOverlap,
            'icon-ignore-placement': ignorePlacement,
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
            'visibility': this.getVisibility(visibility)
        };
        return layout;
    }

    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-TextSymbolizer
     *
     * @param {TextSymbolizer} symbolizer A GeoStylerStyle TextSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromTextSymbolizer(symbolizer: TextSymbolizer): any {
        const {
            haloBlur,
            haloColor,
            haloWidth,
            color,
            opacity,
            translate,
            translateAnchor
        } = symbolizer;

        const paint: any = {
            'text-opacity': opacity,
            'text-color': color,
            'text-halo-color': haloColor,
            'text-halo-width': haloWidth,
            'text-halo-blur': haloBlur,
            'text-translate': translate,
            'text-translate-anchor': translateAnchor
        };

        return paint;
    }

    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-TextSymbolizer
     *
     * @param {TextSymbolizer} symbolizer A GeoStylerStyle TextSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromTextSymbolizer(symbolizer: TextSymbolizer): any {
        const {
            allowOverlap,
            anchor,
            label,
            font,
            ignorePlacement,
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
            spacing,
            visibility
        } = symbolizer;

        const paint: any = {
            'symbol-spacing': spacing,
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
            'text-ignore-placement': ignorePlacement,
            'text-optional': optional,
            'visibility': this.getVisibility(visibility)
        };

        return paint;
    }

    /**
     * Creates a Mapbox text Format from a GeoStylerStyle-TextSymbolizer Label
     *
     * @param {string} template A GeoStylerStyle-TextSymbolizer Label
     * @return {string|any[]} The static text as string if no template was used, or
     *                        a Mapbox text Format array
     */
    getTextFieldFromLabel(template: string): (string | any[]) {
        // prefix indicating that a template is being used
        const prefix: string = '\\{\\{';
        // suffix indicating that a template is being used
        const suffix: string = '\\}\\}';
        // RegExp to match all occurences encapsuled between two curly braces
        // including the curly braces
        let regExp: RegExp = new RegExp(prefix + '.*?' + suffix, 'g');
        let regExpRes = template.match(regExp);

        // if no template was used, return as fix string
        if (!regExpRes) {
            return template;
            // if templates are being used
        } else {
            // split the original string before the occurence of a placeholder
            const regLookAhead = new RegExp('(?=' + prefix + '.*?' + suffix + ')', 'g');
            const literalsWEmptyStrings = template.split(regLookAhead);
            // mapbox format
            const format: any[] = ['format'];
            literalsWEmptyStrings.forEach((lit: string) => {
                if (lit.startsWith('{{')) {
                    const delimiter = lit.indexOf('}}');
                    const placeholder = lit.substring(2, delimiter);
                    const text = lit.substring(delimiter + 2);
                    format.push(['get', placeholder], {});
                    if (text.length > 0) {
                        format.push(text, {});
                    }
                } else {
                    format.push(lit, {});
                }
            });

            return format;
        }
    }

    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-MarkSymbolizer
     * that uses the wellKnownName 'circle'. This one will be handled explicitly
     * because mapbox has a dedicated layer type for circles. Other shapes are covered
     * in layer type 'symbol' using fonts.
     *
     * @param {MarkSymbolizer} symbolizer A GeoStylerStyle MarkSymbolizer with wkn 'circle'
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromCircleSymbolizer(symbolizer: MarkSymbolizer): any {
        const {
            radius,
            color,
            blur,
            opacity,
            translate,
            translateAnchor,
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
            'circle-opacity': opacity,
            'circle-translate': translate,
            'circle-translate-anchor': translateAnchor,
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
     * @param {MarkSymbolizer} symbolizer A GeoStylerStyle MarkSymbolizer with wkn 'circle'
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromCircleSymbolizer(symbolizer: MarkSymbolizer): any {
        const {
            visibility
        } = symbolizer;

        const layout = {
            'visibility': visibility
        };
        return layout;
    }
}

export default MapboxStyleParser;
