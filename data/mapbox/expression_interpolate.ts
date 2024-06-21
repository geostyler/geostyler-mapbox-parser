/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expressionInterpolate: MbStyle = {
  version: 8,
  name: 'Expression Interpolate',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'earthquake_circle',
      type: 'circle',
      source: 'testsource',
      'source-layer': 'foo',
      paint: {
        'circle-color': '#000000',
        'circle-opacity': 0.6,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'population'],
          12,
          2,
          15,
          4,
          19,
          35
        ]
      }
    }
  ]
};

export default expressionInterpolate;
