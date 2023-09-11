import { MbStyle } from '../../src/MapboxStyleParser';

const pointSimpleText: MbStyle = {
  version: 8,
  name: 'Simple Text',
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
      type: 'symbol',
      layout: {
        'text-field': 'River'
      },
      paint: {
        'text-color': '#000000',
        'text-opacity': 1
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Simple Text',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default pointSimpleText;
