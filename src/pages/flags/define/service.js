import request from '@/utils/request';

const PATH = '/basedata/flags';

export async function findAll(payload) {
  return request.get(`${PATH}` , {
    params: {
      // description: payload.description,
      start: payload.start,
      count: payload.count
    }
  });
}

export async function createOrUpdateFlag( { id, description, color } ) {
  if (id) {
    return request.put(`${PATH}/${id}`, {
      data: {
        description: description,
        color: color
      }
    });
  } else {
    return request.post(`${PATH}`, {
      data: {
        description: description,
        color: color
      }
    });
  }
}

export async function deleteFlag(id) {
  return request.delete(`${PATH}/${id.id}`);
}

export async function isEditable(description) {
  return request.get(`${PATH}/editable`, {
    params: {
      description: description,
    }
  });
}

export async function findByDescription(values) {
  return request.get(`${PATH}/byDescription`, {
    params: {
      description: values.description,
      start: values.start,
      count: values.count
    },
  });
}

