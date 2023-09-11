/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_case: MbStyle = {
  version: 8,
  name: 'Expression Case',
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
        'circle-color': [
          'case',
          ['<', ['get', 'mag'], 2],
          '#fed976',
          ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 3]],
          '#feb24c',
          ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 4]],
          '#fd8d3c',
          ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 5]],
          '#fc4e2a',
          '#e31a1c'
        ],
        'circle-opacity': 0.6,
        'circle-radius': 12
      }
    }
  ]
};

export default expression_case;
