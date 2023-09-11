import { MbStyle } from '../../src/MapboxStyleParser';

const pointPlaceholderText: MbStyle = {
  version: 8,
  name: 'Placeholder Text',
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
        'text-field': '{River}'
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
        name: 'Placeholder Text',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default pointPlaceholderText;
