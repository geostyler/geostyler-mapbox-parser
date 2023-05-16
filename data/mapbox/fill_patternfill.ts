import { MbStyle } from '../../src/MapboxStyleParser';

const fillSimpleFill: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Pattern Fill',
  sprite: 'https://testurl.com',
  layers: [
    {
      id: 'Pattern Fill',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1,
        'fill-pattern': 'poi'
      }
    }
  ]
};

export default fillSimpleFill;
