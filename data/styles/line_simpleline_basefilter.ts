import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Small populated New Yorks',
  rules: [{
    filter: ['&&',
      ['==', 'NAME', 'New York'],
      ['==', 'TEST_BOOL', 'true'],
      ['==', 'TEST', null],
      ['*=', 'TEST2', '*York*'],
      ['*=', 'TEST1', '*New*'],
      ['!', ['>', 'POPULATION', '100000']],
      ['||',
        ['==', 'TEST2', '1'],
        ['==', 'TEST2', '2']
      ]
    ],
    name: 'Small populated New Yorks',
    symbolizers: [{
      kind: 'Line',
      color: '#FF0000',
      width: 3
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
