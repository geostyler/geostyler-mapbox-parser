import { Style } from 'geostyler-style';

const fillPatternFill: Style = {
  name: 'Pattern Fill',
  rules: [{
    name: 'Pattern Fill',
    symbolizers: [{
      kind: 'Fill',
      color: '#000000',
      opacity: 1,
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

export default fillPatternFill;
