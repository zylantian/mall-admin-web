import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/bill/list',
    method: 'get',
    params: params
  })
}

export function approval(data) {
  return request({
    url: '/bill/approval',
    method: 'put',
    data: data
  })
}

export function redApproval(data) {
  return request({
    url: '/bill/red-apply/approval',
    method: 'put',
    data: data
  })
}

export function delivery(data) {
  return request({
    url: '/bill/delivery',
    method: 'put',
    data: data
  })
}
