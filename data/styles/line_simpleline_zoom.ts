import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Small populated New Yorks',
  rules: [{
    name: 'Small populated New Yorks',
    scaleDenominator: {
      min: 8735642.904127963,
      max: 272988.84075399884
    },
    symbolizers: [{
      kind: 'Line',
      color: '#FF0000',
      width: 5
    }]
  }]
};

export default lineSimpleLine;
