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
    type: 'fill',
    source: 'testsource',
    'source-layer': 'foo',
    paint: {
      'fill-color': '#ff0000'
    }
  },
  {
    id: 'r0_sy0_st1',
    type: 'line',
    source: 'testsource',
    'source-layer': 'foo',
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
  }]
};

export default fillSimpleFillOutline;
