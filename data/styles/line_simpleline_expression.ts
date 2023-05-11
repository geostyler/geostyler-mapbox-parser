import { Style } from 'geostyler-style';

// TODO: this includes some expressions and should fail for now
const lineSimpleLine: Style = {
  name: 'Simple Line Filter',
  rules: [{
    name: 'Small populated New Yorks',
    symbolizers: [{
      kind: 'Line',
      color: '#FF0000',
      width: {
        name: 'random'
      }
    }]
  }]
};

export default lineSimpleLine;
