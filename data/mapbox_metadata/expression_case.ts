/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_case: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Expression Case',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['<', ['get', 'mag'], 2],
          '#fed976',
          ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 3]],
          '#feb24c',
          ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 4]],
          '#fd8d3c',
          ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 5]],
          '#fc4e2a',
          '#e31a1c'
        ],
        'circle-opacity': 0.6,
        'circle-radius': 12
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'earthquake_circle',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default expression_case;
