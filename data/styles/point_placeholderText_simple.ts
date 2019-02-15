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
  }]
};

export default pointPlaceholderText;
