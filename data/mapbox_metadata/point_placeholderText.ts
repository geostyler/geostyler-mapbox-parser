import { MbStyle } from '../../src/MapboxStyleParser';

const pointPlaceholderText: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Placeholder Text',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'symbol',
      layout: {
        'text-field': ['format',
          'Area: ', {},
          ['get', 'area'], {},
          'km2', {}
        ]
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
