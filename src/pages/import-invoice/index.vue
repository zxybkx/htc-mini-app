<style lang="scss">
page{
    background:#F6F6F6;
}
.container{
    padding: 0rpx 20rpx;
}
</style>

<template>
    <view class="container">
        <user-card :currentCompany="currentCompany" />
        <navSection-ui @startUse="HandleElectronicTicket">
            <view slot="title">导入电子发票</view>
            <view slot="tipDetail">使用前请先确保您的卡包中含有电子发票，导入后可在“我的发票”中查看电子发票</view>
        </navSection-ui>
    </view>
</template>
<script>
import {ApiIsInvExist,ApiCheckInv,ApiGetEmployeeClearTips,ApiGetIsvToken} from '@/api';
import userCard from '@/common/userCard.vue';
import navSectionUi from '@/components/navSectionUi.vue';
import { ISV_APP_CODE } from '@/utils/constant'

export default {
    data(){
        return{
            currentCompany:{}
        }
    },
    components: {
        userCard,
        navSectionUi
    },
    methods: {
        async HandleElectronicTicket(){
            try {
                uni.showLoading({title: '开始处理'})
                // const getAuthCode=await my.getAuthCode({scopes: 'auth_base'});
                // console.log('///',getAuthCode);
                
                // 获取授权authCode
                const getIsvToken = await ApiGetIsvToken();
                console.log('//isvToken',getIsvToken);
                my.navigateToMiniProgram({
                    appId: '77700150', // 固定值，请勿修改
                    path: `pages/select-invoice-bill/index?isv_app_code=${ISV_APP_CODE}&isv_token=${getIsvToken.isvToken}&isv_serial_no=${getIsvToken.serialNo}&isv_register_no=${this.currentCompany.taxpayerNumber}&source=einvoice&channel=reim_helper`,
                    success: (res) => {
                        console.log('成功',res)
                        console.log(JSON.stringify(res))
                    },
                    fail: (res) => {
                        console.log('错误',res)
                    }
                });
                
                uni.hideLoading();
                // uni.navigateTo({
                //     url:'/pages/import-invoice-list/index'
                // })
            } catch (error) {
                uni.hideLoading();
                console.log('获取票包信息出错',error);
                uni.showModal({title:'错误',content:error.message,showCancel:false})
            }    
        }
    },
    onLoad(options){
      const tempCurrentCompany=getApp().globalData.currentCompanyInfo;
      this.currentCompany=tempCurrentCompany;
    }
}
</script>