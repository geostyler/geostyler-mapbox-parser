import { MbStyle } from '../../src/MapboxStyleParser';

const linePatternLine: MbStyle = {
  version: 8,
  name: 'Pattern Line',
  sprite: 'https://testurl.com/sprites/mysprite',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Pattern Line',
      type: 'line',
      source: 'testsource',
      'source-layer': 'foo',
      paint: {
        'line-color': '#000000',
        'line-width': 3,
        'line-dasharray': [13, 37],
        'line-pattern': 'poi'
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'miter'
      }
    }
  ]
};

export default linePatternLine;
