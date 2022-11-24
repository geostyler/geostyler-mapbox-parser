import { Style } from 'geostyler-style';

const linePatternLine: Style = {
  name: 'Pattern Line',
  rules: [{
    name: 'Pattern Line',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37],
      cap: 'round',
      join: 'miter',
      graphicFill: {
        kind: 'Icon',
        image: '/sprites/?name=poi&baseurl=' + encodeURIComponent('https://testurl.com')
      }
    }]
  }]
};

export default linePatternLine;
