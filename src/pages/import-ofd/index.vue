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
        <navSection-ui @startUse="HandleStartUse">
            <view slot="title">导入OFD 文件</view>
            <view slot="tipDetail">使用前请先确保您的卡包中含有电子发票，导入后可在“我的发票”中查看电子发票</view>
        </navSection-ui>
    </view>
</template>
<script>
import {ApiIsInvExist,ApiCheckInv,ApiGetEmployeeClearTips} from '../../api';
import userCard from '../../common/userCard.vue';
import navSectionUi from '../../components/navSectionUi.vue'
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
        HandleStartUse(){
            // my.navigateToMiniProgram({
            //     appId: '2021002161674484', // 固定值，请勿修改
            //     path: 'pages/index/index',
            //     success: (res) => {
            //         console.log('成功',res)
            //     },
            //     fail: (res) => {
            //         console.log('错误',res)
            //     }
            // });
        }
    },
    onLoad(){
      const tempCurrentCompany=getApp().globalData.currentCompanyInfo;
      this.currentCompany=tempCurrentCompany;
    }
}
</script>