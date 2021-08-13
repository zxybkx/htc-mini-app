<style lang="scss">
.section{
    width: 710rpx;
    margin:0rpx auto;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0rpx 4rpx 8rpx 0rpx #EEEEEE;
    border-radius: 4rpx;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 100rpx;
    .title{
        margin-top: 168rpx;
        font-size: 32rpx;
        font-weight: 400;
        color: #4D4D4D;
    }
    image{
        width: 240rpx;
        height: 240rpx;
        margin: 40rpx 0rpx 60rpx;
    }
    .btn{
        width: 440rpx;
        height: 72rpx;
        background: #0282F0;
        border-radius: 8rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tip{
        margin-top: 20rpx;
        color: #9FCBF1;
        font-size: 28rpx;
        width: 438rpx;
    }
    .tipDetail{
        color: #9B9B9B;
        font-size: 28rpx;
        width: 438rpx;
    }
}
</style>
<template>
    <view class="section">
        <view class="title"><slot name="title"></slot></view>
        <image src="/static/img/camInvoice.jpg"></image>
        <view class="btn" @tap="handClick">开始使用</view>
        <view class="tip">使用小贴士</view>
        <view class="tipDetail"><slot name="tipDetail"></slot></view>
    </view>
</template>
<script>
export default{
    methods: {
        handClick(){
            // 调用父组件方法
            this.$emit('startUse');
        }
    }
};
</script>
