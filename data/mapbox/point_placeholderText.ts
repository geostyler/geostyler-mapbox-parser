const pointPlaceholderText: any = {
  version: 8,
  name: 'Placeholder Text',
  layers: [
    {
      id: 'Placeholder Text',
      type: 'symbol',
      paint: {
        'text-field': ['format',
          'Area: ', {},
          ['get', 'area'], {},
          'km2', {}
        ],
        'text-color': '#000000',
        'text-opacity': 1
      }
    }
  ]
};

export default pointPlaceholderText;
