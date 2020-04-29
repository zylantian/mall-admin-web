import request from '@/utils/request'

export function del(id) {
  return request({
    url: 'api/dept/region/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: 'api/dept/region',
    method: 'post',
    data
  })
}

export function getSelfRegion() {
  return request({
    url: 'api/dept/region/self/list',
    method: 'get'
  })
}

export default {del, add}
