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
          },
          '#000000'
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
          {
            case: {
              name: 'notEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          },
          '#000000'
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
          {
            case: {
              name: 'lessThan',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          },
          '#000000'
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
          {
            case: {
              name: 'lessThanOrEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          },
          '#000000'
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
          {
            case: {
              name: 'equalTo',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          },
          '#000000'
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
          {
            case: {
              name: 'greaterThan',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          },
          '#000000'
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
          {
            case: {
              name: 'greaterThanOrEqualTo',
              args: [{
                name: 'property',
                args: ['mag']
              }, 1]
            },
            value: '#FFFFFF'
          },
          '#000000'
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
          },
          '#000000'
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
          },
          '#000000'
        ]
      }
    }]
  },]
};

export default gs_expression_decisions;
