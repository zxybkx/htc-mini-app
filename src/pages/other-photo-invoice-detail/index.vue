<style lang="scss">
  .inv-detail{
    height: 100%;
    background: #f2f2f2;
    overflow-y: auto;
    margin-bottom: 140rpx;
    .edit{
      background: #0282F0;
      width: 112rpx;
      height: 56rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
  
  .subBtn {
    width: 564rpx;
    height: 72rpx;
    line-height: 72rpx;
    font-size: 32rpx;
    margin: 0rpx auto;
    background-color: #0282F0 !important;
  }
</style>
<template>
    <div class="inv-detail">
        <commonInvoice-ui>
          <div slot="edit" class="edit" @click="handleEdit" v-if="type==1">编辑</div>
        </commonInvoice-ui>
        <view class="bottom-wrapper bottom-wrapper-one">
          <button class="subBtn" type="primary" @click="handlePreview">查看档案</button>
        </view>
    </div>
</template>
<script>

import {ApigetSignedUrl,ApiOfdUrlToJpg} from '@/api/index';
import { commonInvoiceUi } from '../../components/commonInvoiceUi.vue'
export default {
    data(){
        return {
            labelKey:{},
            invoiceObj:{},
            type:0,
            imgUrl:''
        }
    },
    components: {
        commonInvoiceUi
    },
    methods:{
      handlePreview(){
        if(this.invoiceObj['imageUrl']){
          // 拍发票进入时
          uni.previewImage({
            urls: [this.invoiceObj.imageUrl], // 当前显示图片的http链接
          })
        }else{
          // 我的发票进入时
          uni.previewImage({
            urls: [this.imgUrl], // 当前显示图片的http链接
          })
        }
      },
      handleEdit(){
        uni.redirectTo({
          url:'/pages/other-photo-invoice-detail-edit/index'
        })
      }
    },
    onLoad(options){
        // console.log(options);
        this.type=options.type;
        // const tempInvoiceObj=JSON.parse(JSON.stringify(this.$app.$options.globalData.currentInvoiceInfo));
        // console.log('tempInvoiceObj',tempInvoiceObj);
        // this.invoiceObj=tempInvoiceObj;
    },
    async created(){
      // 更新发票信息
      try {
        uni.showLoading();
        const invoiceObj=getApp().globalData.currentInvoiceInfo;
        this.invoiceObj=invoiceObj;
        const fileUrl = this.invoiceObj['fileUrl'];
        // console.log(fileUrl);
        if(fileUrl.indexOf('.ofd')>-1){
          // ofd转化
          const res=await ApiOfdUrlToJpg(fileUrl);
          this.imgUrl=`data:image/jpg;base64,${res.data}`;
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