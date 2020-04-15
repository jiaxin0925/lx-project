const flags = {
  'code': 200,
  'msg': 'success',
  'data': [
    {
      key: '1',
      id: '1',
      flagDescription: 'Top Chioce',
    },
    {
      key: '2',
      id: '2',
      flagDescription: 'Top Seller',
    },
    {
      key: '3',
      id: '3',
      flagDescription: 'Top Chioce',
    },
  ]
};

export default {
  // 支持值为 Object 和 Array
  //'GET /api/v1/flags': flags,
  'GET /api/data_management/all_flag': flags,
};
