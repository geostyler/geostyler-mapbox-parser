import { Style } from 'geostyler-style';

const iconSimpleIcon: Style = {
  name: 'Simple Icon',
  rules: [{
    name: 'Simple Icon',
    symbolizers: [{
      kind: 'Icon',
      image: {
        source: 'https://testurl.com/sprites/mysprite.png',
        position: [0, 0],
        size: [12, 12]
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

export default iconSimpleIcon;
