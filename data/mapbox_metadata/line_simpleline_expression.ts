const lineSimpleLine: any = {
  version: 8,
  name: 'Simple Line Filter',
  layers: [{
    id: 'r0_sy0_st0',
    type: 'line',
    paint: {
      'line-color': '#FF0000',
      'line-width': ['case',
        ['==', 'DENSITY', 20],
        3,
        ['!=', 'DENSITY', 20],
        5
      ]
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
