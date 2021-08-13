<style lang="scss">
.card{ 
  width: 100%;
  min-width: 710rpx;
  margin: 0rpx auto;
  background: #FFFFFF;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(74, 163, 239, 0.2);
  border-radius: 4rpx;
  margin:20rpx 0rpx;
  position: relative;
  padding:30rpx 20rpx 40rpx 20rpx;
  box-sizing:border-box;
  display:flex;
  .avatar{
    border-radius:50%;
    width: 64rpx;
    height: 64rpx;
    overflow:hidden;
    margin-right:16rpx;
    image{
      width: 64rpx;
      height: 64rpx;
      
    }
  }
  .switch{
    background: #0282F0;
    position: absolute;
    right:0rpx;
    top:0rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #FFFFFF;
  }
  .user-name{
    font-size: 28rpx;
    font-weight: 600;
    color: #2B2B2B;
    margin:10rpx 0rpx 30rpx 0rpx;
  }
  .user-desc{
    font-size: 24rpx;
    font-weight: 400;
    color: #4D4D4D;
  }
}
</style>
<template>
     <view class="card">
        <view class="switch">
            <slot></slot>
        </view>
        <view class="avatar">
          <!-- <image src="https://img.yzcdn.cn/vant/cat.jpeg" fit="cover"></image> -->
          <!-- #ifdef MP-WEIXIN -->
          <open-data type="userAvatarUrl"></open-data>
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <image fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"></image>
          <!-- #endif -->
        </view>
        <view class="user-info">
          <view class="user-name">{{initCompany.employeeName}}</view>
          <view class="user-desc">企业：{{initCompany.companyName}}</view>
          <view class="user-desc">标识：{{initCompany.mobile}}</view>
        </view>
    </view>
</template>
<script>
export default{
    props: {
      currentCompany: {
        type: Object,
        default: ()=>{},
        
      }
    },
    // watch:{
    //   currentCompany:{
    //     handler(newVal) {
    //       console.log('newVal',newVal);
    //       return {...newVal};
    //     },
    //     deep: true
    //   }
    // },
    computed:{
      initCompany:{
        get() {
          return this.currentCompany;
        },
        set(val) {
          //grants_改变由父组件控制
          this.$emit("on-change-grant", val);
        }
      }
    }
};
</script>
