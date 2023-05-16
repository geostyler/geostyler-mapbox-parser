import { MbStyle } from '../../src/MapboxStyleParser';

const pointPlaceholderText: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Placeholder Text',
  layers: [
    {
      id: 'Placeholder Text',
      type: 'symbol',
      layout: {
        'text-field': '{River}'
      },
      paint: {
        'text-color': '#000000',
        'text-opacity': 1
      }
    }
  ]
};

export default pointPlaceholderText;
