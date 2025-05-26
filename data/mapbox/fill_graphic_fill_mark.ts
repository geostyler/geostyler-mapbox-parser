import { MbStyle } from '../../src/MapboxStyleParser';

const fillGraphicFillMark: MbStyle = {
  version: 8,
  name: 'Graphic Fill Mark',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      type: 'fill',
      paint: {
        'fill-opacity': 0.5,
        'fill-color': '#006C2B'
      },
      source: 'testsource',
      'source-layer': 'foo',
      id: 'r0_sy0_st0'
    }
  ],
  metadata: {
    'geostyler:ref': { rules: [{name: 'Graphic Fill Mark', symbolizers: [['r0_sy0_st0']]}] },
  }
};

export default fillGraphicFillMark;
