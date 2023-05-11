const lineSimpleLine: any = {
  version: 8,
  name: 'Small populated New Yorks',
  layers: [{
    id: 'r0_sy0_st0',
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
  }],
  metadata: {
    geoStylerRef: {
      ruleNames: ['Small populated New Yorks'],
      'rules[0].symbolizers[0]': [
        'r0_sy0_st0'
      ]
    }
  }
};

export default lineSimpleLine;
