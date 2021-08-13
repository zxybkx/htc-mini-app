<style lang="scss">
  .inv-detail{
    margin-bottom: 120rpx;
    background: #f2f2f2;
    height: 100%;
    overflow-y: auto;
  }
  .bottom-wrapper {
    width: 100%;
    height: 100rpx;
    background-color: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
  }
  .bottom-wrapper-one {
    padding: 0;
  }
  .button {
    width: 564rpx;
    height: 72rpx;
    line-height: 72rpx;
    font-size: 32rpx;
    margin: 0rpx auto;
    color: #fff;
    background-color: #0282F0 !important;
  }
  .modal{
      width: 100%;
      height: 100%;
      background: rgba(#000000, 0.7);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 999;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
  
<template>
    <view class="inv-detail">
        <invoice-Ui :initInvoice="invoiceObj"></invoice-Ui>
        <view class="bottom-wrapper bottom-wrapper-one">
            <button class="button" @click="handleViewRecord">查看档案</button>
        </view>
        <div class="C-flex modal" v-if='tag' @click="handleHide">
            <div class="wrapper">
                <image :src="imgUrl" @load="imageLoad"  mode="aspectFit"></image>
            </div>
        </div>    
    </view>
</template>
<script>
  import {ApiIsInvExist,ApigetSignedUrl,ApiOfdUrlToJpg} from '@/api/index';
  import invoiceUi from '@/components/invoiceUi.vue'
  export default{
    data() {
        return {
            invoiceObj:{},
            imgUrl:'',
            tag:false
        }
    },
    components: {
        invoiceUi
    },
    methods:{
      imageLoad(){
        console.log(134);
      },
      handleViewRecord(){
        if(this.imgUrl.startsWith('data:image')){
          this.tag=true;
        }else if(this.imgUrl.indexOf('pdf')>-1){
          uni.downloadFile({
            url: this.imgUrl,
            success: function (res) {
              const filePath = res.tempFilePath
              uni.openDocument({
                filePath: filePath,
                fileType:'pdf',
                success: function (res) {
                  console.log('打开文档成功')
                }
              })
            }
          })
        }else if(this.imgUrl){
          uni.previewImage({
            urls: [this.imgUrl], // 当前显示图片的http链接
          })
        }else{
          uni.showToast({
            title: '该发票暂无档案信息',
            icon: 'none'
          })
        }
      },
      handleHide(){
        this.tag=false;
      }
    },
    async created(){
      // 更新发票信息
      try {
        uni.showLoading();
        const invoiceObj=getApp().globalData.currentInvoiceInfo;
        
        const refreshInvoiceInfo=await ApiIsInvExist({
          invoiceCode: invoiceObj.invoiceCode,
          invoiceNumber: invoiceObj.invoiceNumber||invoiceObj.invoiceNo
        });
        this.invoiceObj={
          ...getApp().globalData.currentInvoiceInfo,
          ...refreshInvoiceInfo.content[0]
        };
        // console.log('this.invoiceObj',this.invoiceObj);
        getApp().globalData.currentInvoiceInfo={
          ...getApp().globalData.currentInvoiceInfo,
          ...refreshInvoiceInfo.content[0]
        };
        const fileUrl = this.invoiceObj['fileUrl'];
        // console.log('///',fileUrl);
        if(fileUrl.indexOf('.ofd')>-1){
          // ofd转化
          const res=await ApiOfdUrlToJpg(fileUrl);
          this.imgUrl=`data:image/jpg;base64,${res.data}`;
        }else if(fileUrl.indexOf('https://mp.weixin.qq.com/')>-1||fileUrl.indexOf('http://mdn.alipayobjects.com')>-1){
          // 此时是导入电子票从微信或者支付宝获取的文件url
          this.imgUrl=fileUrl;
        }else{
          // 转化 url
          const res=await ApigetSignedUrl(fileUrl);
          this.imgUrl=res;
        }
        uni.hideLoading();
      } catch (error) {
        uni.hideLoading();
      }
    }
  }
</script>