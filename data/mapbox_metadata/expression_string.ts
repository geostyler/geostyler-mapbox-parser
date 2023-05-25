/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_string: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Expression String',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'symbol',
      layout: {
        'text-field': [
          'concat',
          'Lukas',
          ' ',
          'Podolski'
        ]
      }
    }, {
      id: 'r1_sy0_st0',
      type: 'symbol',
      layout: {
        'text-field': [
          'downcase',
          'Peter'
        ]
      }
    }, {
      id: 'r2_sy0_st0',
      type: 'symbol',
      layout: {
        'text-field': [
          'upcase',
          'peter'
        ]
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'concat',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }, {
        name: 'downcase',
        symbolizers: [
          [
            'r1_sy0_st0'
          ]
        ]
      }, {
        name: 'upcase',
        symbolizers: [
          [
            'r2_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default expression_string;
