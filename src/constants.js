import { exportTableToCSV, saveCanvasFromVisualization } from './utilities'

export const menuItemDefs = {
  Chart: [{
    key: 'saveChart',
    icon: 'download',
    text: 'Export',
    onClick: saveCanvasFromVisualization
  }],
  Map: [],
  Summary: [],
  Table: [{
    key: 'exportTable',
    icon: 'download',
    text: 'Export',
    onClick: exportTableToCSV
  }]
}

export const operators = [{
    primaryText: '=',
    value: '='
  }, {
    primaryText: '!=',
    value: '!='
  }, {
    primaryText: '>',
    value: '>'
  }, {
    primaryText: '>=',
    value: '>='
  }, {
    primaryText: '<',
    value: '<'
  }, {
    primaryText: '<=',
    value: '<='
  } //, {
  //   primaryText: 'IN',
  //   value: 'IN'
  // }, {
  //   primaryText: 'IN_MATCHES',
  //   value: 'IN_MATCHES'
  // }, {
  //   primaryText: 'IS_NOT_NULL',
  //   value: 'IS_NOT_NULL'
  // }, {
  //   primaryText: 'IS_NULL',
  //   value: 'IS_NULL'
  // }, {
  //   primaryText: 'LUCENE',
  //   value: 'LUCENE'
  // }, {
  //   primaryText: 'MATCHES',
  //   value: 'MATCHES'
  // }, {
  //   primaryText: 'NOT_EQUAL',
  //   value: 'NOT_EQUAL'
  // }, {
  //   primaryText: 'NOT_IN',
  //   value: 'NOT_IN'
  // }, {
  //   primaryText: 'NOT_IN_MATCHES',
  //   value: 'NOT_IN_MATCHES'
  // }, {
  //   primaryText: 'NOT_MATCHES',
  //   value: 'NOT_MATCHES'
  // }
]
