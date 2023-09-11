import { MbStyle } from '../../src/MapboxStyleParser';

const iconSimpleIcon: MbStyle = {
  version: 8,
  name: 'Simple Icon',
  sprite: 'https://testurl.com',
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
        'icon-image': 'poi'
      }
    }
  ]
};

export default iconSimpleIcon;
