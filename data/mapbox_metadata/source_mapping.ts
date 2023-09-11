import { MbStyle } from '../../src/MapboxStyleParser';

const sourceMapping: MbStyle = {
  version: 8,
  name: 'SourceMapping',
  sources: {
    first: {
      type: 'vector'
    },
    second: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'r0_sy0_st0',
      source: 'first',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': '#000000',
        'circle-radius': 5,
        'circle-opacity': 1,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FF0000',
        'circle-stroke-opacity': 0.5
      }
    },
    {
      id: 'r1_sy0_st0',
      source: 'second',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': '#000000',
        'circle-radius': 5,
        'circle-opacity': 1,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FF0000',
        'circle-stroke-opacity': 0.5
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Simple Circle 1',
        symbolizers: [[
          'r0_sy0_st0'
        ]]
      }, {
        name: 'Simple Circle 2',
        symbolizers: [[
          'r1_sy0_st0'
        ]]
      }]
    }
  }
};

export default sourceMapping;
