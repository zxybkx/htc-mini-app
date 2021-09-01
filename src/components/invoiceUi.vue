<style lang="scss">
.invoiceUi{
    .common-label{
      font-size: 28rpx;
      font-weight: 400;
      color: #8C96B4;
      width: 112rpx;
      flex-shrink: 0;
    }
    .edit-wrapper {
      
      font-size: 24rpx;
      font-weight: 400;
      color: #FFFFFF;
      position: absolute;
      right: 0;
      top: 0;
    }
    .invoice-header {
      margin: 20rpx;
      margin-bottom: 0;
      padding: 40rpx;
      background-color: #ffffff;
      position: relative;
      .watermark-wrapper {
        position: relative;
        width: 100%;
        .border-1 {
            display: flex;
            align-items: center;
            justify-content: center;
            border-style: solid;
            width: 200rpx;
            height: 120rpx;
            border-width: 4rpx;
            border-color: #fdbcc5;
            border-radius: 50%;
            position: relative;
            margin: 0 auto;
        }
        
        .border-2 {
            width: 180rpx;
            height: 100rpx;
            border-width: 4rpx;
            border-style: solid;
            border-color: #fdbcc5;
            border-radius: 50%;
        }
        .text {
            font-size: 36rpx;
            color: #F58A88;
            position: absolute;
            top: 36rpx;
            display: flex;
            justify-content: center;
            width: 100%;
        }
      }
    }
    /* header-detail-wrapper css */
    .header-detail-wrapper {
      margin-top: 40rpx;
      display: flex;
      justify-content: space-between;
      position: relative;
    }
    .hdw-left{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top-left-circle{
      position: absolute;
      right: -40rpx;
      top: 16rpx;
      width:16rpx;
      height: 16rpx;
      border-top-left-radius: 100%;
      background: #F8F8F8;
    }
    .bottom-left-circle{
      position: absolute;
      top: 32rpx;
      width:16rpx;
      right: -40rpx;
      height: 16rpx;
      border-bottom-left-radius: 100%;
      background: #F8F8F8;
    }
    .top-right-circle{
      top: 16rpx;
      position: absolute;
      left: -40rpx;
      width:16rpx;
      height: 16rpx;
      border-top-right-radius: 100%;
      background: #F8F8F8;
    }
    .bottom-right-circle{
      position: absolute;
      top: 32rpx;
      width:16rpx;
      left: -40rpx;
      height: 16rpx;
      border-bottom-right-radius: 100%;
      background: #F8F8F8;
    }
    .detail-line {
      display: flex;
      align-items: center;
    }
    .detail-text {
      display: flex;
      align-items: flex-end;
      font-size: 28rpx;
      font-weight: 400;
      color: #4A4A4A;
    }
    .detail-text .dt-sp{
      align-self: flex-start;
      margin-left: 8rpx;
      font-size: 36rpx;
    }
    /* header-detail-wrapper end */
    
    /* invoice stsrt */
    .accordion-wrapper {
      background-color: #ffffff;
      margin: 0 10px;
      padding: 0rpx 40rpx 60rpx;
    }
    /* split-line */
    .split-line{
      width: 630rpx;
      margin: 0rpx auto;
      background-color: #fff;
      height: 0rpx;
      border-top:2rpx  dotted #EBEBEB;
    }
    /* split-line end */
    .accordion-content{
      transition: height 0.3s ease-in-out;
      will-change: height;
      overflow: hidden;
      border-radius: 16rpx;
    }
    .accordion-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .accordion-title .at-left{
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      margin-top: 30rpx;
      padding-bottom: 20rpx;
    }
    .accordion-title .at-right{
      font-size: 24rpx;
      font-weight: 400;
      color: #3889FF;
      display: flex;
      align-items: center;
    }
    /* .accordion-title .at-right image{
      width: 32rpx;
      height: 32rpx;
      margin-left: 16rpx;
    } */
    .content-line{
      display: flex;
      margin-top: 20rpx;
    }
    .content-line .value{
      font-size: 28rpx;
      font-weight: 400;
      color: #4A4A4A;
      margin-left: 96rpx;
      
    }
} 
</style>
<template>
    <view class="invoiceUi">
        <view class="invoice-header">
            <view class="edit-wrapper">
              <slot name="edit"></slot>
            </view>
            <view class="watermark-wrapper">
                <view class="border-1">
                    <view class="border-2"></view>
                </view>
                <view class="text">{{invoiceObj.invoiceTypeMeaning}}</view>
            </view>
            <view class="header-detail-wrapper">
                <view class="top-left-circle"></view>
                <view class="bottom-left-circle"></view>
                <view class="top-right-circle"></view>
                <view class="bottom-right-circle"></view>
                <view class="hdw-left">
                    <view class="detail-line">
                        <view class="common-label" style="width:208rpx;">价税合计：</view>
                        <view class="detail-text">CNY <view class="dt-sp">{{invoiceObj.totalAmount}}</view></view>
                    </view>
                    <view class="detail-line">
                        <view class="common-label" style="width:208rpx;">不含税金额：</view>
                        <view class="detail-text">CNY {{invoiceObj.invoiceAmount}}</view>
                    </view>
                </view>
                <!-- <image class="hdw-image" src="" mode=""/> -->
            </view>
        </view> 
        <view class="accordion-wrapper">
            <view class="split-line"></view>
            <view class="accordion-title">
                <view class="at-left">发票详情</view>
                <view class="at-right" @click="tag">
                    <view>收起</view>
                    <uni-icons type="arrowup" v-if="uiState"/>
                    <uni-icons type="arrowdown" v-else/>
                </view>
            </view>
            <view class="accordion-content" :style="uiState?'height: 80rpx;display:block':'display:block'">
                <view class="content-line" v-for="(item,index) in invoiceArrayObj" :key="index" >
                    <view class="common-label">{{item.key}}</view>
                    <view class="value">{{item.val}}</view>
                </view>
                <slot name="goods"></slot>
            </view>
        </view>
    </view>
</template>
<script>
    const labelKey={
      invoiceTypeMeaning: "发票种类",
      currency: "币种",
      invoiceCode: "发票代码",
      invoiceNo: "发票号码",
      invoiceDate: "开票日期",
      totalAmount: "价税合计",
      invoiceAmount: "不含税金额",
      salerName: "销售方",
      buyerName: "购买方",
      buyerTaxNo: '纳税人识别号',
      buyerAddressPhone: "地址、电话",
      buyerAccount: "开户行及银行账号"
    }
    export default{
        data(){
          return {
            uiState:false,
            invoiceArrayObj:[],
            invoiceObj:{}
          }
        } ,
        methods: {
            tag(){
                this.uiState=!this.uiState;
            }
        },
        created(){
            const tempInfo=getApp().globalData.currentInvoiceInfo;
            this.invoiceObj=tempInfo;
            const invoiceArrayObj=Object.keys(labelKey).map(
            item=>{
              if(item==='currency'){
                // 这里币种写死了 没办法有的没有
                return {
                    key:labelKey[item],
                    val:'CNY'
                }
              }
              return {
                  key:labelKey[item],
                  val:tempInfo[item]
              }
            })
            this.invoiceArrayObj= invoiceArrayObj;
        }
    };
</script>
    