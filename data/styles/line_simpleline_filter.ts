import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Simple Line Filter',
  rules: [{
    filter: ['&&', ['&&',
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
    ], ['==', 'DENSITY', 20]],
    name: 'Small populated New Yorks',
    symbolizers: [{
      kind: 'Line',
      color: '#FF0000',
      width: 3
    }]
  }, {
    filter: ['&&', ['&&',
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
    ], ['!=', 'DENSITY', 20]],
    name: 'Small populated New Yorks',
    symbolizers: [{
      kind: 'Line',
      color: '#FF0000',
      width: 5
    }]
  }]
};

export default lineSimpleLine;
