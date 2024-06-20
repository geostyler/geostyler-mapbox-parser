import { MbStyle } from '../../src/MapboxStyleParser';

const circleSimpleCircle: MbStyle = {
  version: 8,
  name: 'Simple Circle',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'Simple Circle',
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

export default circleSimpleCircle;
