import { MbStyle } from '../../src/MapboxStyleParser';

const textPlacement: MbStyle = {
  version: 8,
  name: 'symbol placement',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Simple Text',
      type: 'symbol',
      source: 'testsource',
      'source-layer': 'foo',
      layout: {
        'symbol-placement': 'line'
      }
    }
  ]
};

export default textPlacement;
