import { Style } from 'geostyler-style';

const iconSimpleIcon: Style = {
  name: 'Simple Icon',
  rules: [{
    name: 'Simple Icon',
    symbolizers: [{
      kind: 'Icon',
      image: '/sprites/?name=poi&baseurl=' + encodeURIComponent('https://api.mapbox.com/sprites/mapbox/streets-v8')
    }]
  }]
};

export default iconSimpleIcon;
