import {
  Expression as GeoStylerExpression,
  GeoStylerFunction,
  isGeoStylerFunction
} from 'geostyler-style';
import { invert } from 'lodash';
import {
  ExpressionName,
  Expression as MapboxExpression,
  StyleFunction
} from 'mapbox-gl';

type DataType = number | string | boolean;

const functionNameMap: Partial<Record<GeoStylerFunction['name'], ExpressionName>> = {
  // ---- string ----
  numberFormat: 'number-format',
  // strAbbreviate: -,
  // strCapitalize: -,
  strConcat: 'concat',
  // strDefaultIfBlank: -
  // strEndsWith: -
  // strEqualsIgnoreCase: -
  // strIndexOf: -
  // strLastIndexOf: -
  strLength: 'length',
  // strMatches: -
  // strReplace: -
  // strStartsWith: -
  // strStripAccents: -
  // strSubstringStart: -
  // strTrim: -
  strToLowerCase: 'downcase',
  strToUpperCase: 'upcase',
  // ---- number ----
  abs: 'abs',
  // atan2: -
  acos: 'acos',
  asin: 'asin',
  atan: 'atan',
  ceil: 'ceil',
  cos: 'cos',
  exp: 'e',
  floor: 'floor',
  log: 'ln',
  // – : 'ln2'
  // – : 'log10'
  // – : 'log2'
  max: 'max',
  // modulo: -
  min: 'min',
  pi: 'pi',
  round: 'round',
  sin: 'sin',
  sqrt: 'sqrt',
  tan: 'tan',
  // ---- boolean ----
  in: 'in',
  // between: 'within'
  // parseBoolean: -
};

const invertedFunctionNameMap: Partial<Record<ExpressionName, GeoStylerFunction['name']>> =
  invert(functionNameMap);

export function gs2mbExpression<T extends DataType>(gsExpression?: GeoStylerExpression<T>):
  MapboxExpression | T | undefined {
  if (!isGeoStylerFunction(gsExpression)) {
    return gsExpression as T;
  }
  const mapboxFunctionName = functionNameMap[gsExpression.name];
  if (!mapboxFunctionName) {
    throw new Error('Could not translate GeoStyler Expression: ' + gs2mbExpression);
  }
  const hasArguments = !(gsExpression.name === 'pi' || gsExpression.name === 'random');
  let args = hasArguments ? gsExpression.args : [];

  // TODO: add special handling of none matching arguments

  return [mapboxFunctionName, ...args] as MapboxExpression;
}

type MbInput = MapboxExpression | DataType | StyleFunction;

export function mb2gsExpression<T extends DataType>(mbExpression?: MbInput):
  GeoStylerExpression<T> | undefined {

  // TODO: is this check valid ?
  // fails for arrays like offset = [10, 20]
  if (!(Array.isArray(mbExpression) && mbExpression[0])) {
    return mbExpression as GeoStylerExpression<T> | undefined;
  }

  const gsFunctionName = invertedFunctionNameMap[mbExpression[0]];
  if (!gsFunctionName) {
    throw new Error('Could not translate MapboxExpression: ' + mbExpression);
  }
  const args = mbExpression.slice(1);

  // TODO: add special handling of none matching arguments

  return {
    name: gsFunctionName,
    args
  } as GeoStylerExpression<T>;
}
