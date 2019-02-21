const lineSimpleLine: any = {
  version: 8,
  name: 'Simple Line Filter',
  layers: [{
    id: 'Small populated New Yorks',
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
      'line-width': ['case',
        ['==', 'DENSITY', 20],
        3,
        ['!=', 'DENSITY', 20],
        5
      ]
    }
  }]
};

export default lineSimpleLine;
