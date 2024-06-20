import { MbStyle } from '../../src/MapboxStyleParser';

const iconTextSymbolizer: MbStyle = {
  version: 8,
  name: 'icontext symbolizer',
  sprite: 'https://testurl.com/sprites/mysprite',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      type: 'symbol',
      source: 'testsource',
      'source-layer': 'foo',
      paint: {
        'text-color': '#2d2d2d',
      },
      layout: {
        'text-field': '{name}',
        'text-size': 12,
        'icon-image': 'poi',
        visibility: 'visible',
      },
      id: 'r0_sy0_st0',
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [
        {
          name: 'label and icon',
          symbolizers: [
            [
              'r0_sy0_st0',
            ]
          ],
        },
      ],
    },
  },
};

export default iconTextSymbolizer;
