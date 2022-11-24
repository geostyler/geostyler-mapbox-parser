const pointPlaceholderText: any = {
  version: 8,
  name: 'Placeholder Text',
  layers: [
    {
      id: 'Placeholder Text',
      type: 'symbol',
      layout: {
        'text-field': ['format',
          'Area: ', {},
          ['get', 'area'], {},
          'km2', {}
        ]
      },
      paint: {
        'text-color': '#000000',
        'text-opacity': 1
      }
    }
  ]
};

export default pointPlaceholderText;
