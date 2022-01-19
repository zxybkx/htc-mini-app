<style lang="scss">
    .container{
        padding: 0rpx 20rpx;
    }
</style>
<template>
    <view class="container">
        <user-card :currentCompany="currentCompany"></user-card>
        <div v-for="(item, index) in invoiceInfoArray" style="width:100%;" :key="index" @click="handleDetail(index)">
            <invoice-card :info="item" :index="index" :uiTag=true >
                <div slot="title">{{item.invoiceTypeMeaning||item.invoiceType}}</div>
                <div slot="desc">详情:   已添加至我的发票</div>
            </invoice-card>
        </div>
        <div v-if="invoiceInfoArray.length===0">采集结果为空</div>
    </view>
</template>
<script>
    import { invoiceType } from '@/utils/constant';
    import userCard from '@/common/userCard.vue';
    import invoiceCard from '@/common/invoiceCard.vue';
    export default{
        data(){
            return {
                currentCompany:{},
                invoiceInfoArray:[],//展示当前页面的数据
            }
        },
        components: {
            userCard,
            invoiceCard
        },
        methods: {
            handleDetail(index){
                getApp().globalData.currentInvoiceInfo=this.invoiceInfoArray[index];
                if(getApp().globalData.currentInvoiceInfo.ocrType===invoiceType[0]){
                  // 增值税情况
                    uni.navigateTo({
                        url:'/pages/view-record/index'
                    })
                }else{
                    const invoiceType=getApp().globalData.currentInvoiceInfo.invoiceType;
                    if(['01','02','04','08','10','11'].includes(invoiceType)){
                        uni.navigateTo({
                            url:'/pages/view-record/index'
                        })
                        return;
                        /**
                         * case '01':
                         *type = '增值税专用发票'
                         *break
                         *case '02':
                         *type = '货运运输业增值税专用发票'
                         *break
                         *case '03':
                         *type = '机动车销售统一发票'
                         *break
                         *case '04':
                         *type = '增值税普通发票'
                         *break
                         *case '08':
                         *type = '增值税电子专用发票'
                         *break
                         *case '10':
                         *type = '增值税普通发票(电子)'
                         *break
                         *case '11':
                         *type = '增值税普通发票(卷式)'
                         *break
                         *case '14':
                         *type = '通行费发票'
                         *break
                         *case '15':
                         *type = '二手车发票'
                         *break
                         *default:
                         *type = '未识别类型'
                         */
                        
                    }
                    // 非增值税情况
                    uni.navigateTo({
                        url:'/pages/other-photo-invoice-detail/index'
                    })
                }
            }   
        },
        onLoad(){
            const invoiceOriginInfoArray=getApp().globalData.currentInvoiceAllInfo;
            // 发票数据格式化
            
            this.invoiceInfoArray=invoiceOriginInfoArray;
            this.currentCompany=getApp().globalData.currentCompanyInfo;
        }
    }
</script>
    
      