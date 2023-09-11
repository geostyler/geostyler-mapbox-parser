/* eslint-disable @typescript-eslint/naming-convention */
import { MbStyle } from '../../src/MapboxStyleParser';

const expression_decisions: MbStyle = {
  version: 8,
  name: 'Expression Decisions',
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
        'circle-color': [
          'case',
          ['!', ['==', ['get', 'mag'], 1]],
          '#FFFFFF',
          '#000000'
        ]
      }
    },
    {
      id: 'r1_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['!=', ['get', 'mag'], 1],
          '#FFFFFF',
          '#000000'
        ]
      }
    },
    {
      id: 'r2_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['<', ['get', 'mag'], 1],
          '#FFFFFF',
          '#000000'
        ]
      }
    },
    {
      id: 'r3_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['<=', ['get', 'mag'], 1],
          '#FFFFFF',
          '#000000'
        ]
      }
    },
    {
      id: 'r4_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['==', ['get', 'mag'], 1],
          '#FFFFFF',
          '#000000'
        ]
      }
    },
    {
      id: 'r5_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['>', ['get', 'mag'], 1],
          '#FFFFFF',
          '#000000'
        ]
      }
    },
    {
      id: 'r6_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['>=', ['get', 'mag'], 1],
          '#FFFFFF',
          '#000000'
        ]
      }
    },
    {
      id: 'r7_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['all',
            ['>=', ['get', 'mag'], 1],
            ['<=', ['get', 'mag'], 2]
          ],
          '#FFFFFF',
          '#000000'
        ]
      }
    },
    {
      id: 'r8_sy0_st0',
      source: 'testsource',
      'source-layer': 'foo',
      type: 'circle',
      paint: {
        'circle-color': [
          'case',
          ['any',
            ['==', ['get', 'mag'], 'a'],
            ['==', ['get', 'mag'], 'b']
          ],
          '#FFFFFF',
          '#000000'
        ]
      }
    }
  ],
  metadata: {
    'geostyler:ref': {
      rules: [{
        name: 'negation',
        symbolizers: [
          [
            'r0_sy0_st0'
          ]
        ]
      }, {
        name: 'not equal to',
        symbolizers: [
          [
            'r1_sy0_st0'
          ]
        ]
      }, {
        name: 'less than',
        symbolizers: [
          [
            'r2_sy0_st0'
          ]
        ]
      }, {
        name: 'less than or equal to',
        symbolizers: [
          [
            'r3_sy0_st0'
          ]
        ]
      }, {
        name: 'equal to',
        symbolizers: [
          [
            'r4_sy0_st0'
          ]
        ]
      }, {
        name: 'greater than',
        symbolizers: [
          [
            'r5_sy0_st0'
          ]
        ]
      }, {
        name: 'greater than or equal to',
        symbolizers: [
          [
            'r6_sy0_st0'
          ]
        ]
      }, {
        name: 'all',
        symbolizers: [
          [
            'r7_sy0_st0'
          ]
        ]
      }, {
        name: 'any',
        symbolizers: [
          [
            'r8_sy0_st0'
          ]
        ]
      }]
    }
  }
};

export default expression_decisions;
