const fillSimpleFillOutline: any = {
  version: 8,
  name: 'Simple Fill With outline',
  layers: [{
    id: 'rule_0',
    type: 'fill',
    paint: {
      'fill-color': '#ff0000'
    }
  },
  {
    id: 'rule_0',
    type: 'line',
    paint: {
      'line-opacity': 0.5,
      'line-color': '#00ff00',
      'line-width': 2
    },
    layout: {
      'line-cap': 'butt',
      'line-join': 'round'
    }
  }],
  metadata: {
    splitIds: ['rule_0']
  }
};

export default fillSimpleFillOutline;
