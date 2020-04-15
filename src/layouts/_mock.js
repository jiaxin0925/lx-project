const login = {
	'code': 200,
	'data':[
		{"username":111, 'password':222, 'token':123456}
	]
};


export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/user': login,
};
