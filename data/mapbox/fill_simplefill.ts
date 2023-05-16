import { MbStyle } from '../../src/MapboxStyleParser';

const fillSimpleFill: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Simple Fill',
  layers: [
    {
      id: 'Simple Fill',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1
      }
    }
  ]
};

export default fillSimpleFill;
