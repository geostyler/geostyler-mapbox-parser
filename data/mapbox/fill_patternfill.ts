import { MbStyle } from '../../src/MapboxStyleParser';

const fillSimpleFill: MbStyle = {
  version: 8,
  name: 'Pattern Fill',
  sprite: 'https://testurl.com/sprites/mysprite',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Pattern Fill',
      source: 'testsource',
      'source-layer': 'foo',
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
