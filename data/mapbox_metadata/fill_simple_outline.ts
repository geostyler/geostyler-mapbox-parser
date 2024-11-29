import { MbStyle } from '../../src/MapboxStyleParser';

const fillSimpleFillOutline: MbStyle = {
  version: 8,
  name: 'Simple Fill With outline',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [{
    id: 'r0_sy0_st0',
    source: 'testsource',
    'source-layer': 'foo',
    type: 'fill',
    paint: {
      'fill-color': '#ff0000'
    }
  },
  {
    id: 'r0_sy0_st1',
    source: 'testsource',
    'source-layer': 'foo',
    type: 'line',
    paint: {
      'line-opacity': 0.5,
      'line-color': '#00ff00',
      'line-width': 2,
      'line-dasharray': [13, 37]
    },
    layout: {
      'line-cap': 'butt',
      'line-join': 'round'
    }
  }],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'The name of my rule',
        symbolizers: [
          [
            'r0_sy0_st0',
            'r0_sy0_st1'
          ]
        ]
      }]
    }
  }
};

export default fillSimpleFillOutline;
