import { MbStyle } from '../../src/MapboxStyleParser';

const multiSimpleLineSimpleFill: MbStyle = {
  version: 8,
  name: 'Simple Line Simple Fill',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Simple Line Simple Fill',
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
    }, {
      id: 'Simple Line Simple Fill',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1
      }
    }
  ]
};

export default multiSimpleLineSimpleFill;
