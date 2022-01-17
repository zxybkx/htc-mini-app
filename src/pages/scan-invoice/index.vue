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
        <navSection-ui @startUse="HandleStartUse">
            <view slot="title">欢迎使用扫描发票</view>
            <view slot="tipDetail">请保持发票二维码平整，扫码时将整个二维码置于扫描框内（不宜过大或过小）</view>
        </navSection-ui>
    </view>
</template>
<script>
import {ApiIsInvExist,ApiCheckInv} from '@/api';
import userCard from '@/common/userCard.vue';
import navSectionUi from '@/components/navSectionUi.vue';
import {formatCheckObj,formatExistInvObj} from '@/utils/formatInvObj';
//扫发票二维码对应字段
const invObjKeys = ['version','invoiceType','invoiceCode','invoiceNumber',
    'invoiceAmount','invoiceDate','checkCode','crc'];
const jWeixin = require('weixin-js-sdk');
import {BrowserEnv} from '../../utils/browserEnv';
const browserEnv=BrowserEnv();
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
    methods:{
      async HandleStartUse(){
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
      },
      async subWXwork(){
        console.log(jWeixin);
        const self=this;
        jWeixin.scanQRCode({
          desc: '请将您的发票二维码置于取景框中',
          needResult: 1, // 默认为 0，扫描结果由企业微信处理，1 则直接返回扫描结果，
          scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: async res => {
            //格式化二维码数据
            let invObj = {}
            res.resultStr.split(',').forEach((key, index) => {
              invObj[invObjKeys[index]] = key;
            })
            self.subDispose(invObj);
          },
          error: res =>{
            console.log(res)
            // res.message&&uni.showModal({title: '错误',content: '扫码错误',showCancel: false})
          }
        })
      },
      subDingding(){
        const self=this;
        dd.biz.util.scan({
          type: 'qrCode',
          onSuccess: async res => {
            //格式化二维码数据
            let invObj = {}
            res.text.split(',').forEach((key, index) => {
              invObj[invObjKeys[index]] = key;
            })
            self.subDispose(invObj);
          },
          onFaild: res =>{
            console.log(res)
            // res.message&&uni.showModal({title: '错误',content: '扫码错误',showCancel: false})
          }
        })
      },
      async subAlipay(){
        try {
          const [error,scanRes]=await uni.scanCode({onlyFromCamera: true,scanType:['qrCode']});
          if(error) throw error;
          //格式化二维码数据
          let invObj = {}
          scanRes.result.split(',').forEach((key, index) => {
            invObj[invObjKeys[index]] = key;
          })
          this.subDispose(invObj);
        } catch (error) {
          error.message&&uni.showModal({title: '错误',content: '扫码错误',showCancel: false})
        }
      },
      async subDispose(invObj){
        try {
          
          //根据识别出的发票代码、发票号码，到对应“当前企业”发票池查找对应发票记录
          uni.showLoading({title: '开始处理'})
          const serchResult=await ApiIsInvExist(invObj);
          if (serchResult.content.length > 0) {
            // 发票池中有对应发票记录
            const invObj = serchResult.content[0];
            if (invObj.ticketCollector) {
              //如果已分配售票员工
              uni.showModal({
                title: '错误',
                content: getApp().globalData.tipInvoiceUser ? '该发票已存在于发票池，不可重复采集。如有疑问，请联络系统管理员。'
                : `您所采集的发票已经由员工 ${invObj['companyCode']}-${invObj['employeeNum']}-${invObj['ticketCollector']}-${invObj['employeeIdentify']} 采集并拥有，请联系此员工删除此发票记录或者联系公司管理员将发票重新分配给您。`,
                showCancel: false
              })
              uni.hideLoading();
              // 测试代码
              // this.$app.$options.globalData.currentInvoiceAllInfo=invObj;
              // this.$app.$options.globalData.currentInvoiceInfo=formatExistInvObj(invObj);
              // wx.navigateTo({url: '/pages/scanInvoiceDetail'});
              // 测试代码结束
              return;
            } else {
              //未分配售票员工，发票归于当前登录用户，进入发票详情
              getApp().globalData.currentInvoiceAllInfo=invObj;
              getApp().globalData.currentInvoiceInfo=formatExistInvObj(invObj);
              uni.hideLoading();
              uni.navigateTo({url: '/pages/scan-invoice-detail/index'});
            }
          } else {
            //不存在这个发票，开始查验 
            const checkResult=await ApiCheckInv(invObj);
            if(checkResult.status == '0001'){
              //查验成功，直接进入发票详情
              getApp().globalData.currentInvoiceAllInfo=checkResult.data;
              getApp().globalData.currentInvoiceInfo=formatCheckObj(checkResult.data);
              uni.hideLoading();
              uni.navigateTo({url: '/pages/scan-invoice-detail/index'});
            }else{
              // 抛错
              throw checkResult;
            }
          }
        } catch (error) {
          console.log('error',error);
          uni.hideLoading();
          error.message&&uni.showModal({title: '错误',content: error.message,showCancel: false})
            // :uni.showModal({title: '错误',content: '二维码识别失败了',showCancel: false})
        }
      }
    },
    onLoad(){
      const tempCurrentCompany=getApp().globalData.currentCompanyInfo;
      this.currentCompany=tempCurrentCompany;
    }
}
</script>
