const crypto = require('crypto')

function wxJsApi(timestamp, noncestr, ticket) {
  let url = window.location.href
  if (url.indexOf('#') != -1) {
    url = url.split('#')[0]
  }
  // url = window.location.origin + '/'
  url = window.location.href.replace(/#.*/, '')
  let jsapi_ticket = ticket
  let str = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
  let signature = crypto
    .createHash('sha1')
    .update(str)
    .digest('hex')
  return signature
}

function invoice(appid, timestamp, nonceStr, ticket) {
  let arr = []
  let obj = {
    cardType: 'INVOICE',
    timestamp: timestamp / 1000,
    appid: appid,
    nonceStr: nonceStr,
    api_ticket: ticket
  }
  arr = Object.values(obj)
  arr.sort()
  let signature = crypto
    .createHash('sha1')
    .update(arr.join(''))
    .digest('hex')
  return signature
}

let genSign = { wxJsApi, invoice }

module.exports = genSign
