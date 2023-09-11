import { MbStyle } from '../../src/MapboxStyleParser';

const fillSimpleFill: MbStyle = {
  version: 8,
  name: 'Simple Fill',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Simple Fill',
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

export default fillSimpleFill;
