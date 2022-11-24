import { Style } from 'geostyler-style';

const multiSimpleLineSimpleFill: Style = {
  name: 'Simple Line Simple Fill',
  rules: [{
    name: 'Simple Line Simple Fill',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37],
      cap: 'round',
      join: 'miter'
    }]
  },{
    name: 'Simple Line Simple Fill',
    symbolizers: [{
      kind: 'Fill',
      color: '#000000',
      opacity: 1
    }]
  }]
};

export default multiSimpleLineSimpleFill;
