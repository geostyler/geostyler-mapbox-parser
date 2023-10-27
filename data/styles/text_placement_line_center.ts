import { Style } from 'geostyler-style';

const textPlacementLineCenter: Style = {
  name: 'symbol placement',
  rules: [{
    name: 'Simple Text',
    symbolizers: [{
      kind: 'Text',
      placement: 'line-center'
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

export default textPlacementLineCenter;
