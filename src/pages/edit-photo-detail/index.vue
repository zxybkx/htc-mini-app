<style lang="scss">
.myContainer{
    background-color: #F6F6F6;
    padding-bottom: 120rpx;
}
.field{
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.time,.field{
    display: flex;
    color: #646566;
    font-size: 34rpx;
    background: #fff;
    padding: 20rpx;
    font-size: 14px;
    box-sizing: border-box;
    .left{
        max-width: 6.2em;
        min-width: 6.2em;
        margin-right: 16px;
        flex-shrink: 0;
    }
    text{
        color: red;
        margin-right: 6rpx;
    }
    picker,.picker{
        width:100%;
        text-align: left;
        height: 48rpx;
    }
}
.myContainer{
    width: 710rpx;
    border-radius: 10rpx;
    margin: 20rpx auto;
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
}
</style>
<template>
    <div class="myContainer">
        <div class="field">
            <div class="left"><text>*</text>发票代码</div>
            <uni-easyinput trim=true v-model="invoiceObj.invoiceCode" placeholder="请输入发票代码"></uni-easyinput>
        </div>
        <div class="field">
            <div class="left"><text>*</text>发票号码</div>
            <uni-easyinput trim=true v-model="invoiceObj.invoiceNumber" placeholder="请输入发票号码"></uni-easyinput>
        </div>
        <div class="field">
            <div class="left"><text>*</text>发票金额</div>
            <uni-easyinput trim=true v-model="invoiceObj.invoiceAmount" placeholder="请输入发票金额"></uni-easyinput>
        </div>
        <div class="field">
            <div class="left"><text> </text>校验码</div>
            <uni-easyinput trim=true v-model="invoiceObj.checkCode" placeholder="请输入校验码"></uni-easyinput>
        </div>
        <div class="time">
            <div class="left"><text>*</text>开票日期</div>
            <picker mode="date" @change="handleChange">
                <div class="picker">{{invoiceObj.invoiceDate||"请选择日期"}}</div>
            </picker>
        </div>
        <div class="C-flex btnContainer">
            <div class="C-flex btn" @tap="handleCheck">重新查验</div>
        </div>
    </div>
</template>
<script>
    import {ApiCheckInv} from '@/api/index';
    import {formatCheckObj} from '@/utils/formatInvObj';
    export default{
        data(){
            return{
                invoiceObj:{},
            }
        },
        methods:{
            handleChange(e){
                // this.invoiceObj.invoiceDate=e.detail.value;
                this.$set(this.invoiceObj,'invoiceDate',e.detail.value.replace(/\//g,'-'))
                // console.log(this.invoiceObj);
            },
            async handleCheck(){
                // console.log('this.invoiceObj',this.invoiceObj);
                if(!this.invoiceObj.invoiceDate||!this.invoiceObj.invoiceCode||!this.invoiceObj.invoiceNumber||!this.invoiceObj.invoiceAmount){
                    uni.showToast({title: '必填项为空',icon: 'none',duration: 2000})
                    return;
                }
                //开始查验
                try {
                    uni.showLoading({title: '开始查验'})
                    const checkResult=await ApiCheckInv(this.invoiceObj);
                    if(checkResult.status == '0001'){
                        uni.hideLoading();
                        uni.showToast({title: '查验成功',icon: 'none',duration: 2000});
                        checkResult.data.checkPass=1;//增加发票查验通过字段
                        getApp().globalData.currentInvoiceInfo=formatCheckObj(checkResult.data);  
                        // wx.redirectTo({
                        //     url:'/pages/photoInvoiceList'
                        // })
                        setTimeout(()=>{uni.navigateBack();},1000)
                    }else{
                        // 抛错
                        throw checkResult;
                    }
                } catch (error) {
                    uni.hideLoading();
                    uni.showModal({title: '错误',content: error.message||error.errMsg,showCancel: false})
                }
            }
        },
        onLoad(){
            this.invoiceObj=JSON.parse(JSON.stringify(getApp().globalData.currentInvoiceInfo));
            console.log(this.invoiceObj);
        }
    }
</script>