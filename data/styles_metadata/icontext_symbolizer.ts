import { Style } from 'geostyler-style';

const iconTextSymbolizer: Style = {
  name: 'icontext symbolizer',
  rules: [
    {
      name: 'label and icon',
      symbolizers: [
        {
          kind: 'Text',
          color: '#2d2d2d',
          label: '{{name}}',
          size: 12,
          visibility: true
        },
        {
          kind: 'Icon',
          visibility: true,
          image: {
            source: 'https://testurl.com/sprites/mysprite.png',
            position: [0, 0],
            size: [12, 12]
          }
        }
      ]
    }
  ],
  metadata: {
    'mapbox:ref': {
      sources: {
        testsource: {
          type: 'vector'
        }
      },
      splitSymbolizers: [{
        rule: 0,
        symbolizers: [0, 1]
      }],
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

export default iconTextSymbolizer;
