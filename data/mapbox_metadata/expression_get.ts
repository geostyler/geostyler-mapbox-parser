/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_get: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Expression Get',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'circle',
      paint: {
        'circle-color': '#000000',
        'circle-radius': ['get', 'population'],
        'circle-opacity': ['get', 'population_density'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FF0000',
        'circle-stroke-opacity': 0.5
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Expression Get',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default expression_get;
