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
import {
    ApiLogin,
    ApiAlipayLogin,
    ApiGetTenants,
    ApiWXworkLogin,
    ApiGetUserReleations
} from '@/api/index';
// #ifdef H5
import {BrowserEnv} from '../../utils/browserEnv';
import {REDIRECT_URL} from '../../api/config';
import { WXAPPID } from '../../utils/constant';
const browserEnv=BrowserEnv();

const ToolGetUrlParam=(url,code)=>{
    url = new URL(url);
    let params = new URLSearchParams(url.search.slice(1));
    return params.getAll(code)[0]
};
// #endif
export default{
    async created(){
        // excessive
        uni.showLoading({title:'正在进入汇税通'});
        // #ifdef MP-ALIPAY
        this.subAlipay();
        // #endif
        // #ifdef H5
        switch (browserEnv) {
            case 1:
                this.subWXwork();
                break;
            case 2:
                this.subDingding();
                break;
            default:
                this.subWXwork();
                break;
        }
        // #endif
    },
    methods: {
        // #ifdef H5
        // 企业微信流程
        async subWXwork(){
            // if (!window.location.href.includes('code')){
            //     const authUrl =
            //         'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            //         WXAPPID +
            //         '&redirect_uri=' +
            //         REDIRECT_URL +
            //         '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
            //     window.location.href = authUrl;
            //     return;
            // }
            let code = ToolGetUrlParam(window.location.href, 'code');
            if (code) {
                const userInfo=await ApiWXworkLogin(code);
                let corpId = userInfo.corpId;
                let uid = userInfo.open_userid;
                const getRelRes=await ApiGetUserReleations({
                    type:'webchat',
                    cropId:corpId,
                    appId:uid
                });
                if(getRelRes.empty){
                    uni.navigateTo({
                      url: `/pages/login/index?type=webchat&uid=${uid}&corpId=${corpId}`
                    });
                }else{
                    const content = getRelRes.content[0];
                    ApiLogin({
                      username: content.loginName,
                      password: content.rsaPassword
                    })
                    .then(async backRes=>{
                        if(!backRes.error){
                            // 当请求成功
                            const res=await ApiGetTenants();
                            getApp().globalData.currentCompanyInfo=res[0];
                            uni.setStorageSync('currentCompanyInfo',res[0]);
                            
                            uni.hideLoading()
                            uni.redirectTo({url:'/pages/select-company/index'})
                            // wx.redirectTo({url:'/pages/index'});
                        }else{
                            // 当请求失败
                            uni.showModal({
                                title: '提示',
                                content: '自动登录出错',
                                showCancel: false,
                                success: function () {
                                    uni.navigateTo({
                                        url: `/pages/login/index?type=webchat&uid=${uid}&corpId=${corpId}`
                                    });
                                }
                            });
                        }
                    })
                }
            }else {
                // console.log('跳转的链接没有ddCorpid 和 dingId');
                uni.navigateTo({ url: '/pages/login/index' })
            }
        },
        // 钉钉流程
        async subDingding(){
            // uni.redirectTo({url:`/pages/login/index`});
            const href = window.location.href;
            const ddCorpid = ToolGetUrlParam(href, 'corpid');
            console.log('钉钉corpid', ddCorpid);
            const dingId = ToolGetUrlParam(href, 'dingId');
            console.log('钉钉dingId', dingId);
            if (ddCorpid && dingId) {
                const getRelRes=await ApiGetUserReleations({
                    type:'ding',
                    cropId:ddCorpid,
                    appId:dingId
                })
                if(getRelRes.empty){
                    uni.navigateTo({
                        url: `/pages/login/index?uid=${dingId}&corpId=${ddCorpid}&type=ding`
                    });
                }else{
                    const content = res.content[0];
                    const loginRes =await ApiLogin({
                        username: content.loginName,
                        password: content.rsaPassword
                    });
                    if(!loginRes.error){
                        // 当请求成功
                        const res=await ApiGetTenants();
                        getApp().globalData.currentCompanyInfo=res[0];
                        uni.setStorageSync('currentCompanyInfo',res[0]);
                        
                        uni.hideLoading()
                        uni.redirectTo({url:'/pages/select-company/index'})
                        // wx.redirectTo({url:'/pages/index'});
                    }else{
                        // 当请求失败
                        uni.showModal({
                            title: '提示',
                            content: '自动登录出错',
                            showCancel: false,
                            success: function () {
                                uni.navigateTo({
                                    url: `/pages/login/index?uid=${dingId}&corpId=${ddCorpid}&type=ding`
                                });
                            }
                        });
                    }
                }
            } else {
                // console.log('跳转的链接没有ddCorpid 和 dingId');
                uni.navigateTo({ url: '/pages/login/index' })
            }
        },
        // #endif
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
                        if(!backRes.error){
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
                    uni.redirectTo({url:`/pages/login/index?type=alipay&openId=${res.data}`});
                }
            })
            .catch (error=>{
                uni.hideLoading()
                // 抛错
                console.log(error);
            })
        },
    }
}
</script>