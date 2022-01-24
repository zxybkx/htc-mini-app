<style lang="scss">
  .inv-detail{
    margin-bottom: 140rpx;
  }
  .divider{
    height: 100rpx;
    width: 100%;
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
  .table{
    font-size: 26rpx;
    .tb-title,.tb-body{
      display: flex;
      justify-content: space-between;
    }
    .p0{
      text-align: center;
      line-height: 56rpx;
      width: 21%;
    }
    .p1{
      border-left: 2rpx solid #eee;
      text-align: center;
      line-height: 56rpx;
      width: 13%;
    }
  }
</style>

<template>
    <view class="inv-detail">
      <invoice-ui>
        <view slot="goods" v-if="invoiceLinesInfoList.length>0">
          <!-- <van-divider dashed  contentPosition="center">商品信息</van-divider> -->
          <div class="C-flex divider">商品信息</div>
          <div class="table">
              <div class="tb-title">
                <div class="p0">规格型号</div>
                <div class="p1">单位</div>
                <div class="p1">数量</div>
                <div class="p1" style="width:20%;">单价</div>
                <div class="p1" style="width:20%;">金额</div>
                <div class="p1">税率</div>
              </div>
              <div class="tb-body" v-for="(item,index) in invoiceLinesInfoList" :key="index">
                <div class="p0">{{item.specificationModel}}</div>
                <div class="p1">{{item.unit}}</div>
                <div class="p1">{{item.num}}</div>
                <div class="p1" style="width:20%;">{{item.unitPrice}}</div>
                <div class="p1" style="width:20%;">{{item.detailAmount}}</div>
                <div class="p1">{{item.taxRate}}</div>
              </div>
          </div>
        </view>
      </invoice-ui>
        <view class="bottom-wrapper bottom-wrapper-one">
            <button class="subBtn" type="primary" @click="handleAddInvoice">添加发票</button>
        </view>
    </view>
</template>
<script>
  import {ApiSetInvOwner,ApiPushInv,ApiIsInvExist,
    ApiGetInvImageCompulsory,ApiFileUpload} from '@/api/index';
  import {formatExistInvObj} from '@/utils/formatInvObj';
  import invoiceUi from '@/components/invoiceUi.vue'
  export default{
    data(){
        return{
            invoiceObj:{},
            invoiceLinesInfoList:[],
            invoicePoolHeaderId:'',
            filePath:'',
            uploadinvoiceResult:false //发票上传 false=>没上传 true=>上传
        }
    },
    components: {
        invoiceUi
    },
    methods:{
      async handleAddInvoice(){

        let [error,voluntaryRes] =await uni.showModal({
          title: '提示',
          content: '是否上传档案',
        })
        if(error) throw error;
        if(voluntaryRes.cancel&&getApp().globalData.uploadRecord){
          // 当需要强制上传时点击了取消则返回
          return;
        }
        if(voluntaryRes.confirm){
          
          try {
            // 发票档案上传方式
            let chooseResult={};
            // #ifdef MP-ALIPAY
            [error,chooseResult]=await uni.chooseImage({
              count: 1,
              sizeType: ['compressed'],
            })
            if(error) throw error;
            this.filePath=chooseResult.tempFilePaths[0];
            // #endif 
            // #ifndef MP-ALIPAY
            let [error,tag]=await uni.showModal({
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
            // 判断是否需要上传档案
            if(this.uploadinvoiceResult&&this.filePath){
              // 发票上传成功 上传档案点击取消后 拍照再次上传档案
              uni.showLoading({title: '开始上传档案'})
              let uploadResult=await ApiFileUpload({filePath:this.filePath,invoicePoolHeaderId:this.invoicePoolHeaderId,checkTag:'Y'})
              uploadResult=JSON.parse(uploadResult);
              // console.log('uploadResult',uploadResult);
              const self=this;
              if(uploadResult.status==='1001'){
                uni.hideLoading();
                uni.showModal({
                  title: '提示',
                  content: '发票校验失败是否强制上传',
                  success (res) {
                    if (res.confirm) {
                      self.agaginNoCheckUpload();
                    }
                  }
                })
              } else if(uploadResult.status==="1000"){
                uni.hideLoading();
                uni.redirectTo({url:'/pages/invoice-collect-result/index'});
              }else{
                uni.hideLoading();
                uploadResult.message&&uni.showModal({title: '错误',content: uploadResult.message,showCancel: false})
              }
            }  
          } catch (error) {
            console.log('error',error);
            uni.hideLoading();
            // uni.showModal({title: '错误',content: '上传出错',showCancel: false})
            return;
          }
        }
        if(!this.uploadinvoiceResult){
          // 发票未上传 
          this.dispose();
        }
      },
      async dispose(){// 处理上传发票流程
        /**
         * 1:发票存在发票池但没绑定到个人
         * 2:发票不存在发票池
         * 
        */
        try {
          uni.showLoading({title: '开始处理'})
          if(this.invoiceObj.invoicePoolHeaderId){
            // 1:发票存在发票池但没绑定到个人===>绑定个人信息提交
            const setOwnerRes=await ApiSetInvOwner(getApp().globalData.currentInvoiceAllInfo);
          }else{
            // 2:发票不存在发票池
            const pushRes=await ApiPushInv(this.invoiceObj.invoiceHeaderId);
            if(!pushRes.data){
              // 发票添加错误抛出
              throw pushRes;
            }
          }
          // 更新发票信息
          const refreshInvoiceInfo=await ApiIsInvExist({
            invoiceCode: this.invoiceObj.invoiceCode,
            invoiceNumber: this.invoiceObj.invoiceNumber
          });
          if(!this.invoiceObj.invoicePoolHeaderId){
            // 只添加发票再将发票绑定到个人
            await ApiSetInvOwner(refreshInvoiceInfo.content[0]);
          }
          if(refreshInvoiceInfo.content[0]){
            // console.log('refreshInvoiceInfo',refreshInvoiceInfo)
            this.invoicePoolHeaderId=refreshInvoiceInfo.content[0].invoicePoolHeaderId;
            //发票信息更新成功 ===> 更新全局的当前发票信息
            getApp().globalData.currentInvoiceAllInfo=refreshInvoiceInfo.content[0];
            getApp().globalData.currentInvoiceInfo=formatExistInvObj(refreshInvoiceInfo.content[0]);
            // 发票上传成功 改变上传状态
            this.uploadinvoiceResult=true;
            // 此时所有情况都能获取invoicePoolHeaderId ===> invoicePoolHeaderId作为参数上传档案
            if(getApp().globalData.uploadRecord||this.filePath){
              
              let uploadResult=await ApiFileUpload({filePath:this.filePath,invoicePoolHeaderId:this.invoicePoolHeaderId,checkTag:'Y'})
              
              const self=this;
              uploadResult=JSON.parse(uploadResult);
              console.log('uploadResult',uploadResult);
              if(uploadResult.status==="1001"){
                uni.hideLoading();
                uni.showModal({
                  title: '提示',
                  content: '发票校验失败是否强制上传',
                  success (res) {
                    if (res.confirm) {
                      self.agaginNoCheckUpload();
                    }
                  }
                })
              } else if(uploadResult.status==="1000"){
                uni.hideLoading();
                uni.redirectTo({url:'/pages/invoice-collect-result/index'});
              }else{
                wx.hideLoading();
                uni.showModal({title: '错误',content: uploadResult.message,showCancel: false})
              }
              return;
            }
            uni.hideLoading();
            uni.redirectTo({url:'/pages/invoice-collect-result/index'});
          }else{
            throw {message:'发票信息更新出错'}
          }
        } catch (error) {
          console.log('error',error);
          uni.hideLoading();
          error.message&&uni.showModal({title: '错误',content: error.message,showCancel: false})
        }
      },
      async agaginNoCheckUpload(){
        // 发票校验失败继续上传
        uni.showLoading({title: '继续上传档案'})
        await ApiFileUpload({filePath:this.filePath,invoicePoolHeaderId:this.invoicePoolHeaderId,checkTag:'N'})
        uni.hideLoading();
        uni.redirectTo({url:'/pages/invoice-collect-result/index'});
      }
    },
    onLoad(){
      const tempInfo=getApp().globalData.currentInvoiceInfo;
      tempInfo.invoiceLinesInfoList.forEach(item=>{item.unitPrice=item.unitPrice.toFixed(2)})
      this.invoiceObj=tempInfo;
      this.invoiceLinesInfoList=tempInfo.invoiceLinesInfoList||[];

      // const tempCurrentConmpany=getApp().globalData.currentCompanyInfo;
      
    },
  }
</script>