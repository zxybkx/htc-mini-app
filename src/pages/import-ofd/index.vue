<style lang="scss">
.container{
    padding: 0rpx 20rpx;
}
</style>

<template>
    <view class="container">
        <user-card :currentCompany="currentCompany" />
        <navSection-ui @startUse="HandleStartUse">
            <view slot="title">导入OFD/PDF 文件</view>
            <view slot="tipDetail">选取 PDF/OFD 格式发票文件上传并验证。</view>
        </navSection-ui>
    </view>
</template>
<script>
import { ApiOfdResolver,ApiBase64,ApiPdfResolver } from '../../api/index'
import userCard from '../../common/userCard.vue';
import navSectionUi from '../../components/navSectionUi.vue';
import { getType,formatOfdInv } from '../../utils/formatInvObj'
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
            let [error,chooseRes]=await uni.chooseFile({
              count:1,
              extension:['ofd','pdf']
            })
            if(error)throw error;
            const fileType=chooseRes.tempFiles[0].type.includes('pdf')?1:0;
            uni.showLoading({title: '开始识别'})
            const uploadResult=await ApiBase64({filePath:chooseRes.tempFiles[0].path});
            if(fileType){
              // 进入拍发票流程
              const resolverRes=await ApiPdfResolver(uploadResult);
              if(resolverRes.status==='H0001'){
                resolverRes.data.forEach(item => {
                  item.imageUrl=item.pdfUrl;
                  item.imageUrlNotSigned=item.pdfUrl;
                });
                const temp=JSON.parse(JSON.stringify(resolverRes));
                getApp().globalData.currentInvoiceAllInfo=temp.data;
                uni.navigateTo({url: '/pages/photo-invoice-list/index'})
              }else{
                uni.showModal({title: '错误',content: resolverRes.message,showCancel: false});
              }
              uni.hideLoading();
              return;
            }
            const resolverRes=await ApiOfdResolver(uploadResult);
            if(resolverRes.status==='H0001'){
              console.log('resolverResresolverRes',resolverRes);
              const tempInvoiceObj=JSON.parse(resolverRes.data);
              getApp().globalData.currentInvoiceAllInfo={
                ...formatOfdInv(tempInvoiceObj),
                tempFilePath:chooseRes.tempFiles[0].path,
                invoiceTypeMeaning:getType(tempInvoiceObj.invoiceType)
              };
              uni.hideLoading();
              uni.navigateTo({url: '/pages/ofd-invoice-list/index'});
            }else{
              uni.showModal({title: '错误',content: resolverRes.message,showCancel: false});
              uni.hideLoading();
            }
          } catch (error) {
            uni.hideLoading();
            error.message&&uni.showModal({title: '错误',content: error.message||error.errMsg,showCancel: false})
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
    },
    onLoad(){
      const tempCurrentCompany=getApp().globalData.currentCompanyInfo;
      this.currentCompany=tempCurrentCompany;
    }
}
</script>