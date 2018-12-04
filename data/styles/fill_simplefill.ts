import { Style } from 'geostyler-style';

const fillSimpleFill: Style = {
  name: 'Simple Fill',
  rules: [{
    name: 'Simple Fill',
    symbolizers: [{
      kind: 'Fill',
      color: '#000000',
      opacity: 1
    }]
  }]
};

export default fillSimpleFill;
