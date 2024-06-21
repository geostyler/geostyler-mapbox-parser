import { Style } from 'geostyler-style';

const colorRgba: Style = {
  name: 'Color RGBA',
  rules: [{
    name: 'Color RGBA',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: '#000000',
      strokeColor: {
        name: 'case',
        args: [
          '#00ff00', {
            case: {
              name: 'lessThan',
              args: [{
                name: 'property',
                args: ['mag']
              }, 2]
            },
            value: '#ff0000'
          }
        ]
      }
    }]
  }],
  metadata: {
    'mapbox:ref': {
      sources: {
        testsource: {
          type: 'vector'
        }
      },
      sourceMapping: {
        testsource: [0]
      },
      sourceLayerMapping: {
        foo: [0]
      }
    }
  }
};

export default colorRgba;
