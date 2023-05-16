import { MbStyle } from '../../src/MapboxStyleParser';

const lineSimpleLine: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Simple Line Filter',
  layers: [{
    id: 'Small populated New Yorks',
    type: 'line',
    minzoom: 5.5,
    maxzoom: 10,
    paint: {
      'line-color': '#FF0000',
      'line-width': 5
    }
  }]
};

export default lineSimpleLine;
