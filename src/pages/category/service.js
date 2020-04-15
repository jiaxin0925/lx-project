import request from '@/utils/request';

// export async function fetchCategory(payload) {
//   const openIds = payload.openIds.map(v => 'openIds=' +v).join('&');
//   return request(`/category/categories?`+openIds);
// }

export async function deleteCategory(payload) {
  const ids = payload.ids.map(item => 'ids=' +item).join('&');
  return request.delete(`/category/categories?` + ids);
}

export async function editCategory(payload) {
  return request.put(`/category/categories/${payload.id}/edit`, {
    data: {
      imageUrl: payload.imageUrl,
      description: payload.description,
      demoUrl: payload.demoUrl,
      dataSheetUrl: payload.datasheetUrl,
      learnMore: payload.learnMore,
      sae: payload.sae,
      vendor: payload.vendorName,
      restrictedSearch: payload.res_search,
      overview: payload.overview,
      visibility: payload.visibility
    },
  })
}

export async function editCategorySearch(payload) {
  return request.put(`/category/categories/${payload.id}/edit/unConfigurable`,{
    data:{
      restrictedSearch: payload.res_search,
      overview: payload.overview,
      visibility: payload.visibility,
      imageUrl: payload.imageUrl,
    }
  })
}

export async function addCategory(payload) {
  return request.post(`/category/categories`, {
    data: {
      description: payload.name,
      level: payload.level,
      parentId: payload.pId
    },
  })
}

export async function dragCategory(payload) {
  return request.put(`/category/categories/drag`, {
    data: {
      ids: payload.ids,
      pId: payload.pId,
      rightToLeft: payload.rightToLeft,
      draggedIds: payload.draggedIds
    },
  })
}

export async function searchCategory(payload) {
  return request(`/category/categories/search`, {
    params: {
      left: payload.left,
      q: payload.q
    },
  })
}

export async function getEditCategory(payload) {
  return request(`/category/categories/${payload.id}`, {
    params: {
      id: payload.id,
    },
  })
}

export async function transferCategory(payload) {
  return request.put(`/category/categories/${payload.id}/transfer`, {
    data: {
      id: payload.id
    },
  })
}

export async function batchCategory(payload) {
  return request.post(`/category/categories/batch`, {
    data: {
      requestId: payload.requestId,
      openIds: payload.openIds,
      leftLevels:payload.leftLevels,
      rightLevels:payload.rightLevels
    },
  })
}
