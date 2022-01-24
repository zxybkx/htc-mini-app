<style lang="scss">
  .inv-detail{
    padding-bottom: 110rpx;
    height: 100%;
    overflow-y: auto;
  }
  .bottom-wrapper {
    width: 100%;
    height: 110rpx;
    background-color: #fff;
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
        <view v-if='!wxUrl'>
          <view class="bottom-wrapper bottom-wrapper-one" v-if='imgUrl'>
              <button class="button" @click="handleViewRecord">查看档案</button>
          </view>
          <view class="bottom-wrapper bottom-wrapper-one" v-else>
              <button class="button" @click="handleUploadRecord">上传档案</button>
          </view>
        </view>
        
        <div class="C-flex modal" v-if='tag' @click="handleHide">
            <div class="wrapper">
                <image :src="imgUrl" @load="imageLoad"  mode="aspectFit"></image>
            </div>
        </div>    
    </view>
</template>
<script>
  import {ApiIsInvExist,ApigetSignedUrl,ApiOfdUrlToJpg,ApiFileUpload} from '@/api/index';
  import invoiceUi from '@/components/invoiceUi.vue'
  export default{
    data() {
        return {
            wxUrl:false,
            invoiceObj:{},
            imgUrl:'',
            tag:false,
            filePath:'',//当不存在档案时 上传档案的临时路径
        }
    },
    components: {
        invoiceUi
    },
    methods:{
      imageLoad(){
        console.log(134);
      },
      async handleUploadRecord(){
        try {
          let chooseResult={};let error={};let tag={};
          // #ifdef MP-ALIPAY
          [error,chooseResult]=await uni.chooseImage({
            count: 1,
            sizeType: ['compressed'],
          })
          if(error) throw error;
          this.filePath=chooseResult.tempFilePaths[0];
          // #endif 
          // #ifndef MP-ALIPAY
          [error,tag]=await uni.showModal({
            title: '提示',
            content: '选择上传',
            cancelText:'其他方式',
            confirmText:'拍照上传'
          })
          if(error) throw error;
          if (tag.confirm) {
            [error,chooseResult]=await uni.chooseImage({
              count: 1,
              sourceType:['camera'],
            })
            if(error) throw error;
            this.filePath=chooseResult.tempFilePaths[0];
          } else if (tag.cancel) {
            [error,chooseResult]=await uni.chooseFile({
              count:1,
              type:'file',
              extension:['pdf']
            })
            if(error) throw error;
            this.filePath=chooseResult.tempFiles[0].path;
          }
          // #endif
          uni.showLoading({title: '开始上传档案'})
          let uploadResult=await ApiFileUpload({filePath:this.filePath,invoicePoolHeaderId:this.invoiceObj.invoicePoolHeaderId,checkTag:'Y'})
          uploadResult=JSON.parse(uploadResult);
          // console.log('uploadResult',uploadResult);
          const self=this;
          if(uploadResult.status==='1001'){
            uni.hideLoading();
            uni.showModal({
              title: '提示',
              content: 'OCR识别信息与发票信息不一致，是否继续上传？',
              success (res) {
                if (res.confirm) {
                  self.subAgaginNoCheckUpload();
                }
              }
            })
          } else if(uploadResult.status==="1000"){
            this.imgUrl=this.filePath;
            uni.hideLoading();
          }else{
            uni.hideLoading();
            uploadResult.message&&uni.showModal({title: '错误',content: uploadResult.message,showCancel: false})
          }
          uni.hideLoading();
        } catch (error) {
          console.log('error',error);
          uni.hideLoading();
            // uni.showModal({title: '错误',content: '上传出错',showCancel: false})
        }
      },
      async subAgaginNoCheckUpload(){
        // 发票校验失败继续上传
        uni.showLoading({title: '继续上传档案'})
        await ApiFileUpload({filePath:this.filePath,invoicePoolHeaderId:this.invoiceObj.invoicePoolHeaderId,checkTag:'N'})
        this.imgUrl=this.filePath;
        uni.hideLoading();
        // uni.redirectTo({url:'/pages/invoice-collect-result/index'});
      },
      subPdfView(){
        // #ifdef MP-ALIPAY
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
        // #endif
        // #ifdef H5
        try {
          uni.navigateTo({url: `/pages/pdfh5/index?url=${this.invoiceObj['fileUrl']}`});
        } catch (e) {
          console.log(e);
            // error
        }
        // #endif
      },
      handleViewRecord(){
        if(this.imgUrl.startsWith('data:image')){
          this.tag=true;
        }else if(this.imgUrl.indexOf('pdf')>-1){

          this.subPdfView();
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
        let refreshInvoiceInfo={};
        if(invoiceObj.invoiceCode){
          refreshInvoiceInfo=await ApiIsInvExist({
            invoiceCode: invoiceObj.invoiceCode,
            invoiceNumber: invoiceObj.invoiceNumber||invoiceObj.invoiceNo
          });
        }
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
        }else if(fileUrl.indexOf('https://mp.weixin.qq.com/')>-1||fileUrl.indexOf('https://mdn.alipayobjects.com')>-1){
          // 此时是导入电子票从微信或者支付宝获取的文件url
          if(fileUrl.indexOf('https://mp.weixin.qq.com/')>-1){this.wxUrl=true}
          this.imgUrl=this.invoiceObj['imageUrl'];
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