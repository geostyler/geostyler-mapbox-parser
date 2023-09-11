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
      id: 'Simple Line',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'line',
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
  ]
};

export default lineSimpleLine;
