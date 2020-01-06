import request from '@/utils/request'
export function fetchList() {
  return request({
    url: '/api/statistics/all',
    method: 'get'
  })
}
