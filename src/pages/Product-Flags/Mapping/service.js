import request from '@/utils/request';

const GEO_PATH = '/basedata/country/geo';
const FLAG_SEQ_PATH = '/basedata/country/flagSequences';
const ProgressBar_PATH = '/basedata/product/leapPoints/upload/cancel';
const CheckUpload_PATH = '/basedata/product/leapPoints/upload/existing';

export async function fetchCountryGeo() {
  return request.get(`${GEO_PATH}`);
}

export async function fetchFlagsByDistrict(district) {
  return request.get(`${FLAG_SEQ_PATH}/byDistrict`,{
    params: {
      district: district
    }
  });
}

export async function dowflags() {
  return request.get(`${process.env.API_ENV}/api/v1/basedata/product/flags/download/flagsTemplate`)
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
