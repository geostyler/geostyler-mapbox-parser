/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_lookup: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Expression Lookup',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'circle',
      paint: {
        'circle-radius': ['length', 'peter']
      }
    },
    {
      id: 'r1_sy0_st0',
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
