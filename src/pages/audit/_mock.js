const user = {
  'code': 200,
  'msg': 'success',
  'data': [{
    'id': '7X06A00KEA',
    'username': 'UK,DE',
    'usermsg': 'GB',
    'flags': 'TS,TC,BS',
    'productType': 'CTO',
    'leapPoint': '89'
  },
    {
      'id': '7X07A00KEA',
      'username': 'US,ZH',
      'usermsg': 'GB',
      'flags': 'TS,TC,BS',
      'productType': 'LFO',
      'leapPoint': '102'
    },
    {
      'id': '7X08A00KEA',
      'username': 'US,ZH',
      'usermsg': 'GB',
      'flags': 'TS,TC,BS',
      'productType': 'OPTION',
      'leapPoint': '63'
    },
  ],
};

export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/productFlags': user,
};
