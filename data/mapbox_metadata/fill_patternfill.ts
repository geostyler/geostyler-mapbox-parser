const fillSimpleFill: any = {
  version: 8,
  name: 'Pattern Fill',
  sprite: 'https://testurl.com',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1,
        'fill-pattern': 'poi'
      }
    }
  ],
  metadata: {
    geoStylerRef: {
      ruleNames: ['Pattern Fill'],
      'rules[0].symbolizers[0]': [
        'r0_sy0_st0'
      ]
    }
  }
};

export default fillSimpleFill;
