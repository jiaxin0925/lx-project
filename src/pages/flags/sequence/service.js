import request from '@/utils/request';

const FLAG_PATH = '/basedata/flags';
const GEO_PATH = '/basedata/country/geo';
const PATH = '/basedata/country/flagSequences';

export async function fetchByCountries(values) {
  return request.get(`${PATH}`, {
    params: {
      district: values.district? values.district : values.value,
      start: values.start,
      count: values.count
    },
  });
}

export async function fetchCountryGeo() {
  return request.get(`${GEO_PATH}`);
}

export async function fetchAllDescription() {
  return request.get(`${FLAG_PATH}/description`);
}

export async function deleteCountryFlagSeq(district) {
  return request.delete(`${PATH}`, {
    params: {
      district: district,
    },
  });
}

export async function addOrUpdateCountryFlagSeq(district, updates) {
  const obj = {
    district: district,
    updates: updates
  };
  return request.put(`${PATH}`, {
    data: {
      ...obj,
    }
  });
}

export async function addCountryFlagSeq(district, updates) {
  const obj = {
    district: district,
    updates: updates
  };
  return request.post(`${PATH}`, {
    data: {
      ...obj,
    }
  });
}
