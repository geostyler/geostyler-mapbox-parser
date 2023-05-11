import { Style, Symbolizer } from 'geostyler-style';
import { get, set } from 'lodash';

type RULEID = number;
type SYMBOLIZERID = number;
type RULENAME = string;

type ID =`rules[${RULEID}].symbolizers[${SYMBOLIZERID}]_${RULENAME}`;

const firstID: ID = 'rules[0].symbolizers[0]_';

const selector = firstID.split('_')[0];
const ruleName = firstID.split('_')[1];

const circleSimpleCircle: any = {
  version: 8,
  name: 'Simple Circle',
  layers: [
    {
      id: 'r0_sy0_st0',
      type: 'fill',
      paint: {
        'fill-color': '#A6CEE3',
        'fill-opacity': 0.7
      }
    },
    {
      id: 'r0_sy0_st1',
      type: 'line',
      paint: {
        'line-color': 'red',
        'line-opacity': 1
      }
    }
  ],
  metadata: {
    geoStylerRef: {
      'rule[0].symbolizer[0]': [
        'r0_sy0_st0',
        'r0_sy0_st1'
      ]
    }
  }
};

const gsStyle: Style = {
  name: '',
  rules: []
};

const symbolizer: Symbolizer = {
  kind: 'Fill'
};

const peter = set(gsStyle, selector, symbolizer);

export default circleSimpleCircle;
