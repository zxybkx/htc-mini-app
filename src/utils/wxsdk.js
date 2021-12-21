const jWeixin = require('weixin-js-sdk');

async function initWxJsApi() {
    console.log('------')
    let res = await api.getTicket(store.state.baseInfo.companyCode)
    let corpId = res.corpId
    let ticket = res.ticket
    let timestamp = Date.parse(new Date()).toString();
    const tmp = timestamp.substr(0, 10);
    // console.log('timestamptimestamp21`2', tmp);
    let noncestr = 'htcprojectpowerbyzsakvo'
    setTimeout(jWeixin.config({
          beta: true,
          debug: false,
          appId: corpId,
          timestamp: timestamp,
          nonceStr: noncestr,
          signature: genSign.wxJsApi(timestamp, noncestr, ticket),
          jsApiList: ['scanQRCode', 'chooseInvoice']
        }), 500);
    jWeixin.ready(() => {
      console.log('jssdk 初始化成功')
    })
    jWeixin.error(function(res) {
      console.log(res)
      switch (process.env.NODE_ENV) {
        case 'uat':
          alert(JSON.stringify(res))
          break
        case 'demo':
          alert(JSON.stringify(res))
          break
        case 'prod':
          break
      }
      // config 信息验证失败会执行 error 函数，如签名过期导致验证失败，具体错误信息可以打开 config 的 debug 模式查看，也可以在返回的 res 参数中查看，对于 SPA 可以在这里更新签名。
    })
  }