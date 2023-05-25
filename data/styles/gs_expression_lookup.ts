/* eslint-disable @typescript-eslint/naming-convention */
import { Style } from 'geostyler-style';

const gs_expression_lookup: Style = {
  name: 'Expression Lookup',
  rules: [{
    name: 'length',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'strLength',
        args: ['peter']
      }
    }]
  }, {
    name: 'slice',
    symbolizers: [{
      kind: 'Text',
      label: {
        name: 'strSubstring',
        args: ['peter', 0, 2]
      }
    }]
  }]
};

export default gs_expression_lookup;
