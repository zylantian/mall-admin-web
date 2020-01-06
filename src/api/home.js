import request from '@/utils/request'
export function fetchList() {
  return request({
    url: '/api/statistics/all',
    method: 'get'
  })
}

export function statisticsQuery(param) {
  return request({
    url: '/api/statistics/query',
    method: 'get',
    params: param
  })
}
