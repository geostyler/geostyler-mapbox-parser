import { MbStyle } from '../../src/MapboxStyleParser';

const lineSimpleLine: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Simple Line Filter',
  layers: [{
    id: 'Small populated New Yorks',
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
