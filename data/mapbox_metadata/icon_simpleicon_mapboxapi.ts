const iconSimpleIcon: any = {
  version: 8,
  name: 'Simple Icon',
  sprite: 'mapbox://sprites/mapbox/streets-v8',
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
    'geostyler:ref': {
      rules: [{
        name: 'Simple Icon',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default iconSimpleIcon;
