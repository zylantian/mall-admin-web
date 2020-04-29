import request from '@/utils/request'

export function del(id) {
  return request({
    url: 'product/region/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: 'product/region',
    method: 'post',
    data
  })
}

export default {del, add}
