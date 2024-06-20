import { Sprite, Symbolizer, TextSymbolizer } from 'geostyler-style';
import { MapboxRef } from '../MapboxStyleParser';

class MapboxStyleUtil {

  public static getResolutions(): number[] {
    const resolutions = [];
    let res = 78271.51696402048;
    // adding resolution for arbitrary zoom level 0
    // This simplyfies working with zoom levels but might lead to unexpected
    // behaviour.
    resolutions.push(res * 2);
    for (res; resolutions.length <= 24; res /= 2) {
      resolutions.push(res);
    }
    return resolutions;
  }
  // credits to
  // https://github.com/terrestris/ol-util/blob/de1b580c63454c8110806a3d73a5f6e972b2f2b0/src/MapUtil/MapUtil.js#L104
  public static getScaleForResolution(resolution: number): number {
    var dpi = 25.4 / 0.28;
    var mpu = 1;
    var inchesPerMeter = 39.37008;

    return resolution * mpu * inchesPerMeter * dpi;
  }

  // credits to
  // https://github.com/openlayers/ol-mapbox-style/blob/e632c935e7e34bd27079b7fc234202a9ac3b73ee/util.js
  public static getZoomForResolution(resolution: number): number {
    let i = 0;
    const resolutions = MapboxStyleUtil.getResolutions();
    const ii = resolutions.length;
    for (; i < ii; ++i) {
      const candidate = resolutions[i];
      if (candidate < resolution && i + 1 < ii) {
        const zoomFactor = resolutions[i] / resolutions[i + 1];
        return i + Math.log(resolutions[i] / resolution) / Math.log(zoomFactor);
      }
    }
    return ii - 1;
  }

  /**
   * Calculates the appropriate map resolution for a given scale in the given
   * units.
   *
   * See: https://gis.stackexchange.com/questions/158435/
   * how-to-get-current-scale-in-openlayers-3
   *
   * @method
   * @param {number} scale The input scale to calculate the appropriate
   *                       resolution for.
   * @return {number} The calculated resolution.
   */
  static getResolutionForScale(scale: number): number {
    let dpi = 25.4 / 0.28;
    let mpu = 1;
    let inchesPerMeter = 39.37008;

    return scale / (mpu * inchesPerMeter * dpi);
  }

  public static zoomToScale(zoom: number): number {
    const resolutions = MapboxStyleUtil.getResolutions();
    // if zoom is integer
    if (zoom >= resolutions.length) {
      throw new Error('Cannot parse scaleDenominator. ZoomLevel does not exist.');
    }
    let resolution: number;
    if (Number.isInteger(zoom)) {
      resolution = resolutions[zoom];
    } else {
      // interpolate values
      const pre = Math.floor(zoom);
      const preVal = resolutions[pre];
      // after carefully rearranging
      // zoom = i + Math.log(resolutions[i] / resolution) / Math.log(zoomFactor)
      // with the zoomFactor being 2 I've arrived at this formula to properly
      // calculate the resolution:
      resolution = Math.pow(2, pre) * preVal / Math.pow(2, zoom);
      // this still gives some smallish rounding errors, but at the 8th digit after
      // the dot this is ok
    }
    return this.getScaleForResolution(resolution);
  }

  /**
   * Checks if all keys of an object are undefined.
   * Returns true if so.
   *
   * @param obj The object to be checked
   */
  public static allUndefined(obj: any): boolean {
    if (!obj) {
      return true;
    }
    const keys = Object.keys(obj);
    return !keys.some((k: string) => {
      return typeof obj[k] !== 'undefined';
    });
  }

  /**
   * Checks if all keys of a Symbolizer are undefined except 'kind'.
   *
   * @param symbolizer A GeoStylerStyle Symbolizer
   */
  // TODO: TextSymbolizer can be removed once it is fixed in the geostyler-style
  public static symbolizerAllUndefined(symbolizer: Symbolizer | TextSymbolizer): boolean {
    return !Object.keys(symbolizer)
      .filter(val => val !== 'kind' && val !== 'visibility')
      .some((val: keyof Symbolizer) => typeof symbolizer[val] !== 'undefined');
  }

  /**
   * Replaces the mapbox api placeholder with its actual url.
   *
   * @param url URL
   */
  public static getUrlForMbPlaceholder(url: string): string {
    const mbPlaceholder = 'mapbox://';
    const mbUrl = 'https://api.mapbox.com/';
    if (url && url.startsWith(mbPlaceholder)) {
      return url.replace(mbPlaceholder, mbUrl);
    }
    return url;
  }

  /**
   * Replaces the actual mapbox url with its api placeholder.
   *
   * @param url URL
   */
  public static getMbPlaceholderForUrl(url: string): string {
    const mbPlaceholder = 'mapbox://';
    const mbUrl = 'https://api.mapbox.com/';
    if (url && url.startsWith(mbUrl)) {
      return url.replace(mbUrl, mbPlaceholder);
    }
    return url;
  }

  /**
   * Resolves a mapbox text-field placeholder string to a geostyler-style
   * placeholder string. I.e. replaces {varname} with {{varname}}.
   *
   * @param template Template string that should be resolved
   */
  public static resolveMbTextPlaceholder(template: string): string {
    // prefix indicating that a template is being used
    const prefix: string = '\\{';
    // suffix indicating that a template is being used
    const suffix: string = '\\}';

    let regExp: RegExp = new RegExp(prefix + '.*?' + suffix, 'g');
    const gsLabel = template.replace(regExp, (match: string) => {
      return `{${match}}`;
    });
    return gsLabel;
  }

  public static getSpriteName(sprite: Sprite, metadata: MapboxRef): string {
    if (!metadata?.sprite || !sprite) {
      throw new Error('Cannot retrieve sprite name. Sprite or metadata missing.');
    }
    const name = Object.keys(metadata.sprite)
      .find(key => {
        const value = metadata.sprite![key];
        return value.position[0] === sprite.position[0] &&
          value.position[1] === sprite.position[1] &&
          value.size[0] === sprite.size[0] &&
          value.size[1] === sprite.size[1];
      });
    if (!name) {
      throw new Error('Cannot retrieve sprite name. No matching sprite in metadata.');
    }
    return name || '';
  }

  /**
   * Splits a RGBA encoded color into its color values.
   *
   * @param {string} rgbaColor RGB(A) encoded color
   * @return {number[]} Numeric color values as array
   */
  public static splitRgbaColor(rgbaColor: string): number[] {
    const colorsOnly = rgbaColor.substring(rgbaColor.indexOf('(') + 1, rgbaColor.lastIndexOf(')')).split(/,\s*/);
    const red = parseInt(colorsOnly[0], 10);
    const green = parseInt(colorsOnly[1], 10);
    const blue = parseInt(colorsOnly[2], 10);
    const opacity = parseFloat(colorsOnly[3]);

    return [red, green, blue, opacity];
  }

  /**
   * Returns the hex code for a given RGB(A) array.
   *
   * @param colorArr RGB(A) array. e.g. [255,0,0]
   * @return {string} The HEX color representation of the given color
   */
  public static getHexCodeFromRgbArray(colorArr: number[]): string {
    return '#' + colorArr.map((x, idx) => {
      const hex = x.toString(16);
      // skip opacity if passed as fourth entry
      if (idx < 3) {
        return hex.length === 1 ? '0' + hex : hex;
      }
      return '';
    }).join('');
  }

  /**
   * Transforms a RGB(A) or named color value to a HEX encoded notation.
   * If a HEX color is provided it will be returned untransformed.
   *
   * @param {string} inColor The color to transform
   * @return {string | undefined} The HEX color representation of the given color
   */
  public static getHexColor(inColor: string): string | undefined {
    // if passing in a hex code we just return it
    if (inColor.startsWith('#')) {
      return inColor;
    } else if (inColor.startsWith('rgb')) {
      const colorArr = this.splitRgbaColor(inColor);
      return this.getHexCodeFromRgbArray(colorArr);
    } else {
      return;
    }
  }

}

export default MapboxStyleUtil;
