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
      id: 'Line Rule',
      type: 'line',
      source: 'testsource',
      'source-layer': 'foo',
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
      id: 'Fill Rule',
      type: 'fill',
      source: 'testsource',
      'source-layer': 'foo',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1
      }
    }
  ]
};

export default multiRuleLineFill;
