import { Style } from 'geostyler-style';

const fillSimpleFill: Style = {
  name: 'Simple Fill',
  rules: [{
    name: 'Simple Fill',
    symbolizers: [{
      kind: 'Fill',
      color: '#000000',
      opacity: 1
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

export default fillSimpleFill;
