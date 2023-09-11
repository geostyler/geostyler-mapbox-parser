import { MbStyle } from '../../src/MapboxStyleParser';

const multiRuleLineFill: MbStyle = {
  version: 8,
  name: 'Rule Line Fill',
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
        name: 'Line Rule',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      },{
        name: 'Fill Rule',
        symbolizers: [
          [
            'r1_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default multiRuleLineFill;
