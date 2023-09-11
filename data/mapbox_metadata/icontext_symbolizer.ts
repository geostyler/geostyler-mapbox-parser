import { MbStyle } from '../../src/MapboxStyleParser';

const iconTextSymbolizer: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'icontext symbolizer',
  sprite: 'https://testurl.com',
  layers: [
    {
      type: 'symbol',
      paint: {
        'text-color': 'rgba(45, 45, 45, 1)',
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
