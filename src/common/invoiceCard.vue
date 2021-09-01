<style lang="scss">
.invoiceCard{ 
    background: #FFFFFF;
    border-radius: 4rpx;
    padding: 24rpx 18rpx 40rpx 30rpx;
    font-size: 28rpx;
    .time{
        font-size: 24rpx;
        font-weight: 400;
        color: #6D7278;
    }
    .p0{
        display: flex;
        justify-content: space-between;
        .left{
            font-weight: bold;
            color: #2B2B2B;
        }
        .right{
            font-weight: 500;
            color: #EF554E;
        }
    }
    .p0,.p1,.p2,.p3,.p4{
        margin-top: 4rpx;
    }
}
</style>
<template>
    <div class="invoiceCard">
        <div class="time">{{info.invoiceDate||info.issueDate}}</div>
        <div class="p0">
            <div class="left">
                <slot name="title"></slot>
            </div>
            <div class="right">CNY {{info.totalAmount||info.subtotalAmount}}</div>
        </div>
        <div class="p1" v-if="uiTag">付款方：{{info.buyerName||''}}</div>
        <div class="p1" v-if="uiTag">销售方：{{info.salerName||info.sellerName||''}}</div>
        <div class="p1" >发票代码：{{info.invoiceCode}}</div>
        <div class="p2" >发票号码：{{info.invoiceNo||info.invoiceNumber}}</div>
        <div class="p3" v-if="!uiTag">校验码:  {{info.checkCode}}</div>
        <div class="p4">
            <slot name="desc"></slot>
        </div>
    </div>
</template>
<script>
export default{
    props: {
        info: {
            type: Object,
            default: {}
        },
        uiTag:{ //控制卡片列表UI显示切换
            type:Boolean,
            default:false
        }
    }
};
</script>