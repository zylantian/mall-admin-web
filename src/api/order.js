import request from '@/utils/request'
import qs from 'qs'
export function fetchList(params) {
  return request({
    url:'/order/list',
    method:'get',
    params:params
  })
}

export function fetchUnrealList(params) {
  return request({
    url:'/order/list/unreal',
    method:'get',
    params:params
  })
}

export function closeOrder(params) {
  return request({
    url:'/order/update/close',
    method:'post',
    params:params
  })
}

export function deleteOrder(params) {
  return request({
    url:'/order/delete',
    method:'post',
    params: params
  })
}

export function deliveryOrder(data) {
  return request({
    url:'/order/update/delivery',
    method:'post',
    data:data
  });
}

export function fetchListNew(params) {
  return request({
    url:'/order/list',
    method:'post',
    data:params
  })
}


export function getOrderDetail(id) {
  return request({
    url:'/order/'+id,
    method:'get'
  });
}

export function updateReceiverInfo(data) {
  return request({
    url:'/order/update/receiverInfo',
    method:'post',
    data:data
  });
}

export function updateMoneyInfo(data) {
  return request({
    url:'/order/update/moneyInfo',
    method:'post',
    data:data
  });
}

export function updateOrderNote(params) {
  return request({
    url:'/order/update/note',
    method:'post',
    params:params
  })
}

export function confirmLoan(params) {
  return request({
    url:'/order/confirmLoan',
    method:'post',
    params: params
  })
}

export function viewLogistics(params) {
  return request({
    url:'/order/logistics',
    method:'get',
    params: params
  })
}


export function detailDownload(query) {
  return request({
    url: '/order/detail-download?' + qs.stringify(query, { indices: false }),
    method: 'POST',
    responseType: 'blob'
  })
}

export function summaryDownload(query) {
  return request({
    url: '/order/summary-download?' + qs.stringify(query, { indices: false }),
    method: 'POST',
    responseType: 'blob'
  })
}
