import {
  Expression as GeoStylerExpression,
  GeoStylerFunction,
  PropertyType,
  isGeoStylerFunction
} from 'geostyler-style';
import { invert } from 'lodash';
import {
  ExpressionName,
  Expression as MapboxExpression,
  StyleFunction
} from 'mapbox-gl';

const functionNameMap: Record<GeoStylerFunction['name'], ExpressionName | null> = {
  // ---- string ----
  numberFormat: 'number-format',
  strAbbreviate: null,
  strCapitalize: null,
  strConcat: 'concat',
  strDefaultIfBlank: null,
  strEndsWith: null,
  strEqualsIgnoreCase: null,
  strIndexOf: null,
  strLastIndexOf: null,
  strLength: 'length',
  strMatches: null,
  strReplace: null,
  strStartsWith: null,
  strStripAccents: null,
  strSubstring: 'slice',
  strSubstringStart: null,
  strToLowerCase: 'downcase',
  strToUpperCase: 'upcase',
  strTrim: null,
  // ---- number ----
  abs: 'abs',
  acos: 'acos',
  asin: 'asin',
  atan: 'atan',
  atan2: null,
  ceil: 'ceil',
  cos: 'cos',
  exp: 'e',
  floor: 'floor',
  log: 'ln',
  // – : 'ln2'
  // – : 'log10'
  // – : 'log2'
  max: 'max',
  min: 'min',
  modulo: '%',
  pi: 'pi',
  // - : 'e',
  pow: '^',
  random: null,
  rint: null,
  round: 'round',
  sin: 'sin',
  sqrt: 'sqrt',
  tan: 'tan',
  toDegrees: null,
  toRadians: null,
  // ---- boolean ----
  between: 'within',
  double2bool: null,
  in: 'in',
  parseBoolean: 'to-boolean',
  // ---- unknown ----
  property: 'get'
};

const invertedFunctionNameMap: Partial<Record<ExpressionName, GeoStylerFunction['name']>> =
  invert(functionNameMap);

export function gs2mbExpression<T extends PropertyType>(gsExpression?: GeoStylerExpression<T>):
  MapboxExpression | T | undefined {
  if (!isGeoStylerFunction(gsExpression)) {
    return gsExpression as T;
  }

  const args = 'args' in gsExpression ? gsExpression.args : [];

  // special handling
  switch (gsExpression.name) {
    case 'pi':
      return ['pi'];
    default:
      const mapboxFunctionName = functionNameMap[gsExpression.name];
      if (!mapboxFunctionName) {
        throw new Error('Could not translate GeoStyler Expression: ' + gs2mbExpression);
      }
      return [mapboxFunctionName, ...args] as MapboxExpression;
  }

}

type MbInput = MapboxExpression | PropertyType | StyleFunction;

export function mb2gsExpression<T extends PropertyType>(mbExpression?: MbInput):
  GeoStylerExpression<T> | undefined {

  // TODO: is this check valid ?
  // fails for arrays like offset = [10, 20]
  if (!(Array.isArray(mbExpression) && mbExpression[0])) {
    return mbExpression as GeoStylerExpression<T> | undefined;
  }

  const mapBoxExpressionName = mbExpression[0];
  const args = mbExpression.slice(1);
  let func: GeoStylerFunction;

  // special handling
  switch (mapBoxExpressionName) {
    default:
      const gsFunctionName = invertedFunctionNameMap[mapBoxExpressionName];
      if (!gsFunctionName) {
        throw new Error('Could not translate MapboxExpression: ' + mbExpression);
      }
      func = {
        name: gsFunctionName,
        args
      };
      break;
  }

  return func as GeoStylerExpression<T>;
}
