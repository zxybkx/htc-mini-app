import uniRequest from '../utils/util'

/**
 * 发起 get 请求
 * @param url 请求路径 必填
 * @param data 请求参数 get 请求的参数会自动拼到地址后面
 * @param headers 请求头 选填
 * @param other 其他请求参数
 * @returns {Promise}
 */
export const get = (url, data={}, headers={},other={}) => uniRequest({url, params:{method:'GET',data,headers,...other}});
export const effGet= ({url,params:{}}) => uniRequest({url, params:{method:'GET',headers:{},...params}});
 /**
  * 发起 post 请求
  * @param url 请求路径 必填
  * @param data 请求参数
  * @param headers 请求头 选填
  * @param other 其他请求参数
  * @returns {Promise}
  */
export const post = (url, data={}, headers={},other={}) => uniRequest({url, params:{method:'POST',data,headers,...other}});
export const effPost= ({url,params}) => uniRequest({url, params:{method:'POST',headers:{},...params}});
/**
 * 
 * 上传文件
 * 
 */

export const fileUpload = (url, data, headers={}) => uniRequest({url, params:{method:'file',...data, headers}})