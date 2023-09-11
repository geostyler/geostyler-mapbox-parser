/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_get: MbStyle = {
  version: 8,
  name: 'Expression Get',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Expression Get',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': '#000000',
        'circle-radius': ['get', 'population'],
        'circle-opacity': ['get', 'population_density'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FF0000',
        'circle-stroke-opacity': 0.5
      }
    }
  ]
};

export default expression_get;
