import { MbStyle } from '../../src/MapboxStyleParser';

const colorRgba: MbStyle = {
  version: 8,
  name: 'Color RGBA',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Color RGBA',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': 'rgba(0, 0, 0, 1)',
        'circle-stroke-color': [
          'case',
          ['<', ['get', 'mag'], 2],
          'rgba(255, 0, 0, 1)',
          'rgba(0, 255, 0, 1)'
        ]
      }
    }
  ]
};

export default colorRgba;
