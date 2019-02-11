import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Simple Line Filter',
  rules: [{
    name: 'Small populated New Yorks',
    scaleDenominator: {
      min: 545978.7733895439,
      max: 13103464.356191942,
    },
    symbolizers: [{
      kind: 'Line',
      color: '#FF0000',
      width: 5
    }]
  }]
};

export default lineSimpleLine;
