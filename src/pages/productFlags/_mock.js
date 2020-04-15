const productFlags = {
  'code': 10,
  'msg': 'success',
  'data': [{
    'partNumber': '7X06A00KEA',
    'description': 'UK,DE',
    'country': 'GB',
    'flags': 'TS,TC,BS',
    'productType': 'CTO',
    'leapPoint': '89'
  },
    {
      'partNumber': '7X07A00KEA',
      'description': 'US,ZH',
      'country': 'GB',
      'flags': 'TS,TC,BS',
      'productType': 'LFO',
      'leapPoint': '102'
    },
    {
      'partNumber': '7X08A00KEA',
      'description': 'US,ZH',
      'country': 'GB',
      'flags': 'TS,TC,BS',
      'productType': 'OPTION',
      'leapPoint': '63'
    },
  ],
};

export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/productFlags': productFlags,
};
