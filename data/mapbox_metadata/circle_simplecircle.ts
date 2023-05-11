const circleSimpleCircle: any = {
  version: 8,
  name: 'Simple Circle',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'circle',
      paint: {
        'circle-color': '#000000',
        'circle-radius': 5,
        'circle-opacity': 1,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FF0000',
        'circle-stroke-opacity': 0.5
      }
    }
  ],
  metadata: {
    geoStylerRef: {
      ruleNames: ['Simple Circle'],
      'rules[0].symbolizers[0]': [
        'r0_sy0_st0'
      ]
    }
  }
};

export default circleSimpleCircle;
