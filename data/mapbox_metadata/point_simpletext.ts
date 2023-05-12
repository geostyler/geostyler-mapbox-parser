const pointSimpleText: any = {
  version: 8,
  name: 'Simple Text',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'symbol',
      layout: {
        'text-field': 'River'
      },
      paint: {
        'text-color': '#000000',
        'text-opacity': 1
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Simple Text',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default pointSimpleText;
