const leapPoints = {
  'code': 10,
  'msg': 'success',
  'data': [{
    'Geo/Reg/Sub Reg': 'NA',
    'Countries': 'UK,DE',
    'Top Seller': '1',
    'Top Choice': '3',
    'Best Seller': '2',
    'ccc':'4'
  },
    {
      'Geo/Reg/Sub Reg': 'AP',
      'Countries': 'US,ZH',
      'Top Seller': '2',
      'Top Choice': '2',
      'Best Seller': '1',
      'ccc': '5'
    },
    {
      'Geo/Reg/Sub Reg': 'EMEA/GP',
      'Countries': 'US,ZH',
      'Top Seller': '3',
      'Top Choice': '1',
      'Best Seller': '3',
      'ccc': '6'
    },
  ],
};

export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/leapPoints': leapPoints,
};
