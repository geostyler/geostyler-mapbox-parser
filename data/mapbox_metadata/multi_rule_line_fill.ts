const multiRuleLineFill: any = {
  version: 8,
  name: 'Rule Line Fill',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'line',
      paint: {
        'line-color': '#000000',
        'line-width': 3,
        'line-dasharray': [13, 37]
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'miter'
      }
    }, {
      id: 'r1_sy0_st0',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1
      }
    }
  ],
  metadata: {
    geoStylerRef: {
      ruleNames: ['Line Rule', 'Fill Rule'],
      'rules[0].symbolizers[0]': [
        'r0_sy0_st0'
      ],
      'rules[1].symbolizers[0]': [
        'r1_sy0_st0'
      ]
    }
  }
};

export default multiRuleLineFill;
