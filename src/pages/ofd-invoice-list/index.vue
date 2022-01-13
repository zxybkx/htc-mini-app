<style lang="scss">
page{
    background-color: #F6F6F6;
    padding-bottom: 120rpx;
}
.ofdInvoiceList{
    padding: 0rpx 20rpx;
}
.delBtn{
    height: 100%;
    width: 60px;
    background-color: #FA5051;
}
.btnContainer{
    width: 100%;
    height: 100rpx;
    background: #FFFFFF;
    position: fixed;
    left:0;
    bottom: 0;
    .btn{
        width: 700rpx;
        height: 72rpx;
        background: #0282F0;
        border-radius: 8rpx;
        font-size: 32rpx;
        font-weight: 400;
        color: #FFFFFF;
    }
}
</style>
<template>
    <div class="ofdInvoiceList">
        <user-card :currentCompany="currentCompany" />
        <!-- 可滑动删除 -->

        <!-- <van-swipe-cell
            right-width="{{60}}"
        > -->
        <div @click="handleCheck">
            <invoice-card :info="invoiceInfo" :uiTag=true >
                <div slot="title">{{invoiceInfo.invoiceTypeMeaning}}</div>
            </invoice-card>
        </div>
            <!-- <van-icon slot="right" color="#fff" name="delete" class="delBtn" @tap="handleDelItem"/>
        </van-swipe-cell> -->
        <div class="C-flex btnContainer">
            <div class="C-flex btn" @click="handleAddInvoice">添加至我的发票</div>
        </div>
    </div>
</template>
<script>
import { ApiIsInvExist, ApiSetInvOwner,ApiCheckInv,ApiPushInv,ApiOfdFileUpload,ApiOfdUrlToJpg } from '../../api/index'
import { formatExistInvObj } from '@/utils/formatInvObj'
import userCard from '@/common/userCard.vue';
import invoiceCard from '@/common/invoiceCard.vue';
export default{
    data(){
        return{
            currentCompany:{},
            invoiceInfo:{}
        }
    },
    components: {
        userCard,
        invoiceCard
    },      
    methods:{
        handleCheck(){
            uni.navigateTo({url:'/pages/ofd-check-seal/index'});
        },
        // handleDelItem(){
        //     console.log('删除');
        // },
        async handleAddInvoice(){
            // 处理增值税发票的上传
            uni.showLoading({title: '开始上传'});
            try {
                let VAT_INVOICEItem=JSON.parse(JSON.stringify(this.invoiceInfo));
                const serchResult=await ApiIsInvExist(VAT_INVOICEItem);
                if (serchResult.content.length > 0) {
                    // 发票池中有对应发票记录
                    const invObj = serchResult.content[0];
                    if (invObj.ticketCollector) {
                        //发票存在发票池并有归属人
                        uni.showModal({
                            title: '错误',
                            content: getApp().globalData.tipInvoiceUser ? '该发票已存在于发票池，不可重复采集。如有疑问，请联络系统管理员。'
                            : `您所采集的发票已经由员工 ${invObj['companyCode']}-${invObj['employeeNum']}-${invObj['ticketCollector']}-${invObj['employeeIdentify']} 采集并拥有，请联系此员工删除此发票记录或者联系公司管理员将发票重新分配给您。`,
                            showCancel: false
                        })
                        uni.hideLoading();
                        return;
                    } else {
                        // 1:发票存在发票池但没绑定到个人===>绑定个人信息提交
                        const setOwnerRes=await ApiSetInvOwner(invObj);
                        // 未判断出错情况
                    }
                } else {
                    //不存在这个发票，开始查验 
                    const checkResult=await ApiCheckInv(VAT_INVOICEItem);
                    if(checkResult.status == '0001'){
                        //查验成功，开始上传
                        const pushRes=await ApiPushInv(checkResult.data.invoiceHeaderId);
                        // 未判断出错情况
                        if(pushRes.failed){
                            throw pushRes
                        }
                    }else{
                        throw checkResult;
                    }
                }
                // 更新发票信息
                const refreshInvoiceInfo=await ApiIsInvExist({
                    invoiceCode: VAT_INVOICEItem.invoiceCode,
                    invoiceNumber: VAT_INVOICEItem.invoiceNumber
                });
                if(serchResult.content.length==0){
                    // 当发票为新发票只添加入发票时再归于个人
                    const setOwnerRes=await ApiSetInvOwner(refreshInvoiceInfo.content[0]);
                }
                const tempInvoiceObj=refreshInvoiceInfo.content[0];
                // 将更新的发票数据和老的数据合并
                VAT_INVOICEItem=Object.assign(VAT_INVOICEItem,tempInvoiceObj);
                //发票信息更新成功 ===> 更新全局的当前发票信息==>页面跳转
                getApp().globalData.currentInvoiceAllInfo=VAT_INVOICEItem;
                getApp().globalData.currentInvoiceInfo=formatExistInvObj(VAT_INVOICEItem);
                // 上传档案
                let uploadResult=await ApiOfdFileUpload({filePath:VAT_INVOICEItem.tempFilePath,invoicePoolHeaderId:VAT_INVOICEItem.invoicePoolHeaderId,checkTag:'N'})
                if(typeof uploadResult==='string') uploadResult=JSON.parse(uploadResult);
                console.log('uploadResult',uploadResult);
                uni.hideLoading();
                uni.navigateTo({url:'/pages/invoice-collect-result/index'});

            } catch (error) {
                console.log('///',error);
                uni.hideLoading();
                error.message&&uni.showModal({title: '错误',content: error.message,showCancel: false})
            }
        }
    },
    onLoad(){
      this.currentCompany=getApp().globalData.currentCompanyInfo;
      this.invoiceInfo=getApp().globalData.currentInvoiceAllInfo;
    },
}
</script>