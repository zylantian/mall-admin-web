import request from '@/utils/request'
import qs from 'qs'

export function initData(url, params) {
  let tempUrl
  if (url.indexOf('?') != -1) {
    tempUrl = url + '&' + qs.stringify(params, { indices: false })
  } else {
    tempUrl = url + '?' + qs.stringify(params, { indices: false })
  }
   return request({
    url: tempUrl,
    method: 'get'
  })
}

export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
