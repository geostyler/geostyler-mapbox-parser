import {
  Expression,
  Fcase,
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

const expressionNames: ExpressionName[] = ['array',
  'boolean',
  'collator',
  'format',
  'literal',
  'number',
  'number-format',
  'object',
  'string',
  'image',
  'to-boolean',
  'to-color',
  'to-number',
  'to-string',
  'typeof',
  'feature-state',
  'geometry-type',
  'id',
  'line-progress',
  'properties',
  'at',
  'get',
  'has',
  'in',
  'index-of',
  'length',
  'slice',
  '!',
  '!=',
  '<',
  '<=',
  '==',
  '>',
  '>=',
  'all',
  'any',
  'case',
  'match',
  'coalesce',
  'within',
  'interpolate',
  'interpolate-hcl',
  'interpolate-lab',
  'step',
  'let',
  'var',
  'concat',
  'downcase',
  'is-supported-script',
  'resolved-locale',
  'upcase',
  'rgb',
  'rgba',
  'to-rgba',
  '-',
  '*',
  '/',
  '%',
  '^',
  '+',
  'abs',
  'acos',
  'asin',
  'atan',
  'ceil',
  'cos',
  'e',
  'floor',
  'ln',
  'ln2',
  'log10',
  'log2',
  'max',
  'min',
  'pi',
  'round',
  'sin',
  'sqrt',
  'tan',
  'zoom',
  'heatmap-density'];

const functionNameMap: Record<GeoStylerFunction['name'], ExpressionName | null> = {
  // ---- string ----
  numberFormat: null,
  // numberFormat: 'number-format', // TODO: this could be done in theory but gs and mb use different format approaches
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
  add: '+',
  abs: 'abs',
  acos: 'acos',
  asin: 'asin',
  atan: 'atan',
  atan2: null,
  ceil: 'ceil',
  cos: 'cos',
  div: '/',
  exp: 'e',
  floor: 'floor',
  log: 'ln',
  // – : 'ln2'
  // – : 'log10'
  // – : 'log2'
  max: 'max',
  min: 'min',
  modulo: '%',
  mul: '*',
  pi: 'pi',
  // - : 'e',
  pow: '^',
  random: null,
  rint: null,
  round: 'round',
  sin: 'sin',
  sqrt: 'sqrt',
  sub: '-',
  tan: 'tan',
  toDegrees: null,
  toRadians: null,
  // ---- boolean ----
  all: 'all',
  // eslint-disable-next-line id-blacklist
  any: 'any',
  between: 'within',
  double2bool: null,
  equalTo: '==',
  greaterThan: '>',
  greaterThanOrEqualTo: '>=',
  in: 'in',
  lessThan: '<',
  lessThanOrEqualTo: '<=',
  not: '!',
  notEqualTo: '!=',
  parseBoolean: 'to-boolean',
  // ---- unknown ----
  case: 'case',
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
    case 'case':
      const mbArgs: any = [];
      args.forEach((arg: any, index: number) => {
        if (index === (args.length - 1)) {
          mbArgs.push(gs2mbExpression(arg));
        } else if (arg.case && arg.value) {
          mbArgs.push(gs2mbExpression(arg.case));
          mbArgs.push(gs2mbExpression(arg.value));
        } else {
          throw new Error('Could not translate GeoStyler Expression: ' + gs2mbExpression);
        }
      });
      return ['case', ...mbArgs];
    case 'exp':
      if (args[0] === 1) {
        return ['e'];
      }
      break;
    case 'pi':
      return ['pi'];
    default:
      const mapboxFunctionName = functionNameMap[gsExpression.name];
      if (!mapboxFunctionName) {
        throw new Error('Could not translate GeoStyler Expression: ' + gsExpression);
      }
      return [mapboxFunctionName, ...args.map(arg => gs2mbExpression(arg))] as MapboxExpression;
  }

  throw new Error('Could not translate GeoStyler Expression: ' + gsExpression);

}

type MbInput = MapboxExpression | PropertyType | StyleFunction;

export function mb2gsExpression<T extends PropertyType>(mbExpression?: MbInput):
  GeoStylerExpression<T> | undefined {

  // TODO: is this check valid ?
  // fails for arrays like offset = [10, 20]
  if (!(Array.isArray(mbExpression) && expressionNames.includes(mbExpression[0]))) {
    return mbExpression as GeoStylerExpression<T> | undefined;
  }

  const mapboxExpressionName: ExpressionName = mbExpression[0];
  const args: Expression<PropertyType>[] = mbExpression.slice(1);
  let func: GeoStylerFunction;

  // special handling
  switch (mapboxExpressionName) {
    case 'e':
      func = {
        name: 'exp',
        args: [1]
      };
      break;
    case 'case':
      const gsArgs: any[] = [];
      args.forEach((a, index) => {
        if (index < (args.length -  1)) {
          var gsIndex = index < 2 ? 0 : Math.floor(index / 2);
          if (!gsArgs[gsIndex]) {
            gsArgs[gsIndex] = {};
          }
          if (index % 2 === 0) {
            gsArgs[gsIndex] = {
              case: mb2gsExpression(a)
            };
          } else {
            gsArgs[gsIndex] = {
              ...gsArgs[gsIndex] as any,
              value: mb2gsExpression(a)
            };
          }
        }
      });
      gsArgs.push(mbExpression.at(- 1));
      func = {
        name: 'case',
        args: gsArgs as Fcase['args']
      };
      break;
    case 'pi':
      func = {
        name: 'pi'
      };
      break;
    default:
      const gsFunctionName = invertedFunctionNameMap[mapboxExpressionName];
      if (!gsFunctionName) {
        throw new Error('Could not translate Mapbox Expression: ' + mbExpression);
      }
      func = {
        name: gsFunctionName,
        args: args.map(mb2gsExpression)
      } as GeoStylerFunction;
      break;
  }

  return func as GeoStylerExpression<T>;
}
