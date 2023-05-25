/* eslint-disable @typescript-eslint/naming-convention */
import { Style } from 'geostyler-style';

const gs_expression_string: Style = {
  name: 'Expression String',
  rules: [{
    name: 'concat',
    symbolizers: [{
      kind: 'Text',
      label: {
        name: 'strConcat',
        args: ['Lukas', ' ', 'Podolski']
      }
    }]
  }, {
    name: 'downcase',
    symbolizers: [{
      kind: 'Text',
      label: {
        name: 'strToLowerCase',
        args: ['Peter']
      }
    }]
  }, {
    name: 'upcase',
    symbolizers: [{
      kind: 'Text',
      label: {
        name: 'strToUpperCase',
        args: ['peter']
      }
    }]
  }]
};

export default gs_expression_string;
