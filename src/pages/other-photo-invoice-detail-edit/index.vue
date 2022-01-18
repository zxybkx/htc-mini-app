<style lang="scss">
.page{
    background: #F6F6F6;
    padding: 20rpx;
    height: 100%;
    overflow-y: auto;
    margin-bottom: 112rpx;
    box-sizing: border-box;
}
.editBox{
    padding: 0rpx 10rpx;
    background:#fff;
    border-radius: 12rpx;
    .simpleInputBox{
        height: 90rpx;
        border-bottom: 2rpx solid #EEE;
        font-size: 28rpx;
        font-weight: 400;
        color: #4A4A4A;
        .left{
            width: 266rpx;
            text-align: left;
            flex-shrink: 0;
            text{
                display: inline-block;
                width:20rpx;
                color: red;
            }
        }
        .right{
            flex-grow: 1;
            text-align: right;
            font-size: 24rpx;
            input{
                font-size: 24rpx;
            }
        }
    }
    .btnBox{
        position: fixed;
        bottom: 0rpx;
        width: 100%;
        height: 112rpx;
        left:0;
        background: #fff;
        .btn{
            width: 690rpx;
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
    <div class="page">
        <div class="editBox">
            <div v-for="(item,index) in viewUiArray" :key="index">
                <div class="C-flex simpleInputBox" v-if="!item.hidden">
                    <div class="left">
                        <text v-if="item.required">*</text>
                        <text v-else></text>
                        <label>{{item.label}}</label>
                    </div>
                    <!-- 普通input -->
                    <div class="right" v-if="item.type==='string'||item.type==='digit'">
                        <uni-easyinput :type="item.type" :data-name="item.name" placeholder="请输入" v-model="currentInvoiceInfo[item.name]">
                        </uni-easyinput>
                    </div>
                    <!-- 日期/时间选择 -->
                    <div class="right" v-else>
                        <picker :mode="item.type" :data-name="item.name"  @change="handleChange">
                            <div class="picker">
                                {{currentInvoiceInfo[item.name] || '请选择'}}
                            </div>
                        </picker>
                    </div>
                </div>
            </div>
            
            <!-- 底部按钮 -->
            <div class="C-flex btnBox" @click="handleSubmit">
                <div class="C-flex btn">确定</div>
            </div>
        </div>
    </div>
</template>
<script>
import { eachChildInfos } from '@/utils/formatPhotoInvoice';
export default{
    data(){
        return {
            currentInvoiceInfo:{},
            viewUiArray:[]
        }
    },
    methods:{
        // handleInput(e){
            
        //     this.currentInvoiceInfo[e.target.dataset.name]=e.$wx.detail.value;
        // },
        handleChange(e){
            let tempCurrentCompany=JSON.parse(JSON.stringify(this.currentInvoiceInfo));
            tempCurrentCompany[e.target.dataset.name]=e.detail.value.replace(/\//g,'-');
            // console.log('eee',e);
            
            this.currentInvoiceInfo=tempCurrentCompany;
        },
        handleSubmit(){
            
            const tempViewUiArray=JSON.parse(JSON.stringify(this.viewUiArray));
            // 判断必传字段是否有为空的情况
            const judgeRes = tempViewUiArray.filter(item=>item.required).some(
                item=>this.currentInvoiceInfo[item.name]==='');
                
            if(judgeRes){
                uni.showToast({title: '必填项不为空',icon: 'none',duration: 2000})
                return;
            }
            if(this.currentInvoiceInfo.receiver&&this.currentInvoiceInfo.receiver.length>18){
                uni.showModal({
                    title: '提示',
                    content: '收款人超出最大长度18位',
                    showCancel: false,
                    confirmText: '确定',
                })
                return;
            }
            // 将ocr识别的字段编辑后赋值全局变量globalData.currentInvoiceInfo
            getApp().globalData.currentInvoiceInfo.resultInfo=this.currentInvoiceInfo;
            // wx.redirectTo({url:'/pages/photoInvoiceList'})
            uni.navigateBack();
        }
    },
    onLoad(){
        const tempCurrentInvoiceInfo=JSON.parse(JSON.stringify(getApp().globalData.currentInvoiceInfo));
        this.viewUiArray=eachChildInfos[tempCurrentInvoiceInfo.ocrType];
        this.currentInvoiceInfo=tempCurrentInvoiceInfo.resultInfo//获取ocr识别的字段
    }
}
</script>