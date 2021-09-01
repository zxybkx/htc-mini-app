<style lang="scss">
/**index.wxss**/
.container{ 
  /* padding: 16px; */
  padding: 24rpx;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  color: #aaa;
}
.van-notice-bar{
  height:auto !important;
  font-size:24rpx !important;
}
.switchBtn{
  display:flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 50rpx;
}
.options{
  width: 100%;
  display: flex;
  flex-direction: column; 
}

.option{
  border-radius: 32rpx;
  background-color: #fff;
  padding: 16rpx 16rpx;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start; 
  margin: 12rpx 0;
}

.option-texts{
  flex: 1;
  padding: 0 32rpx;
}

.option-text-title{
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  line-height: 1.7;
}

.option-text-sub{
  font-size: 24rpx;
  color: #757575;
  line-height: 1.7;
}

</style>

<template>
    <!-- index.wxml -->
<view class="container">
  <uni-notice-bar
    color="#1989fa"
    backgroundColor="#ecf9ff"
    showIcon=true
    single=true
    scrollable=true
    :speed=15
    :text="notice"
    @tap="handleNoticeList"
  />
  <user-card :currentCompany="currentCompanyInfo">
    <view @tap="handleSwitch" class="switchBtn">切换</view>
  </user-card>
  <view class="options">
    <view class="option" @tap="handleJump(0)" v-if='showSaoInvoice'>
      <uni-icons type="scan" color="#1e88e5" size="50rpx" />
      <view class="option-texts">
        <view class="option-text-title">扫描发票</view>
        <view class="option-text-sub">扫描发票二维码</view>
      </view>
      <uni-icons type="arrowright" color="#9e9e9e" size="50rpx" />
    </view>
    <view class="option" @tap="handleJump(1)" v-if='showTakeInvoice'>
      <uni-icons type="camera" color="#1e88e5" size="50rpx" />
      <view class="option-texts">
        <view class="option-text-title">拍发票</view>
        <view class="option-text-sub">识别多张发票</view>
      </view>
      <uni-icons type="arrowright" color="#9e9e9e" size="50rpx" />
    </view>
    <view class="option" @tap="handleJump(2)" v-if='showDianInvoice'>
      <uni-icons type="upload" color="#1e88e5" size="50rpx" />
      <view class="option-texts">
        <view class="option-text-title">导入电子票</view>
        <view class="option-text-sub">从电子卡包获取发票</view>
      </view>
      <uni-icons type="arrowright" color="#9e9e9e" size="50rpx" />
    </view>
    <view class="option" @tap="handleJump(3)" v-if='false&&showOFDInvoice'>
      <uni-icons type="paperclip" color="#1e88e5" size="50rpx" />
      <view class="option-texts">
        <view class="option-text-title">OFD 文件</view>
        <view class="option-text-sub">选自 OFD 发票文件自动识别</view>
      </view>
      <uni-icons type="arrowright" color="#9e9e9e" size="50rpx" />
    </view>
    <view class="option" @tap="handleJump(4)" v-if='showMyInvoice'>
      <uni-icons type="list" color="#1e88e5" size="50rpx" />
      <view class="option-texts">
        <view class="option-text-title">我的发票</view>
        <view class="option-text-sub">查看此账号下的所有发票</view>
      </view>
      <uni-icons type="arrowright" color="#9e9e9e" size="50rpx" />
    </view>
  </view>
</view>
</template>

<script>
import {ApiGetNotice,ApiGetNoticeDetail,ApiListHide} from '../../api';
import userCard from '../../common/userCard.vue';
import uploadRecordMixin from '@/mixins/uploadRecord';
import tipInvoiceUserMixin from '@/mixins/tipInvoiceUser';
export default {
    mixins: [uploadRecordMixin,tipInvoiceUserMixin],
    data() {
        return {
            currentCompanyInfo:{},
            notice:'',
            showSaoInvoice:true,
            showTakeInvoice:true,
            showDianInvoice:true,
            showOFDInvoice:true,
            showMyInvoice:true
        }
    },
    components: {
        userCard
    },
    methods: {
      handleSwitch(){
        uni.navigateTo({url:'/pages/select-company/index'})
      },
      handleNoticeList(){
        // 先隐藏后期需要加上
        // wx.navigateTo({url:'/pages/noticeList'})
      },
      handleJump(type){
        // 子路由跳转 type 0-扫发票 1-拍发票 2-导入电子票 3-ofd文件 4-我的发票
        switch(type) {
            case 0:
                uni.navigateTo({url:'/pages/scan-invoice/index'})
                break;
            case 1:
                uni.navigateTo({url:'/pages/photo-invoice/index'})
                break;
            case 2:
                uni.navigateTo({url:'/pages/import-invoice/index?encryptedUid=${options.query.encryptedUid}&packageId=${options.query.packageId}'})
                break;
            case 3:
                uni.navigateTo({url:'/pages/import-ofd/index'})
                break;
            default:
                console.log('我的发票')
                uni.navigateTo({url:'/pages/my-invoice-list/index'})
        }
      }
    },
    
    onLoad(options){
      // console.log();
      // 换取缓存的currentConmpanyInfo对象
      const currentCompanyInfo = uni.getStorageSync('currentCompanyInfo');
      if(currentCompanyInfo){
        this.currentCompanyInfo=currentCompanyInfo;
        // 存在则赋予全局的currentConmpanyInfo
        getApp().globalData.currentCompanyInfo=currentCompanyInfo;
      }
      const tempCurrentConmpany=getApp().globalData.currentCompanyInfo;
      ApiListHide()
      .then(res=>{
        const filterObj=res.find(item=>item.value===`${tempCurrentConmpany.tenantId}-${tempCurrentConmpany.companyCode}`);
        if(filterObj){
          const tagArray=filterObj.tag.split(",");
          tagArray.forEach(item => {
            if(item=='扫描发票'){
              this.showSaoInvoice=false;
            }
            if(item=='拍发票'){
              this.showTakeInvoice=false;
            }
            if(item=='导入电子票'){
              this.showDianInvoice=false;
            }
            if(item=='OFD文件'){
              this.showOFDInvoice=false;
            }
            if(item=='我的发票'){
              this.showMyInvoice=false;
            }
          });
        }
      })
      // 获取公告
      ApiGetNotice()
      .then(res=>ApiGetNoticeDetail(res.content[0].noticeId))
      .then(res=>this.notice=res.noticeBody.replace(/<p>|<\/p>/g,''));
    }
}
</script>
