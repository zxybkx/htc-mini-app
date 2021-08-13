<style lang="scss">
    .box{
        padding: 0rpx 20rpx;
        background-color: #F6F6F6;
        padding-bottom: 120rpx;
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
    <view class="box">
        <user-card :currentCompany="currentCompany"></user-card>
        
        <uni-swipe-action>
          <div style="margin-top:20rpx;" v-for="(item, index) in invoiceInfoArray" :key="index">
            <uni-swipe-action-item :right-options="options" @click="handleDelItem(index)">
              <div @click="handleDetail(index)" style="width:100%;">
                <invoice-card :info="item" :index="index" :uiTag=true>
                    <div slot="title">{{item.invoiceTypeMeaning}}</div>
                </invoice-card>
              </div>
            </uni-swipe-action-item>
          </div>
        </uni-swipe-action>
        <div class="C-flex btnContainer">
            <div class="C-flex btn" @click="handleAddInvoice">添加至我的发票</div>
        </div>
    </view>
</template>
<script>
import {
    ApiIsInvExist,
    ApiCheckInv,
    ApiSetInvOwner,
    ApiPushInv,
    ApiUploadByUrl
} from '@/api/index';
import userCard from '@/common/userCard.vue';
import invoiceCard from '@/common/invoiceCard.vue';
export default{
    data(){
        return{
            invoiceInfoArray:[],
            currentCompany:{},
            options:[{
                text: '删除',
                style: {
                    backgroundColor: '#dd524d'
                }
            }]
        }
    },
    components: {
        userCard,
        invoiceCard
    },
    methods:{
        handleDetail(index){
            getApp().globalData.currentInvoiceInfo=this.invoiceInfoArray[index];
            uni.navigateTo({
                url:'/pages/view-record/index'
            })
        },
        handleDelItem(index){
            const self=this;
            uni.showModal({
                title: '提示',
                content: '确定删除当前发票',
                success (res) {
                    if (res.confirm) {
                        self.invoiceInfoArray.splice(index,1);
                        self.invoiceInfoArray=self.invoiceInfoArray;
                    }
                }
            })
        },
        async handleAddInvoice(){
            if(!this.invoiceInfoArray.length){
                uni.showToast({
                    title: '提交发票为空',
                    duration: 2000
                });
                return;
            }
            uni.showLoading({title:'开始提交'});
            try {
                // 增值税提交
                const VATPromiseArr=this.invoiceInfoArray.map(item=>
                        this.subHandleVAT_INVOICE(item));
                const subRes=await Promise.all(VATPromiseArr);

                let tempCopyInvoice=[...this.invoiceInfoArray];
                let tipMsg=[];//保存错误提示
                for (let index = subRes.length-1; index >=0; index--) {
                    let item=subRes[index];
                    if(item.code===0){
                        // 不成功的上传
                        tempCopyInvoice.splice(index,1);
                        tipMsg.push(`${this.invoiceInfoArray[index].invoiceNumber||this.invoiceInfoArray[index].invoiceNo}-${item.msg}`);
                    }else if(item.code===2){
                        // 其他提示
                    }
                }
                console.log('subRes',subRes);
                // 删除不成功的上传发票
                getApp().globalData.currentInvoiceAllInfo=tempCopyInvoice;
                uni.hideLoading();
                
                tipMsg.length&&uni.showModal({title: '添加错误发票号码',content: tipMsg.join(','),showCancel: false})
                // 当采集成功的发票数量大于0时页面跳转
                console.log('//copyInvoice',tempCopyInvoice);
                if(tempCopyInvoice.length){
                    uni.navigateTo({
                        url:'/pages/photo-invoice-result/index'
                    })
                }
            } catch (error) {
                console.log(error)
                uni.hideLoading();
            }
        },
        async subHandleVAT_INVOICE(VAT_INVOICEItem){
            // 处理增值税发票的上传
            try {
                const serchResult=await ApiIsInvExist(VAT_INVOICEItem);
                if (serchResult.content.length > 0) {
                    // 发票池中有对应发票记录
                    const invObj = serchResult.content[0];
                    if (invObj.ticketCollector) {
                        //发票存在发票池并有归属人
                        const backRes= getApp().globalData.tipInvoiceUser ? '该发票已存在于发票池，不可重复采集。如有疑问，请联络系统管理员。'
                            : `您所采集的发票已经由员工 ${invObj['companyCode']}-${invObj['employeeNum']}-${invObj['ticketCollector']}-${invObj['employeeIdentify']} 采集并拥有，请联系此员工删除此发票记录或者联系公司管理员将发票重新分配给您。`;
                        return {code:0,msg:backRes}
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
                            return{code:0,msg:pushRes.message}
                        }
                    }else{
                        // 抛错
                        return {code:0,msg:checkResult.message||'发票上传出错'}
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
                // VAT_INVOICEItem是从this.invoiceInfoArray来指针未改变
                VAT_INVOICEItem=Object.assign(VAT_INVOICEItem,tempInvoiceObj);
                // 上传档案
                if(true||getApp().globalData.uploadRecord){
                    await ApiUploadByUrl({
                        fileUrl:VAT_INVOICEItem.imageUrl,//当电子票时传入第三方应用返回的url
                        invoicePoolHeaderId:tempInvoiceObj.invoicePoolHeaderId,
                        sourceCode:'ALIPAY_CARD'
                    })
                    return {code:1,msg:'成功'}
                }
                // return {code:1,msg:'成功'}
            } catch (error) {
                return {code:0,msg:'发票上传出错',error}
            }
        },
    },
    onLoad(options){
        this.currentCompany=getApp().globalData.currentCompanyInfo;
        const invoiceOriginInfoArray=getApp().globalData.currentInvoiceAllInfo;
        // console.log('////',invoiceOriginInfoArray);
        this.invoiceInfoArray=invoiceOriginInfoArray;
    }
}
</script>