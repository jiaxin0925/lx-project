const categories = {
  "code": 10,
  "data": [
    {
      "category_id": "1004",
      "description": "defineFlags",
      "level": 1,
      "parent": "*",
      "sequence": 1004
    },
    {
      "category_id": "1007",
      "description": "leapUpload",
      "level": 1,
      "parent": "*",
      "sequence": 1007
    },
    {
      "category_id": "1008",
      "description": "productFlags",
      "level": 1,
      "parent": "*",
      "sequence": 1008
    }
  ],
  "msg": "success"
};

const locals = {
  "code": 200,
  "msg": "success",
  "data": [{
      "countryCode": "US",
      "countryName": "United States",
      "currency": "USD",
      "region": "NA",
      "languages":[{"languageName":"English","languageCode":"en","defaulted":true}]
  },{
      "countryCode": "GB",
      "countryName": "United Kingdom",
      "currency": "GBP",
      "region": "EMEA",
      "languages":[{"languageName":"English","languageCode":"gb","defaulted":true}]
  }]
}

export default {
  // 支持值为 Object 和 Array
  'GET /api/categories': categories,
  'GET /api/locals': locals
};
