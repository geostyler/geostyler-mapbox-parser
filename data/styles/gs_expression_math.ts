/* eslint-disable @typescript-eslint/naming-convention */
import { Style } from 'geostyler-style';

const gs_expression_math: Style = {
  name: 'Expression Math',
  rules: [{
    name: 'add',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'add',
        args: [13, 3, 7]
      }
    }]
  }, {
    name: 'abs',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'abs',
        args: [-12]
      }
    }]
  }, {
    name: 'acos',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'acos',
        args: [4]
      }
    }]
  }, {
    name: 'asin',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'asin',
        args: [4]
      }
    }]
  }, {
    name: 'atan',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'atan',
        args: [4]
      }
    }]
  }, {
    name: 'ceil',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'ceil',
        args: [3.4]
      }
    }]
  }, {
    name: 'cos',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'cos',
        args: [3.4]
      }
    }]
  }, {
    name: 'div',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'div',
        args: [100, 2]
      }
    }]
  }, {
    name: 'exp',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'exp',
        args: [1]
      }
    }]
  }, {
    name: 'floor',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'floor',
        args: [3.5]
      }
    }]
  }, {
    name: 'log',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'log',
        args: [4.6]
      }
    }]
  }, {
    name: 'max',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'max',
        args: [13, 37, 0, 8, 15]
      }
    }]
  }, {
    name: 'min',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'min',
        args: [13, 37, 0, 8, 15]
      }
    }]
  }, {
    name: 'modulo',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'modulo',
        args: [3, 2]
      }
    }]
  }, {
    name: 'mul',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'mul',
        args: [2, 2.5, 10]
      }
    }]
  }, {
    name: 'pi',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'pi'
      }
    }]
  }, {
    name: 'pow',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'pow',
        args: [2, 4]
      }
    }]
  }, {
    name: 'round',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'round',
        args: [13.37]
      }
    }]
  }, {
    name: 'sin',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'sin',
        args: [1]
      }
    }]
  }, {
    name: 'sqrt',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'sqrt',
        args: [1]
      }
    }]
  }, {
    name: 'sub',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'sub',
        args: [5, 6]
      }
    }]
  }, {
    name: 'tan',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      radius: {
        name: 'tan',
        args: [1]
      }
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
        testsource: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
      },
      sourceLayerMapping: {
        foo: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
      }
    }
  }
};

export default gs_expression_math;
