import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function add(data) {
  return request({
    url: 'api/customer',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/customer/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/customer',
    method: 'put',
    data
  })
}
export function resetPass(id) {
  return request({
    url: 'api/customer/resetPass/' + id,
    method: 'post'
  })
}
export default { add, edit, del }

