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
      id: 'Simple Icon',
      type: 'symbol',
      source: 'testsource',
      'source-layer': 'foo',
      layout: {
        'icon-image': 'poi',
        'icon-size': 2
      }
    }
  ]
};

export default iconSimpleIcon;
