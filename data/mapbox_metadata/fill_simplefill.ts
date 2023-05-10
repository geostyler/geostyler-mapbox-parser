import { MbStyle } from '../../src/MapboxStyleParser';

const fillSimpleFill: Omit<MbStyle, 'sources'> = {
  version: 8,
  name: 'Simple Fill',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 1
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'Simple Fill',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default fillSimpleFill;
