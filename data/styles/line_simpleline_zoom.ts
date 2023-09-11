import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Simple Line Filter',
  rules: [{
    name: 'Small populated New Yorks',
    scaleDenominator: {
      min: 545978.7909368654,
      max: 12354089.774575673,
    },
    symbolizers: [{
      kind: 'Line',
      color: '#FF0000',
      width: 5
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
