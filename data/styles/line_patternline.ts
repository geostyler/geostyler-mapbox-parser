import { Style } from 'geostyler-style';

const linePatternLine: Style = {
  name: 'Pattern Line',
  rules: [{
    name: 'Pattern Line',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37],
      cap: 'round',
      join: 'miter',
      graphicFill: {
        kind: 'Icon',
        image: {
          source: 'https://testurl.com/sprites/mysprite.png',
          position: [0, 0],
          size: [12, 12]
        }
      }
    }]
  }],
  metadata: {
    'mapbox:ref': {
      sources: {
        testsource: {
          type: 'vector'
        }
      },
      sourceMapping: {
        testsource: [0]
      },
      sourceLayerMapping: {
        foo: [0]
      },
      sprite: {
        poi: {
          position: [
            0,
            0,
          ],
          size: [
            12,
            12,
          ],
        },
      },
    }
  }
};

export default linePatternLine;
