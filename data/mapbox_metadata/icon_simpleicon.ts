const iconSimpleIcon: any = {
  version: 8,
  name: 'Simple Icon',
  sprite: 'https://testurl.com',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'symbol',
      layout: {
        'icon-image': 'poi'
      }
    }
  ],
  metadata: {
    geoStylerRef: {
      ruleNames: ['Simple Icon'],
      'rules[0].symbolizers[0]': [
        'r0_sy0_st0'
      ]
    }
  }
};

export default iconSimpleIcon;
