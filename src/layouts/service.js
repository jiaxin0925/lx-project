import request from '@/utils/request';

export async function loginUser(payload) {
  return request.post(`/user/session/login`,{
    data:{
      username: payload.username,
      password: payload.password
    }
  });
}

export async function logout(payload) {
  return request.post(`/user/session/logout`);
}

export async function powerList(payload) {
  return request(`/user/permission`);
}

