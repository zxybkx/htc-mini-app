<template>
  <view class="container">
      <view class="modalContainer" v-if="modalTag">
        <view class="modal">
          <p class="modalTitle">{{modalTitle}}</p>
          <div class="modalContent">
            <p v-for="(item,index) in modalContent" :key='index'>{{item}}</p>
          </div>
          <p class="modalBtn" @click="closeModal">确定</p>
        </view>
      </view>
      <view class="title">
          <view class="avatar">
            <!-- <van-image round width="50px" height="50px" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" /> -->
            <!-- #ifdef MP-WEIXIN -->
            <open-data type="userAvatarUrl"></open-data>
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <image style="width: 50px; height: 50px;" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"></image>
            <!-- #endif -->
          </view>
          <view class="user-info">
            <view class="user-name title-text text-bold">{{company.employeeName}}</view>
            <view class="user-phone  title-text-sub">标识：{{company.mobile}}</view>
          </view>
      </view>
      <view class="notice-bar">当前所属：{{company.companyName}}</view>
      <scroll-view class="scroll-info" scroll-x="false" scroll-y="true" scroll-with-animation="false">
          <view class="companys">
            <radio-group :value="companyCode" @change="handleSelect">
              <label class="C-flex radio-list" v-for="item in companys" :key="item.companyCode" >
                  <radio style="transform:scale(0.7)" :name='item.companyCode' :value="item.companyCode" :checked="item.companyCode===companyCode"></radio>
                  <view>{{item.companyName}}</view>
              </label>
            </radio-group>
          </view>
          <view class="company-header">
            <view class="header-title">企业发票抬头信息</view>
            <view class="header-line">公司：{{company.companyName}}</view>
            <view class="header-line">税号：{{company.taxpayerNumber}}</view>
            <view class="header-line">地址及电话：{{company.companyAddressPhone}}</view>
            <view class="header-line">开户行账号：{{company.bankNumber}}</view>
          </view>
      </scroll-view>
      <view class="space"></view>
      <div class="C-flex button-container">
        <button class="button" type="primary" @click="handleConfirmCompany" >
          确定
        </button>
      </div>
  </view>
</template>

<script>
import {ApiGetCompanys,ApiGetDowntimeNotice} from '@/api';
import { InitWxJsApi } from '../../utils/wxsdk';
export default {
  data() {
    return {
      companyCode: "HAND",
      companys: [],
      company: {},
      modalTag:false,
      modalTitle:'',
      modalContent:'',
    }
  },
  async onLoad(e){
      const companyCode = uni.getStorageSync('companyCode');
      if(companyCode){
        this.companyCode=companyCode;
      }
      //  获取公司列表
      
      const res=await ApiGetCompanys();
      
      // const test=res.content.filter(item=>{
      //   return !['企业001','演示环境测试账号1'].includes(item.companyName);
      // })
      // this.companys=test;

      this.companys=res.content;
      this.company = res.content.find(
          o => o.companyCode == this.companyCode);
      const currentCompanyInfo= uni.getStorageSync('currentCompanyInfo');
      currentCompanyInfo&&ApiGetDowntimeNotice(currentCompanyInfo.tenantNum)
      .then(res=>{
        if(res.status&&res.status===200){
          this.modalTag=true;
          this.modalTitle=res.noticeTitle;
          const temparray=res.noticeContext.split('\n');
          console.log(temparray);
          this.modalContent=temparray;
        }
      });
    },
    methods: {
      closeModal(){
        this.modalTag=false;
      },
      // 公司切换
      handleSelect(event){
        const companyCode=event.detail.value;
        this.company = this.companys.find(
          o => o.companyCode == companyCode);
        this.companyCode=companyCode;
        uni.setStorageSync('companyCode',companyCode);
      },
      handleConfirmCompany() {
        // 保存全局公司信息并替换缓存的currentConmpanyInfo
        getApp().globalData.uploadRecord='';//是否强制上传档案
        getApp().globalData.tipInvoiceUser='';//是否提示发票持有人信息,
        getApp().globalData.currentCompanyInfo = this.company
        uni.setStorageSync('currentCompanyInfo',this.company);
        // 当企业微信选择企业 进行SDK授权 
        InitWxJsApi();
        
        uni.reLaunch({
          url: '/pages/index/index',
        });
      }
    }
}
</script>

<style lang="scss">
.modalContainer{
  width: 100%;
	height: 100%;
  z-index: 999;
	position: fixed;
  background:rgba(0,0,0,0.6);
  top: 0;
	left: 0;
  display:flex;
  justify-content:center;
  align-items:center;
  
}
.modal{
  width: 300px;
  background:#fff;
  box-sizing:border-box;
  border-radius :6px;
  overflow: hidden;
  .modalTitle{
    text-align:center;
    line-height :40px;
    color:  #2b2b2b;
    border-bottom:1px solid #eee;
    margin-bottom :10px;
  }
  .modalContent{
    padding:6px;
    min-height :100px;
    max-height :200px;
    word-break:break-all;
    overflow-y :auto;
    font-size :14px;
    color:  #2b2b2b;
  }
  .modalBtn{
    border-top:1px solid #eee;
    margin-top :10px;
    text-align:center;
    line-height :40px;
    color :#fff;
    font-size:16px;
    background :#1989fa;
  }
}
.container{ 
  /* padding: 16px; */
  padding: 24rpx;
  padding-bottom: 100rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start; 
} 

.title{ 
  /* padding-bottom: 0; */
  padding: 18rpx 20rpx;
  width: 662rpx;
  /* border-radius: 32rpx 32rpx 0 0; */
  /* width: 100%; */
  display: flex;
  align-items: center;  
  // background-color: #fff;
  .avatar{
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
  }
}

.text-bold{
  font-weight: bold;
}

.user-info{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 24rpx 24rpx;
}

.title-text{
  font-size: 28rpx;
  color: #333333; 
  line-height: 40rpx;
}

.title-text-sub{
  font-size: 26rpx;
  color: #757575; 
  line-height: 40rpx;
}

.notice-bar{ 
  /* border-radius: 0 0 32rpx 32rpx; */
  font-size: 24rpx; 
  margin-bottom: 24rpx ;
  background-color: #FEFBE8;
  color: #ED6E1A;
  padding: 16rpx 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.scroll-info{ 
  height: fit-content;
  max-height: 1110rpx;
}

.companys{ 
  /* height: 1400rpx; */
  height: fix-content;
  width: 100%;
  // background-color: #fff;
  padding: 22rpx 24rpx;
  box-sizing: border-box;
  .radio-list{
    justify-content: flex-start;
    font-size: 24rpx;
    line-height: 70rpx;
    // color: #2196f3;
  }
}

.company-header{
  margin-top: 24rpx;
  height: fix-content;
  width: 100%;
  // background-color: #fff;
  padding: 32rpx 24rpx;
  box-sizing: border-box;
}

.header-title{
  font-size: 28rpx;
  font-weight: bold;
  color: #2196f3;
  margin-bottom: 20rpx;
}

.header-line{
  color: #5c5c5c;
  font-size: 25rpx;
  padding: 8rpx 0;
}

.company-radio{
  padding: 18rpx 0;
}

.radio-label{
  font-size: 26rpx;
}

.space{
  height: 24rpx;
  width: 100%;
}
.button-container{
  position:fixed;
  bottom:24rpx;
  width: 100%;
  left:0;

  .button{
    line-height: 72rpx;
    font-size: 26rpx;
    width:702rpx;
    height:72rpx;
    border-radius:8rpx;
  }
}

</style>