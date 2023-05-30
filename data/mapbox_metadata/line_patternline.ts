import { MbStyle } from '../../src/MapboxStyleParser';

const linePatternLine: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Pattern Line',
  sprite: 'https://testurl.com',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'line',
      paint: {
        'line-color': '#000000',
        'line-width': 3,
        'line-dasharray': [13, 37],
        'line-pattern': 'poi'
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'miter'
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Pattern Line',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default linePatternLine;
