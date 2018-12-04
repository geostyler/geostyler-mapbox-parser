const multiRuleLineFill: any = {
  version: 8,
  name: 'Rule Line Fill',
  layers: [
    {
      id: 'Line Rule0',
      type: 'line',
      paint: {
        'line-color': '#000000',
        'line-width': 3,
        'line-dasharray': [13, 37],
        'line-cap': 'round',
        'line-join': 'miter'
      }
    }, {
      id: 'Fill Rule0',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1
      }
    }
  ]
};

export default multiRuleLineFill;
