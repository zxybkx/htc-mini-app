<style lang="scss">
.logoContainer{
    height: 100%;
    width: 100%;
    position: absolute;
    background: #fff;
    img{
        height: 243rpx;
        width: 221rpx;
    }
}
</style>
<template>
    <div class="C-flex logoContainer">
        <img src="@/static/img/brand.png" alt="">
    </div>
</template>
<script>
import { ApiLogin, ApiAlipayLogin, ApiGetTenants} from '@/api/index';
export default{
    async created(){
        // excessive
        uni.showLoading({title:'正在进入汇税通'});
        const self=this;
        my.getAuthCode({scopes: 'auth_base'})
        .then(res=>{
            // 通过code获取相关信息
            return ApiAlipayLogin(res.authCode);
        })
        .then(res=>{
            if(res.status==='10001'){
                getApp().globalData.loginInfo=res.data;
                ApiLogin({
                    username:res.data.loginName,
                    password:res.data.rsaPassword
                })
                .then(async backRes=>{
                    if(!res.error){
                        // 当请求成功
                        const res=await ApiGetTenants();
                        getApp().globalData.currentCompanyInfo=res[0];
                        uni.setStorageSync('currentCompanyInfo',res[0]);
                        uni.hideLoading()
                        uni.redirectTo({url:'/pages/select-company/index'})
                        // wx.redirectTo({url:'/pages/index'});
                    }
                })
            }else{
                uni.hideLoading()
                uni.redirectTo({url:`/pages/login/index?openId=${res.data}`});
            }
        })
        .catch (error=>{
            uni.hideLoading()
            // 抛错
            console.log(error);
        })
    }
}
</script>