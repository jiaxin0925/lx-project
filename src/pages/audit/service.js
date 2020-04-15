import request from '@/utils/request';

const TABLE_PATH = '/audit/audits';

export async function fetchByTable() {
  return request.get(`${TABLE_PATH}/objects`);
}

export async function fetchByOperator(values) {
  return request.get(`${TABLE_PATH}/users`,{
    params: {
      table: values
    }
  })
}

export async function fetchAuditDate(values) {
  if(values.object == "a"){
    values.object = "product_flag_mapping";
  }else if(values.object == "b"){
    values.object = "product_leappoint_mapping";
  }
  return request.get(`${TABLE_PATH}`, {
    params: values
  })
}

