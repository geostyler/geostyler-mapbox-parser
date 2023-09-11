import { MbStyle } from '../../src/MapboxStyleParser';

const multiSimpleLineSimpleFill: MbStyle = {
  version: 8,
  name: 'Simple Line Simple Fill',
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
      type: 'line',
      paint: {
        'line-color': '#000000',
        'line-width': 3,
        'line-dasharray': [13, 37]
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'miter'
      }
    }, {
      id: 'r1_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Simple Line Simple Fill',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      },{
        name: 'Simple Line Simple Fill',
        symbolizers: [
          [
            'r1_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default multiSimpleLineSimpleFill;
