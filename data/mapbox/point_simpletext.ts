import { MbStyle } from '../../src/MapboxStyleParser';

const pointSimpleText: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Simple Text',
  layers: [
    {
      id: 'Simple Text',
      type: 'symbol',
      layout: {
        'text-field': 'River'
      },
      paint: {
        'text-color': '#000000',
        'text-opacity': 1
      }
    }
  ]
};

export default pointSimpleText;
