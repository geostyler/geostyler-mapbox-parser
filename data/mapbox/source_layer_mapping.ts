import { MbStyle } from '../../src/MapboxStyleParser';

const sourceLayerMapping: MbStyle = {
  version: 8,
  name: 'SourceLayerMapping',
  sources: {
    first: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Simple Circle 1',
      source: 'first',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': '#000000',
        'circle-radius': 5,
        'circle-opacity': 1,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FF0000',
        'circle-stroke-opacity': 0.5
      }
    },
    {
      id: 'Simple Circle 2',
      source: 'first',
      'source-layer': 'bar',
      type: 'circle',
      paint: {
        'circle-color': '#000000',
        'circle-radius': 5,
        'circle-opacity': 1,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FF0000',
        'circle-stroke-opacity': 0.5
      }
    }
  ]
};

export default sourceLayerMapping;
