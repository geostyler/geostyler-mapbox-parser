const lineSimpleLine: any = {
  version: 8,
  name: 'Simple Line Filter',
  layers: [{
    id: 'Small populated New Yorks',
    type: 'line',
    filter: ['all',
      ['==', ['get', 'NAME'], 'New York'],
      ['==', ['get', 'TEST_BOOL'], 'true'],
      ['==', ['get', 'TEST'], null],
      ['*=', ['get', 'TEST2'], '*York*'],
      ['*=', ['get', 'TEST1'], '*New*'],
      ['!', ['>', ['get', 'POPULATION'], '100000']],
      ['any',
        ['==', ['get', 'TEST2'], '1'],
        ['==', ['get', 'TEST2'], '2']
      ]
    ],
    paint: {
      'line-color': '#FF0000',
      'line-width': ['case',
        ['==', ['get', 'DENSITY'], 20],
        3,
        ['!=', ['get', 'DENSITY'], 20],
        5
      ]
    }
  }]
};

export default lineSimpleLine;
