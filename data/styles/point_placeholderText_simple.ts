import { Style } from 'geostyler-style';

const pointPlaceholderText: Style = {
  name: 'Placeholder Text',
  rules: [{
    name: 'Placeholder Text',
    symbolizers: [{
      kind: 'Text',
      label: '{{River}}',
      color: '#000000',
      opacity: 1
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

export default pointPlaceholderText;
