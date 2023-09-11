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
      id: 'Simple Text',
      type: 'symbol',
      source: 'testsource',
      'source-layer': 'foo',
      layout: {
        'text-field': 'River'
      },
      paint: {
        'text-color': '#000000',
        'text-opacity': 1
      }
    }
  ]
};

export default pointSimpleText;
