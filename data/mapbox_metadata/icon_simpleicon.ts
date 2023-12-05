import { MbStyle } from '../../src/MapboxStyleParser';

const iconSimpleIcon: MbStyle = {
  version: 8,
  name: 'Simple Icon',
  sprite: 'https://testurl.com/sprites/mysprite',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'r0_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'symbol',
      layout: {
        'icon-image': 'poi',
        'icon-size': 2
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
