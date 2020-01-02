import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/sales',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/sales',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/sales/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/sales',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts }
