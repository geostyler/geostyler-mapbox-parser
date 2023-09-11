import { Style } from 'geostyler-style';

const iconTextSymbolizer: Style = {
  name: 'icontext symbolizer',
  rules: [
    {
      name: 'label and icon',
      symbolizers: [
        {
          kind: 'Text',
          color: 'rgba(45, 45, 45, 1)',
          label: '{{name}}',
          size: 12,
          visibility: true
        },
        {
          kind: 'Icon',
          visibility: true,
          image: '/sprites/?name=poi&baseurl=' + encodeURIComponent('https://testurl.com')
        }
      ]
    }
  ],
  metadata: {
    'mapbox:ref': {
      splitSymbolizers: [{
        rule: 0,
        symbolizers: [0, 1]
      }]
    }
  }
};

export default iconTextSymbolizer;
