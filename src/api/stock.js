import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/stock/list',
    method: 'get',
    params: params
  })
}

export function addOrder(data) {
  return request({
    url: '/stock/add-order',
    method: 'post',
    data: data
  })
}

export function cancelOrder(id) {
  return request({
    url: '/stock/order/cancel/' + id,
    method: 'delete'
  })
}

export function orderDetail(id) {
  return request({
    url: '/stock/order/detail/' + id,
    method: 'get'
  })
}

export function approval(data) {
  return request({
    url: '/stock/order/approval',
    method: 'put',
    data: data
  })
}


export function delivery(data) {
  return request({
    url: '/stock/delivery',
    method: 'post',
    data: data
  })
}

export function deliveryConfirm(data) {
  return request({
    url: '/stock/delivery/confirm',
    method: 'put',
    data: data
  })
}


export function fetchProductList(id) {
  return request({
    url: '/stock/'+ id+ '/product/list',
    method: 'get'
  })
}
