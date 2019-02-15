import { Symbolizer } from 'geostyler-style';

class MapboxStyleUtil {

  public static getResolutions(): number[] {
    const resolutions = [];
    let res = 78271.51696402048;
    // adding resolution for arbitrary zoom level 0
    // This simplyfies working with zoom levels but might lead to unexpected
    // behaviour.
    resolutions.push(res * 2);
    for (res; resolutions.length < 22; res /= 2) {
      resolutions.push(res);
    }
    return resolutions;
  }
  // credits to
  // https://github.com/terrestris/ol-util/blob/de1b580c63454c8110806a3d73a5f6e972b2f2b0/src/MapUtil/MapUtil.js#L104
  public static getScaleForResolution(resolution: number): number {
    var dpi = 25.4 / 0.28;
    var mpu = 1;
    var inchesPerMeter = 39.37;

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
    let inchesPerMeter = 39.37;

    return scale / (mpu * inchesPerMeter * dpi);
  }

  public static zoomToScale(zoom: number): number {
    const resolutions = MapboxStyleUtil.getResolutions();
    // if zoom is integer
    if (zoom >= resolutions.length) {
      throw new Error(`Cannot parse scaleDenominator. ZoomLevel does not exist.`);
    }
    let resolution: number;
    if (Number.isInteger(zoom)) {
      resolution = resolutions[zoom];
    } else {
      // interpolate values
      const pre = Math.floor(zoom);
      const post = Math.ceil(zoom);
      const preVal = resolutions[pre];
      const postVal = resolutions[post];
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
  public static symbolizerAllUndefined(symbolizer: Symbolizer): boolean {
    return !Object.keys(symbolizer)
      .filter((val: string) => val !== 'kind')
      .some((val: string) => typeof symbolizer[val] !== 'undefined');
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
  public static getMbPlaceholderForUrl (url: string): string {
    const mbPlaceholder = 'mapbox://';
    const mbUrl = 'https://api.mapbox.com/';
    if (url && url.startsWith(mbUrl)) {
      return url.replace(mbUrl, mbPlaceholder);
    }
    return url;
  }
}

export default MapboxStyleUtil;
