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
        <!-- <img src="@/static/img/brand.png" alt=""> -->
    </div>
</template>
<script>
import { ApiLogin, ApiAlipayLogin, ApiGetTenants,ApiWXworkLogin} from '@/api/index';
export default{
    async created(){
        // excessive
        uni.showLoading({title:'正在进入汇税通'});
        // this.subWXwork();
        this.subAlipay();
    },
    methods: {
        // 企业微信流程
        subWXwork(){
            uni.redirectTo({url:`/pages/login/index`});
            // let code; 
            // if (window.location.href.includes('code')) {
            //     console.log('window.location.href',window.location.search);
            //     let params = new URLSearchParams(window.location.search);
            //     code=params.getAll('code')[0];
            // }else{
            //     const authUrl =
            //     'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            //     'wx96bc44831cac79ea' +
            //     '&redirect_uri=' +
            //     encodeURI('http://jade.free.svipss.top') +
            //     '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
            //     window.location.href = authUrl;
            //     return;
            // }
            // ApiWXworkLogin(code).then(res=>{
            //     console.log('res',res);
            //     alert(JSON.stringify(res))
            // });
            // return;
        },
        // 钉钉流程
        subDingding(){
            
            uni.redirectTo({url:`/pages/login/index`});
        },
        // 支付宝流程
        subAlipay(){
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
}
</script>