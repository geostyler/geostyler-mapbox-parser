import { Style } from 'geostyler-style';

const circleSimpleCircle: Style = {
  name: 'Simple Circle',
  rules: [{
    name: 'Simple Circle',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: '#000000',
      radius: 5,
      fillOpacity: 1,
      strokeWidth: 2,
      strokeColor: '#FF0000',
      strokeOpacity: 0.5
    }]
  }]
};

export default circleSimpleCircle;
