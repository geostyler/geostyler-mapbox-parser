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
      id: 'Simple Text',
      source: 'testsource',
      type: 'symbol',
      'source-layer': 'foo',
      layout: {
        'symbol-placement': 'point'
      }
    }
  ]
};

export default textPlacementPoint;
