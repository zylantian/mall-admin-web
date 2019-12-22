import request from '@/utils/request'

export function add(data) {
}

export function del(id) {
  return request({
    url: 'api/enterprise/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/enterprise',
    method: 'put',
    data
  })
}
export default { add, edit, del }

