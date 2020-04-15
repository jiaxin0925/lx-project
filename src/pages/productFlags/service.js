import request from '@/utils/request';

const GEO_PATH = '/basedata/country/geo';
const LEAPS_PATH = '/basedata/product/leapPoints';
const PRODUCT_PATH = '/basedata/product/flags';
const FLAG_SEQ_PATH = '/basedata/country/flagSequences';
const token = localStorage.getItem('dpc-data-management');

export async function download({ type, values, onDownloadFinish }) {
  const data = {
    district: values.country,
    partNumbers: values.partNumber,
    flags: values.flags,
    salesStatuses: values.salesStatus,
    productTypes: values.productType,
    models: values.models,
    leaps: values.leaps
  };
  downloadAsPost(data, `${process.env.API_ENV}/api/v1${PRODUCT_PATH}/download/` + type + `?dpc-data-management-token=` + token, onDownloadFinish);
}

export async function downloadSelected({ type, values, onDownloadFinish }) {
  downloadAsPost(values, `${process.env.API_ENV}/api/v1${PRODUCT_PATH}/download/` + type + `?dpc-data-management-token=` + token, onDownloadFinish);
}

function downloadAsPost(data, url, onDownloadFinish) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.responseType = 'blob';
  xhr.onload = function () {
    onDownloadFinish.apply();
    const disposition = this.getResponseHeader('content-disposition');
    if (disposition !== null){
      const filename = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)[1].trimLeft();
      const blob = new Blob([this.response], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      link.remove();
    }

  };
  xhr.send(JSON.stringify(data));
}

export async function fetchCountryGeo() {
  return request.get(`${GEO_PATH}`);
}

export async function fetchByCountry(values) {
  return request.get(`${PRODUCT_PATH}/byCountry`, {
    params: {
      country: values.country
    }
  });
}

export async function fetchByCountries(values) {
  return request.get(`${FLAG_SEQ_PATH}/byDistrict`,{
    params: {
      district: values.country
    }
  });
}

export async function updateLeapPoints(values) {
  return request.put(`${LEAPS_PATH}`, {
    data: {
      countries: values.country,
      partNumber: values.partNumber,
      productType: values.productType,
      leapPoint: values.leapPoint
    }
  });
}

export async function updateFlags(values) {
  return request.put(`${PRODUCT_PATH}`, {
    data: {
      countries: values.countries,
      partNumber: values.partNumber,
      flags: values.flags,
      productType: values.productType
    }
  });
}

export async function findProductFlagsPaged(values) {
  return request.post(`${PRODUCT_PATH}`, {
    params: {
      start: (values.currentPage - 1) < 0 ? 0 : (values.currentPage - 1) * values.pageSize,
      count: values.pageSize
    },
    data: {
      district: values.country,
      partNumbers: values.partNumber,
      flags: values.flags,
      salesStatuses: values.salesStatus,
      productTypes: values.productType,
      models: values.models,
      leaps: values.leaps
    }
  });
}
