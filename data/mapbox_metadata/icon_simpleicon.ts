import { MbStyle } from '../../src/MapboxStyleParser';

const iconSimpleIcon: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Simple Icon',
  sprite: 'https://testurl.com',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'symbol',
      layout: {
        'icon-image': 'poi'
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Simple Icon',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default iconSimpleIcon;
