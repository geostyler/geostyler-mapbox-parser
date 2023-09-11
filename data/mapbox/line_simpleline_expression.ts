import { MbStyle } from '../../src/MapboxStyleParser';

const lineSimpleLine: MbStyle = {
  version: 8,
  name: 'Simple Line Filter',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [{
    id: 'Small populated New Yorks',
    source: 'testsource',
    'source-layer': 'foo',
    type: 'line',
    paint: {
      'line-color': '#FF0000',
      'line-width': ['case',
        ['==', 'DENSITY', 20],
        3,
        ['!=', 'DENSITY', 20],
        5
      ]
    }
  }]
};

export default lineSimpleLine;
