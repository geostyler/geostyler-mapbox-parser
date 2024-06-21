/* eslint-disable @typescript-eslint/naming-convention */
import { Style } from 'geostyler-style';

const gsExpressionInterpolate: Style = {
  name: 'Expression Interpolate',
  rules: [{
    name: 'earthquake_circle',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: '#000000',
      fillOpacity: 0.6,
      radius: {
        name: 'interpolate',
        args: [{
          name: 'linear'
        }, {
          name: 'property',
          args: ['population']
        }, {
          stop: 12,
          value: 2
        }, {
          stop: 15,
          value: 4
        }, {
          stop: 19,
          value: 35
        }]
      }
    }]
  }],
  metadata: {
    'mapbox:ref': {
      sources: {
        testsource: {
          type: 'vector'
        }
      },
      sourceMapping: {
        testsource: [0]
      },
      sourceLayerMapping: {
        foo: [0]
      }
    }
  }
};

export default gsExpressionInterpolate;
