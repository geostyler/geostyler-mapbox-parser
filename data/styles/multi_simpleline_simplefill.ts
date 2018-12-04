import { Style } from 'geostyler-style';

const multiSimpleLineSimpleFill: Style = {
  name: 'Simple Line Simple Fill',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37],
      cap: 'round',
      join: 'miter',
      dashOffset: 10
    }, {
      kind: 'Fill',
      color: '#000000',
      opacity: 1
    }]
  }]
};

export default multiSimpleLineSimpleFill;
