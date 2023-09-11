import { MbStyle } from '../../src/MapboxStyleParser';

const iconSimpleIcon: MbStyle = {
  version: 8,
  name: 'Simple Icon',
  sprite: 'mapbox://sprites/mapbox/streets-v8',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Simple Icon',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'symbol',
      layout: {
        'icon-image': 'poi'
      }
    }
  ]
};

export default iconSimpleIcon;
