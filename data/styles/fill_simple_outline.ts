import { Style } from 'geostyler-style';

const fillSimpleFillOutline: Style = {
  name: 'Simple Fill With outline',
  rules: [{
    name: 'The name of my rule',
    symbolizers: [{
      kind: 'Fill',
      color: '#ff0000',
      outlineColor: '#00ff00',
      outlineWidth: 2,
      outlineOpacity: 0.5,
      outlineCap: 'butt',
      outlineJoin: 'round'
    }]
  }]
};

export default fillSimpleFillOutline;
