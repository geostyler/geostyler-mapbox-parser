import { Style } from 'geostyler-style';

const sourceMapping: Style = {
  name: 'SourceMapping',
  rules: [{
    name: 'Simple Circle 1',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: '#000000',
      radius: 5,
      fillOpacity: 1,
      strokeWidth: 2,
      strokeColor: '#FF0000',
      strokeOpacity: 0.5
    }]
  }, {
    name: 'Simple Circle 2',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: '#000000',
      radius: 5,
      fillOpacity: 1,
      strokeWidth: 2,
      strokeColor: '#FF0000',
      strokeOpacity: 0.5
    }]
  }],
  metadata: {
    'mapbox:ref': {
      sources: {
        first: {
          type: 'vector'
        },
        second: {
          type: 'vector'
        }
      },
      sourceMapping: {
        first: [0],
        second: [1]
      },
      sourceLayerMapping: {
        foo: [0, 1]
      }
    }
  }
};

export default sourceMapping;
