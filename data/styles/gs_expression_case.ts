/* eslint-disable @typescript-eslint/naming-convention */
import { Style } from 'geostyler-style';

const gs_expression_case: Style = {
  name: 'Expression Case',
  rules: [{
    name: 'earthquake_circle',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: ['#e31a1c', {
          case: {
            name: 'lessThan',
            args: [{
              name: 'property',
              args: ['mag']
            },
            2]
          },
          value: '#fed976'
        }, {
          case: {
            name: 'all',
            args: [{
              name: 'greaterThanOrEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              },
              2]
            }, {
              name: 'lessThan',
              args: [{
                name: 'property',
                args: ['mag']
              },
              3]
            }]
          },
          value:'#feb24c'
        }, {
          case: {
            name: 'all',
            args: [{
              name: 'greaterThanOrEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              },
              3]
            }, {
              name: 'lessThan',
              args: [{
                name: 'property',
                args: ['mag']
              },
              4]
            }]
          },
          value:'#fd8d3c'
        }, {
          case: {
            name: 'all',
            args: [{
              name: 'greaterThanOrEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              },
              4]
            }, {
              name: 'lessThan',
              args: [{
                name: 'property',
                args: ['mag']
              },
              5]
            }]
          },
          value:'#fc4e2a'
        }]
      },
      radius: 12,
      fillOpacity: 0.6
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

export default gs_expression_case;
