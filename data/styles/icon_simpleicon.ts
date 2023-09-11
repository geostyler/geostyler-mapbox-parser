import { Style } from 'geostyler-style';

const iconSimpleIcon: Style = {
  name: 'Simple Icon',
  rules: [{
    name: 'Simple Icon',
    symbolizers: [{
      kind: 'Icon',
      image: '/sprites/?name=poi&baseurl=' + encodeURIComponent('https://testurl.com')
    }]
  }],
  metadata: {
    'mapbox:ref': {
      sources: {
        testsource: {
          type: 'vector'
        }
      },
      sourceMapping: {
        testsource: [0]
      },
      sourceLayerMapping: {
        foo: [0]
      }
    }
  }
};

export default iconSimpleIcon;
