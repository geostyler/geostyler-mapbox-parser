/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_lookup: MbStyle = {
  version: 8,
  name: 'Expression Lookup',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'r0_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['length', 'peter']
      }
    },
    {
      id: 'r1_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'symbol',
      layout: {
        'text-field': ['slice', 'peter', 0, 2]
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'length',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }, {
        name: 'slice',
        symbolizers: [
          [
            'r1_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default expression_lookup;
