import { Style } from 'geostyler-style';

// TODO: this includes some expressions and should fail for now
const lineSimpleLine: Style = {
  name: 'Simple Line Filter',
  rules: [{
    name: 'Small populated New Yorks',
    symbolizers: [{
      kind: 'Line',
      color: '#FF0000',
      width: {
        name: 'random'
      }
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

export default lineSimpleLine;
