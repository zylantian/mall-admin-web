import request from '@/utils/request'

// 获取所有的Role
export function getAll() {
  return request({
    url: 'api/memberLevel/all',
    method: 'get'
  })
}

export default { getAll }
