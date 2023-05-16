import { MbStyle } from '../../src/MapboxStyleParser';

const iconSimpleIcon: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Simple Icon',
  sprite: 'mapbox://sprites/mapbox/streets-v8',
  layers: [
    {
      id: 'Simple Icon',
      type: 'symbol',
      layout: {
        'icon-image': 'poi'
      }
    }
  ]
};

export default iconSimpleIcon;
