import request from '@/utils/request';

export async function fetchCategories(payload) {
  return request('/categories',{
    params: {
      country: payload.country,
      language: payload.language
    },
  });
}

export async function fetchLocals() {
  return request('/locals');
}

export async function powerList(payload) {
  return request(`/user/permission`);
}
