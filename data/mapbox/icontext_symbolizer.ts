import { MbStyle } from '../../src/MapboxStyleParser';

const iconTextSymbolizer: MbStyle = {
  version: 8,
  name: 'icontext symbolizer',
  sprite: 'https://testurl.com',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      type: 'symbol',
      source: 'testsource',
      'source-layer': 'foo',
      paint: {
        'text-color': 'rgba(45, 45, 45, 1)',
      },
      layout: {
        'text-field': '{name}',
        'text-size': 12,
        'icon-image': 'poi',
        visibility: 'visible',
      },
      id: 'label and icon',
    }
  ]
};


export default iconTextSymbolizer;
