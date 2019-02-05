import { Style } from 'geostyler-style';

const multiRuleLineFill: Style = {
  name: 'Rule Line Fill',
  rules: [{
    name: 'Line Rule',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37],
      cap: 'round',
      join: 'miter',
      dashOffset: 10
    }]
  }, {
    name: 'Fill Rule',
    symbolizers: [{
      kind: 'Fill',
      color: '#000000',
      opacity: 1
    }]
  }]
};

export default multiRuleLineFill;
