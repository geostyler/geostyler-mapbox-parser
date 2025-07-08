import { Style } from 'geostyler-style';

const fillGraphicFillMark: Style = {
  name: 'Graphic Fill Mark',
  rules: [
    {
      name: 'Graphic Fill Mark',
      symbolizers: [{
        kind: 'Fill',
        graphicFill: {
          kind: 'Mark',
          wellKnownName: 'circle',
          opacity: 1,
          color: '#006C2B',
          rotate: 0,
          radius: 0.3,
          strokeOpacity: 1,
          strokeColor: '#000000',
          strokeWidth: 0.2
        }
      }
      ]
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

export default fillGraphicFillMark;
