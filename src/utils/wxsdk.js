import genSign from './genSign';
import {ApiGetTicket} from '../api/index'
const jWeixin = require('weixin-js-sdk');

export async function InitWxJsApi() {
    let res = await ApiGetTicket()
    const corpId = res.corpId;
    const ticket = res.ticket;
    const timestamp = Date.parse(new Date()).toString();
    // const tmp = timestamp.substr(0, 10);
    const noncestr = 'htcprojectpowerbyzsakvo';
    await jWeixin.config({
      beta: true,
      debug: true,
      appId: corpId,
      timestamp: timestamp,
      nonceStr: noncestr,
      signature: genSign.wxJsApi(timestamp, noncestr, ticket),
      jsApiList: ['scanQRCode', 'chooseInvoice']
    });
    console.log('jWeixin',jWeixin);
    jWeixin.ready(() => {
      console.log('jssdk 初始化成功')
    })
    jWeixin.error(function(res) {
      console.log('jssdk 初始化失败')
      console.log(res)
      // config 信息验证失败会执行 error 函数，如签名过期导致验证失败，具体错误信息可以打开 config 的 debug 模式查看，也可以在返回的 res 参数中查看，对于 SPA 可以在这里更新签名。
    })
  }