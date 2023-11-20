import { MbStyle } from '../../src/MapboxStyleParser';

const textPlacementPoint: MbStyle = {
  version: 8,
  name: 'symbol placement',
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
        'symbol-placement': 'point'
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Simple Text',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default textPlacementPoint;
