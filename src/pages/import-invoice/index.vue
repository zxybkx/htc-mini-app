<style lang="scss">
page{
    background:#F6F6F6;
}
.container{
    padding: 0rpx 20rpx;
}
</style>

<template>
    <view class="container">
        <user-card :currentCompany="currentCompany" />
        <navSection-ui @startUse="HandleElectronicTicket">
            <view slot="title">导入电子发票</view>
            <view slot="tipDetail">使用前请先确保您的卡包中含有电子发票，导入后可在“我的发票”中查看电子发票</view>
        </navSection-ui>
    </view>
</template>
<script>
import {ApiIsInvExist,ApiCheckInv,ApiGetEmployeeClearTips,ApiGetIsvToken,ApiGetTicket,ApiGetWxInfoBatch} from '@/api';
import userCard from '@/common/userCard.vue';
import navSectionUi from '@/components/navSectionUi.vue';
import { ISV_APP_CODE } from '@/utils/constant';
import {BrowserEnv} from '../../utils/browserEnv';
import '@/static/cloud.js';
import genSign from '@/utils/genSign';
const jWeixin = require('weixin-js-sdk');
const browserEnv=BrowserEnv();
const formatTime= time => {
    time *= time.toString().length < 13 ? 1000 : 1;
    var date = new Date(time + 8 * 3600 * 1000);
    return date
        .toJSON()
        .substr(0, 19)
        .replace('T', ' ')
}
const forMatting=arr=>{
    return arr.map(obj => {
        let info = obj['user_info'];
        return {
            invoiceDate: formatTime(info['billing_time']).split(' ')[0],
            invoiceTypeMeaning: obj.type,
            buyerName: info['title'],
            salerName: obj['payee'],
            invoiceCode: info['billing_no'],
            invoiceNumber: info['billing_code'],
            invoiceNo: info['billing_code'],
            checkCode: info['check_code'],
            invoiceAmount: (info['fee_without_tax'])*0.01,
            totalAmount: info['fee']*0.01,
            imageUrl: info['pdf_url'],
            fileUrl:info['pdf_url'],
            currency:'CNY',
            buyerTaxNo:info['buyer_number'],
            buyerAddressPhone: info['buyer_address_and_phone'],
            buyerAccount: info['buyer_bank_account'],
        }
    });
}
export default {
    data(){
        return{
            currentCompany:{}
        }
    },
    components: {
        userCard,
        navSectionUi
    },
    methods: {
        async HandleElectronicTicket(){
            try {
                // uni.showLoading({title: '开始处理'})

                // #ifdef MP-ALIPAY
                this.subAlipay();
                // #endif
                // #ifdef H5
                switch (browserEnv) {
                    case 1:
                        this.subWXwork();
                        break;
                    case 2:
                        this.subDingding();
                        break;
                    default:
                        this.subWXwork();
                        break;
                }
                // #endif
                // uni.hideLoading();
                // uni.navigateTo({
                //     url:'/pages/import-invoice-list/index'
                // })
            } catch (error) {
                uni.hideLoading();
                console.log('获取票包信息出错',error);
                uni.showModal({title:'错误',content:error.message,showCancel:false})
            }    
        },
        async subAlipay(){
            // 支付宝
            // 获取授权authCode
            const getIsvToken = await ApiGetIsvToken();
            console.log('//this.currentCompany.taxpayerNumber',this.currentCompany.taxpayerNumber);
            my.navigateToMiniProgram({
                appId: '77700150', // 固定值，请勿修改
                path: `pages/select-invoice-bill/index?isv_app_code=${ISV_APP_CODE}&isv_token=${getIsvToken.isvToken}&isv_serial_no=${getIsvToken.serialNo}&isv_register_no=${this.currentCompany.taxpayerNumber}&source=einvoice&channel=reim_helper`,
                success: (res) => {
                    console.log('成功',res)
                    uni.hideLoading();
                    console.log(JSON.stringify(res))
                },
                fail: (res) => {
                    uni.hideLoading();
                    console.log('错误',res)
                }
            });
        },
        async subWXwork(){
            let res = await ApiGetTicket()
            const corpId = res.corpId;
            const ticket = res.ticket;
            const timestamp = Date.parse(new Date()).toString();
            const noncestr = 'htcprojectpowerbyzsakvo';

            jWeixin.invoke('chooseInvoice',{
                timestamp: timestamp, // 卡券签名时间戳
                nonceStr: noncestr, // 卡券签名随机串
                signType: 'SHA1', // 签名方式，默认'SHA1'
                cardSign: genSign.invoice(corpId, timestamp, noncestr, ticket) // 卡券签名
            },async res=>{
                let invInfos = JSON.parse(res['choose_invoice_info']);
                let invRes =await ApiGetWxInfoBatch({
                    item_list: invInfos
                })
                let items = invRes['item_list'];
                if(items.length > 0){
                    const backRes = forMatting(items);
                    getApp().globalData.currentInvoiceAllInfo=backRes;
                    uni.hideLoading();
                    uni.navigateTo({
                        url:'/pages/import-invoice-list/index'
                    })
                }else{
                    uni.hideLoading();
                    uni.showModal({
                        title: '错误',
                        content: invRes.errmsg,
                        showCancel: false
                    })
                }
            })
        },
        async subDingding(){
            const c = new cloud.Cloud({
                // 必填，表示是未登录模式
                identityless: true,
                // 资源方 AppID
                resourceAppid: 'wxe856d7c85072dd8f', // <!-- replace -->
                // 资源方环境 ID
                resourceEnv: 'test-5gy1wiji7cd73e99', // <!-- replace -->
            })
            await c.init()
            const res = await c.callFunction({
                name: 'public',
                data: {
                    action: 'getUrlScheme',
                },
            });
            uni.hideLoading();
            console.log('//跳转微信url',res);
            if(res.result.openlink){
                location.href = res.result.openlink;
            }
        }
    },
    onLoad(options){
      const tempCurrentCompany=getApp().globalData.currentCompanyInfo;
      this.currentCompany=tempCurrentCompany;
    }
}
</script>