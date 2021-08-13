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
            <view slot="title">欢迎使用拍发票</view>
            <view slot="tipDetail">可一次拍摄多张票据进行识别，请核对识别后的发票数据，如数据有误可点击修改进行编辑</view>
        </navSection-ui>
    </view>
</template>
<script>
import {ApiPhotoUpload} from '@/api';
import userCard from '@/common/userCard.vue';
import navSectionUi from '@/components/navSectionUi.vue'
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
        async HandleStartUse(){
            try {
                let [error,chooseResult]= await uni.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    // sourceType: ['camera'],
                })
                if(error) throw error;
                uni.showLoading({title: '开始识别'})
                let uploadResult=await ApiPhotoUpload({filePath:chooseResult.tempFilePaths[0]});
                // 通过小程序的上传接口返回的数据是个json字符串需要解析
                uploadResult=JSON.parse(uploadResult);
                console.log('uploadResult',uploadResult);
                if(uploadResult.status==='H0001'){
                    // 返回结果是个数组 可以拍一张或多张
                    getApp().globalData.currentInvoiceAllInfo=uploadResult.data;
                    // console.log('///',uploadResult.data);
                    // console.log('///',this.$app.$options.globalData.currentInvoiceAllInfo);
                    uni.hideLoading();
                    uni.navigateTo({url: '/pages/photo-invoice-list/index'})
                }else{
                    uni.hideLoading();
                    uni.showModal({title: '错误',content: uploadResult.message,showCancel: false})
                }
            } catch (error) {
                // uni.hideLoading();
                error.message&&uni.showModal({title: '错误',content: error.message,showCancel: false})
            }
        }
    },
    onShow(){
      // 清除拍发票编辑的缓存
      try {
        uni.removeStorageSync('currentEditIndex')
      } catch (e) {
        console.log(e);
      }
      this.currentCompany=getApp().globalData.currentCompanyInfo;
    }
}
</script>