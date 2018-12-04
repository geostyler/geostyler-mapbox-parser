import { Style } from 'geostyler-style';

const pointSimpleText: Style = {
  name: 'Simple Text',
  rules: [{
    name: 'Simple Text',
    symbolizers: [{
      kind: 'Text',
      label: 'River',
      color: '#000000',
      opacity: 1
    }]
  }]
};

export default pointSimpleText;
