import { MbStyle } from '../../src/MapboxStyleParser';

const fillSimpleFill: MbStyle = {
  version: 8,
  name: 'Pattern Fill',
  sprite: 'https://testurl.com',
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
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1,
        'fill-pattern': 'poi'
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Pattern Fill',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default fillSimpleFill;
