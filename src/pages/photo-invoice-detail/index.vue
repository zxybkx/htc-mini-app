<style lang="scss">
  .inv-detail{
    padding-bottom: 140rpx;
    height: 100%;
    background: #f2f2f2;
    overflow-y: auto;
    .edit{
      background: #0282F0;
      width: 112rpx;
      height: 56rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
    }
    .p0{
      text-align: center;
      line-height: 56rpx;
      flex-shrink: 0;
    }
    .p1{
      border-left: 2rpx solid #eee;
      text-align: center;
      line-height: 56rpx;
      flex-shrink: 0;
    }
  }
</style>

<template>
    <view class="inv-detail">
      <invoice-ui>
        <div slot="edit" class="edit" @click="handleEdit" v-if="type==1">编辑</div>
        <!-- <view slot="goods" v-if="invoiceLinesInfoList.length>0">
          <div class="C-flex divider">商品信息</div>
          <div class="table">
              <div class="tb-title">
                <div class="p0" style="width:122rpx;">规格型号</div>
                <div class="p1" style="width:90rpx;">单位</div>
                <div class="p1" style="width:90rpx;">数量</div>
                <div class="p1" style="width:106rpx;">单价</div>
                <div class="p1" style="width:106rpx;">金额</div>
                <div class="p1" style="width:106rpx;">税率</div>
              </div>
              <div class="tb-body" v-for="(item,index) in invoiceLinesInfoList" :key="index">
                <div class="p0" style="width:122rpx;">{{item.specificationModel}}</div>
                <div class="p1" style="width:90rpx;">{{item.unit}}</div>
                <div class="p1" style="width:90rpx;">{{item.num}}</div>
                <div class="p1" style="width:106rpx;">{{item.unitPrice}}</div>
                <div class="p1" style="width:106rpx;">{{item.detailAmount}}</div>
                <div class="p1" style="width:106rpx;">{{item.taxRate}}</div>
              </div>
          </div>
        </view> -->
      </invoice-ui>
      <view class="bottom-wrapper bottom-wrapper-one">
          <button class="subBtn" type="primary" @click="handlePreview">查看档案</button>
      </view>
    </view>
</template>
<script>
import invoiceUi from '@/components/invoiceUi.vue'
export default{
    data(){
        return {
            invoiceObj:{},
            invoiceLinesInfoList:[],
            type:0
        }
    },
    components: {
        invoiceUi
    },
    methods:{
      handlePreview(){
        if(this.invoiceObj.imageUrl.includes('.pdf')){
          try {
            uni.navigateTo({url: `/pages/pdfh5/index?url=${this.invoiceObj.imageUrl}`});
          } catch (e) {
            console.log(e);
              // error
          }
        }else{
          uni.previewImage({
            urls: [this.invoiceObj.imageUrl], // 当前显示图片的http链接
          })
        }
      },
      handleEdit(){
        uni.redirectTo({
          url:'/pages/edit-photo-detail/index'
        })
      }
    },
    onLoad(options){
      this.type=options.type;
    },
    created(){
      const tempInfo=getApp().globalData.currentInvoiceInfo;
      console.log('tempInfo.invoiceLinesInfoList',tempInfo.invoiceLinesInfoList);
      tempInfo.invoiceLinesInfoList&&tempInfo.invoiceLinesInfoList.forEach(item=>{item.unitPrice&&(item.unitPrice=Number(item.unitPrice).toFixed(2))})

      this.invoiceObj=tempInfo;
      this.invoiceLinesInfoList=tempInfo.invoiceLinesInfoList||[];

      // const tempCurrentConmpany=this.$app.$options.globalData.currentConmpanyInfo;
    },
}
</script>