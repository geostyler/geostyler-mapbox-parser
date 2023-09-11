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
      id: 'Placeholder Text',
      type: 'symbol',
      source: 'testsource',
      'source-layer': 'foo',
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
  ]
};

export default pointPlaceholderText;
