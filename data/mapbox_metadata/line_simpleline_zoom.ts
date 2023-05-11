const lineSimpleLine: any = {
  version: 8,
  name: 'Simple Line Filter',
  layers: [{
    id: 'r0_sy0_st0',
    type: 'line',
    minzoom: 5.5,
    maxzoom: 10,
    paint: {
      'line-color': '#FF0000',
      'line-width': 5
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
