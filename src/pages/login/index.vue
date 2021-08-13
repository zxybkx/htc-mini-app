<template>
	<view class="container">
      <view class="login">
        <view class="title">账户登录</view>
        <view class="sub-title">欢迎使用汇税通发票助手</view>
        <view class="fileds">
          <view class="name-field field">
            <uni-easyinput trim=true prefixIcon="contact" v-model="username" placeholder="请输入账号"></uni-easyinput>
          </view>
          <view class="pwd-faield field">
            <uni-easyinput trim=true prefixIcon="locked" v-model="password" type="password" placeholder="请输入密码"></uni-easyinput>
          </view>
        </view>
        <view class="login-button">
          <button type="primary" @click="handleLogin">
            登录
          </button>
        </view>
      </view>
    </view>
</template>

<script>
	import {ApiLogin,ApiGetTenants,ApiReleationsSave,ApiAlipayLogin} from '@/api';
	export default {
		components: {

		},
		data() {
			return {
				username: "",
        password: "",
        // username: "admin",//开发环境
        // password: "htcadmin666",//开发环境
        username: "TEST_ADMIN",//测试环境
        password: "test@hand.com",//测试环境
			}
		},
		computed: {},
		methods: {
			async handleLogin(){
        if(!this.username||!this.password){
          uni.showToast({title: '密码或账号不为空',duration: 2000});
          return;
        }
        uni.showLoading();
        const loginres=await ApiLogin({
          username:this.username,
          password:this.password
        })
        if(!loginres.error){
          // 当请求成功
          const res=await ApiGetTenants();
          getApp().globalData.currentCompanyInfo=res[0];
          // 将openId与用户相关信息绑定
          await ApiReleationsSave({
            openId:this.openId,
            loginName:this.username,
            pwd:this.password,
          })
          uni.setStorageSync('currentCompanyInfo',res[0]);
          uni.hideLoading();
          uni.redirectTo({url:'/pages/select-company/index'})
        }
      }
		},
    onLoad(options){
      const self=this;
      // if(options.openId){
      //   this.openId=options.openId;
      // }else{
      //   my.getAuthCode({scopes: 'auth_base'})
      //   .then(res=>{
      //       // 通过token获取相关信息
      //       return ApiAlipayLogin(res.authCode);
      //   })
      //   .then(res=>{
      //       // console.log(res);
      //       this.openId=res.data;
      //   })
      //   .catch(err=>{
      //     console.log('code获取出错',err);
      //   })
      // }
    }
	}
</script>

<style lang="scss">
page{ 
  background-image: linear-gradient(#2196f3, #ffffff)
}

.container{  
  padding: 24rpx;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start; 
} 

.login{
  background-color: #ffffff;
  width: 100%;
  height: 90%;
  position: fixed;
  bottom: 0;
  left: 0; 
  border-top:1px solid #ffffff ;
  border-radius: 60rpx 60rpx 0 0;
  box-sizing: border-box;
  padding: 72rpx 72rpx;
}

.title{
  font-weight: bold;
  font-size: 42rpx; 
}

.sub-title{
  font-size: 26rpx;
  color: #9e9e9e;
  padding: 8rpx 0;
}

.fileds{
  margin-top: 64rpx;
}

.field{
  width: calc(100% + 32rpx);
  margin-top: 32rpx;
  margin-left: -32rpx;
}

.eye-icon{
  color: #1e88e5;
  font-weight: bold;
  font-size: 40rpx !important;
}

.login-button{
  margin-top: 124rpx;
  width: 100%;
}

</style>
