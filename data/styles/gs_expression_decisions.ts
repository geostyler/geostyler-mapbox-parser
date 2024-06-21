/* eslint-disable @typescript-eslint/naming-convention */
import { Style } from 'geostyler-style';

const gs_expression_decisions: Style = {
  name: 'Expression Decisions',
  rules: [{
    name: 'negation',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'not',
              args: [{
                name: 'equalTo',
                args: [{
                  name: 'property',
                  args: ['mag']
                }, 1]
              }]
            },
            value: '#FFFFFF'
          }
        ]
      }
    }]
  }, {
    name: 'not equal to',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'notEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          }
        ]
      }
    }]
  }, {
    name: 'less than',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'lessThan',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          }
        ]
      }
    }]
  }, {
    name: 'less than or equal to',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'lessThanOrEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          }
        ]
      }
    }]
  }, {
    name: 'equal to',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'equalTo',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          }
        ]
      }
    }]
  }, {
    name: 'greater than',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'greaterThan',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          }
        ]
      }
    }]
  }, {
    name: 'greater than or equal to',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'greaterThanOrEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          }
        ]
      }
    }]
  }, {
    name: 'all',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'all',
              args: [
                {
                  name: 'greaterThanOrEqualTo',
                  args: [{
                    name: 'property',
                    args: ['mag']
                  }, 1]
                },
                {
                  name: 'lessThanOrEqualTo',
                  args: [{
                    name: 'property',
                    args: ['mag']
                  }, 2]
                }
              ]
            },
            value: '#FFFFFF'
          }
        ]
      }
    }]
  }, {
    name: 'any',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: {
        name: 'case',
        args: [
          '#000000',
          {
            case: {
              name: 'any',
              args: [
                {
                  name: 'equalTo',
                  args: [{
                    name: 'property',
                    args: ['mag']
                  }, 'a']
                },
                {
                  name: 'equalTo',
                  args: [{
                    name: 'property',
                    args: ['mag']
                  }, 'b']
                }
              ]
            },
            value: '#FFFFFF'
          }
        ]
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
        testsource: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      },
      sourceLayerMapping: {
        foo: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      }
    }
  }
};

export default gs_expression_decisions;
