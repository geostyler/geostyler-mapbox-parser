/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_math: MbStyle = {
  version: 8,
  name: 'Expression Math',
  sources: {
    testsource: {
      type: 'vector'
    }
  },
  layers: [
    {
      id: 'r0_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['+', 13, 3, 7]
      }
    },
    {
      id: 'r1_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['abs', -12]
      }
    },
    {
      id: 'r2_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['acos', 4]
      }
    },
    {
      id: 'r3_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['asin', 4]
      }
    },
    {
      id: 'r4_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['atan', 4]
      }
    },
    {
      id: 'r5_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['ceil', 3.4]
      }
    },
    {
      id: 'r6_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['cos', 3.4]
      }
    },
    {
      id: 'r7_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['/', 100, 2]
      }
    },
    {
      id: 'r8_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['e']
      }
    },
    {
      id: 'r9_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['floor', 3.5]
      }
    },
    {
      id: 'r10_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['ln', 4.6]
      }
    },
    {
      id: 'r11_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['max', 13, 37, 0, 8, 15]
      }
    },
    {
      id: 'r12_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['min', 13, 37, 0, 8, 15]
      }
    },
    {
      id: 'r13_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['%', 3, 2]
      }
    },
    {
      id: 'r14_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['*', 2, 2.5, 10]
      }
    },
    {
      id: 'r15_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['pi']
      }
    },
    {
      id: 'r16_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['^', 2, 4]
      }
    },
    {
      id: 'r17_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['round', 13.37]
      }
    },
    {
      id: 'r18_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['sin', 1]
      }
    },
    {
      id: 'r19_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['sqrt', 1]
      }
    },
    {
      id: 'r20_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['-', 5, 6]
      }
    },
    {
      id: 'r21_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-radius': ['tan', 1]
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'add',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }, {
        name: 'abs',
        symbolizers: [
          [
            'r1_sy0_st0'
          ]
        ]
      }, {
        name: 'acos',
        symbolizers: [
          [
            'r2_sy0_st0'
          ]
        ]
      }, {
        name: 'asin',
        symbolizers: [
          [
            'r3_sy0_st0'
          ]
        ]
      }, {
        name: 'atan',
        symbolizers: [
          [
            'r4_sy0_st0'
          ]
        ]
      }, {
        name: 'ceil',
        symbolizers: [
          [
            'r5_sy0_st0'
          ]
        ]
      }, {
        name: 'cos',
        symbolizers: [
          [
            'r6_sy0_st0'
          ]
        ]
      }, {
        name: 'div',
        symbolizers: [
          [
            'r7_sy0_st0'
          ]
        ]
      }, {
        name: 'exp',
        symbolizers: [
          [
            'r8_sy0_st0'
          ]
        ]
      }, {
        name: 'floor',
        symbolizers: [
          [
            'r9_sy0_st0'
          ]
        ]
      }, {
        name: 'log',
        symbolizers: [
          [
            'r10_sy0_st0'
          ]
        ]
      }, {
        name: 'max',
        symbolizers: [
          [
            'r11_sy0_st0'
          ]
        ]
      }, {
        name: 'min',
        symbolizers: [
          [
            'r12_sy0_st0'
          ]
        ]
      }, {
        name: 'modulo',
        symbolizers: [
          [
            'r13_sy0_st0'
          ]
        ]
      }, {
        name: 'mul',
        symbolizers: [
          [
            'r14_sy0_st0'
          ]
        ]
      }, {
        name: 'pi',
        symbolizers: [
          [
            'r15_sy0_st0'
          ]
        ]
      }, {
        name: 'pow',
        symbolizers: [
          [
            'r16_sy0_st0'
          ]
        ]
      }, {
        name: 'round',
        symbolizers: [
          [
            'r17_sy0_st0'
          ]
        ]
      }, {
        name: 'sin',
        symbolizers: [
          [
            'r18_sy0_st0'
          ]
        ]
      }, {
        name: 'sqrt',
        symbolizers: [
          [
            'r19_sy0_st0'
          ]
        ]
      }, {
        name: 'sub',
        symbolizers: [
          [
            'r20_sy0_st0'
          ]
        ]
      }, {
        name: 'tan',
        symbolizers: [
          [
            'r21_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default expression_math;
