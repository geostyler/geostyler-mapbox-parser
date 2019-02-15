import { Style } from 'geostyler-style';

const fillPatternFill: Style = {
  name: 'Pattern Fill',
  rules: [{
    name: 'Pattern Fill',
    symbolizers: [{
      kind: 'Fill',
      color: '#000000',
      opacity: 1,
      graphicFill: {
        kind: 'Icon',
        image: "/sprites/?name=poi&baseurl=" + encodeURIComponent("https://testurl.com")
      }
    }]
  }]
};

export default fillPatternFill;
