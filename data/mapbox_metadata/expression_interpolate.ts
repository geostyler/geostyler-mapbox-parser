/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_case: MbStyle = {
  version: 8,
  name: 'Expression Interpolate',
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
        'circle-color': '#000000',
        'circle-opacity': 0.6,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'population'],
          12,
          2,
          15,
          4,
          19,
          35
        ]
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
