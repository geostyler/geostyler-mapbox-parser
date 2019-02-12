import { Symbolizer } from 'geostyler-style';

class MapboxStyleUtil {

  // credits to
  // https://github.com/boundlessgeo/ol-mapbox-style/blob/e11bb81efbc242b907963fba569fd35091ed3aaf/stylefunction.js#L160
  public static resolutions = [78271.51696402048, 39135.75848201024,
    19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564,
    1222.99245256282, 611.49622628141, 305.748113140705, 152.8740565703525,
    76.43702828517625, 38.21851414258813, 19.109257071294063, 9.554628535647032,
    4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395,
    0.29858214173896974, 0.14929107086948487, 0.07464553543474244];

  // credits to
  // https://github.com/terrestris/ol-util/blob/de1b580c63454c8110806a3d73a5f6e972b2f2b0/src/MapUtil/MapUtil.js#L104
  public static getScaleForResolution(resolution: number): number {
    var dpi = 25.4 / 0.28;
    var mpu = 1;
    var inchesPerMeter = 39.37;

    return resolution * mpu * inchesPerMeter * dpi;
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
    let inchesPerMeter = 39.37;

    return scale / (mpu * inchesPerMeter * dpi);
  }

  public static zoomToScale(zoom: number): number {
    // if zoom is integer
    if (zoom >= MapboxStyleUtil.resolutions.length) {
      throw new Error(`Cannot parse scaleDenominator. ZoomLevel does not exist.`);
    }
    let resolution: number;
    if (Number.isInteger(zoom)) {
      resolution = MapboxStyleUtil.resolutions[zoom];
    } else {
      // interpolate values
      const pre = Math.floor(zoom);
      const post = Math.ceil(zoom);
      const preVal = MapboxStyleUtil.resolutions[pre];
      const postVal = MapboxStyleUtil.resolutions[post];
      const range = preVal - postVal;
      const decimal = zoom % 1;
      resolution = preVal - (range * decimal);
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
  public static symbolizerAllUndefined (symbolizer: Symbolizer): boolean {
    return !Object.keys(symbolizer)
      .filter((val: string) => val !== 'kind')
      .some((val: string) => typeof symbolizer[val] !== 'undefined');
  }

  /**
   * Replaces the mapbox api placeholder with its actual url.
   *
   * @param url URL
   */
  public static getUrlForMbPlaceholder (url: string): string {
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
  public static getMbPlaceholderForUrl (url: string): string {
    const mbPlaceholder = 'mapbox://';
    const mbUrl = 'https://api.mapbox.com/';
    if (url && url.startsWith(mbUrl)) {
      return url.replace(mbUrl, mbPlaceholder);
    }
    return url;
  }

  // // source: https://github.com/mapbox/mapbox-gl-js/blob/master/src/util/mapbox.js#L143
  // static urlRe = /^(\w+):\/\/([^/?]*)(\/[^?]+)?\??(.+)?/;
  // public static parseUrl(url: string): {protocol: string; authority: string; path: string; params: string[]} {
  //     const parts = url.match(this.urlRe);
  //     if (!parts) {
  //         throw new Error('Unable to parse URL object');
  //     }
  //     return {
  //         protocol: parts[1],
  //         authority: parts[2],
  //         path: parts[3] || '/',
  //         params: parts[4] ? parts[4].split('&') : []
  //     };
  // }

  // // source: https://github.com/mapbox/mapbox-gl-js/blob/master/src/util/mapbox.js#L82
  // public static normalizeSpriteURL(url: string, format: string, extension: string, accessToken?: string): string {
  //   const urlObject = MapboxStyleUtil.parseUrl(url);
  //   if (url.indexOf('mapbox:') !== 0) {
  //     throw new Error(`Cannot parse Url. Url is not a mapbox url.`);
  //   }
  //   urlObject.path = `/styles/v1${urlObject.path}/sprite${format}${extension}`;
  //   // return makeAPIURL(urlObject, accessToken);
  //   return `https://api.mapbox.com${urlObject.path}${urlObject.params}`;
  // }
}

export default MapboxStyleUtil;
