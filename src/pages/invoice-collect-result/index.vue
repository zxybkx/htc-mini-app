<style lang="scss">
.box{
    padding: 0rpx 20rpx;
    height: 100%;
    background-color: #F6F6F6;
    padding-bottom: 30rpx;
    overflow-y: scroll;
}
.delBtn{
    height: 100%;
    width: 60px;
    background-color: #FA5051;
}
</style>
<template>
    <view class="box">
        <user-card :currentCompany="currentCompany"></user-card>
        <!-- 可滑动删除 -->
        <div v-for="(item, index) in invoiceInfoArray" :key='index' @click="handleDetail(index)">
            <invoice-card :info="item" :index="index">
                <div slot="title">增值税普通发票(电子)</div>
                <div slot="desc">详情:   已添加至我的发票</div>
            </invoice-card>
        </div>
    </view>
</template>
<script>
  import {formatExistInvObj} from '@/utils/formatInvObj';
  import invoiceCard from '@/common/invoiceCard.vue'
  import userCard from '@/common/userCard.vue'
  export default{
    components: {
        invoiceCard,
        userCard
    },
    data(){
        return {
            currentCompany:{},
            invoiceInfoArray:[]
        }
    },
    methods: {
        handleDetail(index){
            getApp().globalData.currentInvoiceInfo=formatExistInvObj(this.invoiceInfoArray[index]);
            getApp().globalData.currentInvoiceAllInfo=this.invoiceInfoArray[index];
            uni.navigateTo({
                url: `/pages/view-record/index`
            })
        }
    },
    onLoad(){
        this.invoiceInfoArray=typeof getApp().globalData.currentInvoiceAllInfo==="object"?
        [getApp().globalData.currentInvoiceAllInfo]:getApp().globalData.currentInvoiceAllInfo;
        this.currentCompany=getApp().globalData.currentCompanyInfo;
        console.log('///',this.invoiceInfoArray);
    }
  }
</script>

  