import { Style } from 'geostyler-style';

const textPlacementPoint: Style = {
  name: 'symbol placement',
  rules: [{
    name: 'Simple Text',
    symbolizers: [{
      kind: 'Text',
      placement: 'point',
    }]
  }],
  metadata: {
    'mapbox:ref': {
      sources: {
        testsource: {
          type: 'vector'
        }
      },
      sourceMapping: {
        testsource: [0]
      },
      sourceLayerMapping: {
        foo: [0]
      }
    }
  }
};

export default textPlacementPoint;
