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
  ]
};

export default pointPlaceholderText;
