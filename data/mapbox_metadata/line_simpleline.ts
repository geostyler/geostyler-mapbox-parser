import { MbStyle } from '../../src/MapboxStyleParser';

const lineSimpleLine: MbStyle = {
  version: 8,
  name: 'Simple Line',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'line',
      source: 'testsource',
      'source-layer': 'foo',
      paint: {
        'line-color': '#000000',
        'line-width': 3,
        'line-dasharray': [13, 37]
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
        name: 'Simple Line',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default lineSimpleLine;
