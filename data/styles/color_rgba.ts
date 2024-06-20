import { Style } from 'geostyler-style';

const circleSimpleCircle: Style = {
  name: 'Simple Circle',
  rules: [{
    name: 'Simple Circle',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: '#000000',
      strokeColor: {
        name: 'case',
        args: [{
          case: {
            name: 'lessThan',
            args: [{
              name: 'property',
              args: ['mag']
            }, 2]
          },
          value: '#ff0000'
        },
        '#00ff00'
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

export default circleSimpleCircle;
