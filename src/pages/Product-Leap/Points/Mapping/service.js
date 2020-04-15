import request from '@/utils/request';

const GEO_PATH = '/basedata/country/geo';
const Progress_PATH = '/basedata/product/leapPoints/upload/progress';
const ProgressBar_PATH = '/basedata/product/leapPoints/upload/cancel';
const CheckUpload_PATH = '/basedata/product/leapPoints/upload/existing';

export async function fetchCountryGeo() {
  return request.get(`${GEO_PATH}`);
}

export async function fetchProgressBar(id) {
  return request.get(`${Progress_PATH}`, {
    params: {
      requestId: id
    },
    headers: {
      'accept': 'text/html'
    }
  })
}

export async function fetchCancelProgressBar(id) {
  return request.put(`${ProgressBar_PATH}`, {
    params: {
      requestId: id
    }
  })
}

export async function fetchcheckIsUpload(type) {
  return request.get(`${CheckUpload_PATH}`, {
    params: {
      type: type
    }
  })
}
