<style>

</style>
<template>
    <div></div>
</template>
<script>
import { ApiLogin, ApiAlipayLogin, ApiGetTenants} from '@/api/index';
export default{
    async created(){
        // excessive
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
                        uni.redirectTo({url:'/pages/select-company/index'})
                        // wx.redirectTo({url:'/pages/index'});
                    }
                })
            }else{
                uni.redirectTo({url:`/pages/login/index?openId=${res.data}`});
            }
        })
        .catch (error=>{
            // 抛错
            console.log(error);
        })
    }
}
</script>