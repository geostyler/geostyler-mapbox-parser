import { MbStyle } from '../../src/MapboxStyleParser';

const lineSimpleLine: MbStyle = {
  version: 8,
  name: 'Small populated New Yorks',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [{
    id: 'Small populated New Yorks',
    source: 'testsource',
    'source-layer': 'foo',
    type: 'line',
    filter: ['all',
      ['==', 'NAME', 'New York'],
      ['==', 'TEST_BOOL', 'true'],
      ['==', 'TEST', null],
      ['*=', 'TEST2', '*York*'],
      ['*=', 'TEST1', '*New*'],
      ['!', ['>', 'POPULATION', '100000']],
      ['any',
        ['==', 'TEST2', '1'],
        ['==', 'TEST2', '2']
      ]
    ],
    paint: {
      'line-color': '#FF0000',
      'line-width': 3
    }
  }]
};

export default lineSimpleLine;
