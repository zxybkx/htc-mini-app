<style lang="scss">
    .box{
        padding: 0rpx 20rpx;
        padding-bottom: 110rpx;
        overflow-y: auto;
        height: 100%;
    }
    .delBtn{
        height: 100%;
        width: 60px;
        background-color: #FA5051;
    }
    .btnContainer{
        width: 100%;
        height: 110rpx;
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
        <!-- 可滑动删除 -->
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
    import { invoiceType } from '@/utils/constant';
    import { FormatData,eachChildInfos } from '@/utils/formatPhotoInvoice';
    import userCard from '@/common/userCard.vue';
    import invoiceCard from '@/common/invoiceCard.vue';
    import {
        ApiIsInvExist,
        ApiCheckInv,
        ApiSetInvOwner,
        ApiPushInv,
        ApiUploadByUrl,
        ApiGetTaxRate,
        ApiAddBillpool,

    } from '@/api/index';
    
    export default{
        data(){
            return{
                currentCompany:{},
                invoiceInfoArray:[],//展示当前页面的数据
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
        methods: {
            handleDetail(index){
                try {
                    getApp().globalData.currentInvoiceInfo=this.invoiceInfoArray[index];
                    uni.setStorageSync('currentEditIndex', index) //缓存当前拍发票编辑的序号
                    if(this.invoiceInfoArray[index].ocrType===invoiceType[0]){
                        // 增值税情况
                        uni.navigateTo({
                            url:'/pages/photo-invoice-detail/index?type=1'
                        })
                    }else{
                        // 非增值税情况
                        uni.navigateTo({
                            url:'/pages/other-photo-invoice-detail/index?type=1'
                        })
                    }
                } catch (error) {
                    uni.showModal({title: '错误',content: error.errMsg,showCancel: false})
                }
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
                if(!this.invoiceInfoArray.length) {
                    uni.showToast({title: '提交发票为空'});
                    return;
                }
                if(this.invoiceInfoArray.some(item=>item.receiver&&item.receiver.length>18)){
                    uni.showModal({
                        title: '提示',
                        content: '收款人超出最大长度18位',
                        showCancel: false,
                        confirmText: '确定',
                    })
                    return;
                }
                // 筛选出增值税发票的数据
                const VAT_INVOICE=this.invoiceInfoArray.filter(item=>item.ocrType==='VAT_INVOICE');
                // 筛选出非增值税发票的数据
                const NOVAT_INVOICE=this.invoiceInfoArray.filter(item=>item.ocrType!=='VAT_INVOICE');

                uni.showLoading({title:'开始提交'});
                try {
                    // 增值税提交
                    const VATPromiseArr=VAT_INVOICE.map(item=>
                            this.subHandleVAT_INVOICE(item));
                    // 非增值税提交
                    const NOVATPromiseArr=NOVAT_INVOICE.map(item=>
                            this.subHandleOther_INVOICE(item.resultInfo))
                    const subRes=await Promise.all([...VATPromiseArr,...NOVATPromiseArr]);
                    let copyInvoice=[...this.invoiceInfoArray];
                    let tipMsg=[];//保存错误提示
                    
                    for (let index = subRes.length-1; index >=0; index--) {
                        let item=subRes[index];
                        if(item.code===0){
                            // 不成功的上传
                            copyInvoice.splice(index,1);
                            tipMsg.push(`${this.invoiceInfoArray[index].invoiceNumber||this.invoiceInfoArray[index].invoiceNo}-${item.msg}`);
                        }else if(item.code===2){
                            // 其他提示
                        }
                    }
                    console.log('subRes',subRes);
                    // 删除不成功的上传发票
                    getApp().globalData.currentInvoiceAllInfo=copyInvoice;
                    uni.hideLoading();
                    
                    tipMsg.length&&uni.showModal({title: '添加发票错误',content: tipMsg.join(','),showCancel: false})
                    if(copyInvoice.length){
                        uni.redirectTo({
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
                        let checkResult={};
                        if(VAT_INVOICEItem.checkPass){
                            // 发票已经查验通过
                            checkResult=VAT_INVOICEItem;
                        }else{
                            // 未查验
                            checkResult=await ApiCheckInv(VAT_INVOICEItem);
                        }
                        if(checkResult.status == '0001'||checkResult.invoiceHeaderId){
                            //查验成功，开始上传
                            const pushRes=await ApiPushInv(checkResult.invoiceHeaderId||checkResult.data.invoiceHeaderId);
                            if(pushRes.failed){
                                // 抛错
                                return {code:0,msg:pushRes.message}
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
                            fileUrl:VAT_INVOICEItem.imageUrlNotSigned,
                            invoicePoolHeaderId:tempInvoiceObj.invoicePoolHeaderId,
                        })
                        return {code:1,msg:'成功'}
                    }
                    // return {code:1,msg:'成功'}
                } catch (error) {
                    return {code:0,msg:'发票上传出错',error}
                }
            },
            async subHandleOther_INVOICE(other_INVOICEItem){
                
                try {
                    const res=await ApiAddBillpool([other_INVOICEItem]);
                    if(res.failed){
                        // 抛错
                        return {code:0,msg:res.message}
                    }
                    if(res.status==='H1014'){
                        if(res.data[0].message==='已认领至我的发票。'||res.data[0].message==='已添加至我的发票。'){
                            return {code:1,msg:'成功'} 
                        }else{
                            return {code:0,msg:res.data[0].message}
                        }
                    }else{
                        if(res.failed){
                            return {code:0,msg:res.message}
                        }
                        return {code:0,msg:res.data[0].message}
                    }
                } catch (error) {
                    console.log('error',error);
                    return {code:0,msg:'发票上传出错',error}
                }
            },
            subEditDeal(index){
                try {
                    const value = uni.getStorageSync('currentEditIndex');
                    if(index!==value) return;
                    // 将编辑的发票信息赋值更新
                    if (value!==''&&JSON.stringify(getApp().globalData.currentInvoiceInfo)!=='{}') {
                        // 需要将扫描的图片url拼接进去
                        getApp().globalData.currentInvoiceAllInfo[value]={
                            ocrType:getApp().globalData.currentInvoiceAllInfo[value].ocrType,
                            imageUrl:getApp().globalData.currentInvoiceAllInfo[value].imageUrl,
                            imageUrlNotSigned:getApp().globalData.currentInvoiceAllInfo[value].imageUrlNotSigned,
                            ...getApp().globalData.currentInvoiceInfo
                        }
                        this.invoiceInfoArray=getApp().globalData.currentInvoiceAllInfo;
                    }
                } catch (e) {
                    uni.showModal({title: '错误',content: e.errMsg,showCancel: false})
                }
            },
        },
        async onShow(){
            const invoiceOriginInfoArray=getApp().globalData.currentInvoiceAllInfo;

            let tempInvoiceOriginInfoArray=[];
            // 发票数据格式化
            invoiceOriginInfoArray.forEach(async (outItem,outIndex)=>{
                // 处理定义过的发票类型
                if(outItem.ocrType==='MACHINE_PRINTED_INVOICE'){
                    // 机打发票
                    outItem.ocrType='GENERAL_MACHINE_INVOICE';
                }
                if(outItem.ocrType&&outItem.resultInfo.invoiceTypeNum==='20'){
                    // 区块链发票
                    outItem.ocrType='BLOCK_CHAIN';
                }
                try {
                    if(invoiceType.includes(outItem.ocrType)&&outItem.resultInfo){
                        // 将外部的ocrType和ocr识别的图片url拼进内部
                        outItem.resultInfo.ocrType=outItem.ocrType;
                        outItem.resultInfo.imageUrl=outItem.imageUrl;
                        outItem.resultInfo.imageUrlNotSigned=outItem.imageUrlNotSigned;
                        let TaxRateRes={};
                        if(outItem.ocrType===invoiceType[0]){
                            // 增值税
                            outItem.taxRate=TaxRateRes.taxRate;
                            FormatData[outItem.ocrType](outItem);//进入票据数据处理
                        }else{
                            // 非增值税
                            // 获取非增值税各个发票类型的税率
                            TaxRateRes=await ApiGetTaxRate(outItem.ocrType);
                            // 做机打发票的数据统一 机打发票有两种票据
                            if(outItem['ocrType']==='GENERAL_MACHINE_INVOICE'&&!outItem.resultInfo['code']){
                                outItem.resultInfo['code']= outItem.resultInfo.invoiceCode;
                                outItem.resultInfo['issueDate']=outItem.resultInfo.invoiceDate;
                                outItem.resultInfo['total']=outItem.resultInfo.amount;
                                outItem.resultInfo['number']=outItem.resultInfo.invoiceNumber;
                                outItem.resultInfo['subtotalAmount']=((1000 * outItem.resultInfo.amount) / ((1 + Number(TaxRateRes.taxRate)) * 1000)).toFixed(2);
                                outItem.resultInfo['subtotalTax']=(outItem.resultInfo.amount*(Number(TaxRateRes.taxRate))).toFixed(2);
                            }

                            outItem.resultInfo.taxRate=TaxRateRes.taxRate;
                            
                            // 每种发票额外处理 ===>处理成eachChildInfos配置对应的情况
                            FormatData[outItem.ocrType](outItem.resultInfo);//进入票据数据处理
                            // 统一字段处理
                            eachChildInfos[outItem.ocrType].forEach(item=>{
                                outItem[item.dbName]=outItem.resultInfo[item.name];
                            })
                        }
                        if(outItem.totalAmount&&TaxRateRes.taxRate){
                            // 通用税额合计处理
                            const taxAmount = (outItem.totalAmount/(1+Number(TaxRateRes.taxRate))*TaxRateRes.taxRate).toFixed(2);
                            outItem.invoiceAmount=outItem.totalAmount-taxAmount;
                            outItem.taxAmount=taxAmount;
                        }
                        if(outItem.ocrType==='FLIGHT_ITINERARY'){
                            // 飞机票税额合计处理
                            if(Number(outItem.total)===Number(outItem.fare)+Number(outItem.aviationDevelopmentFund)+Number(outItem.fuelSurcharge)+Number(outItem.otherTaxes)){
                                outItem.totalAmount=Number(outItem.fare)+Number(outItem.fuelSurcharge);
                                outItem.nonDeductible=Number(outItem.aviationDevelopmentFund)+Number(outItem.otherTaxes);
                            }else{
                                outItem.totalAmount=Number(outItem.total)-Number(outItem.otherTaxes)
                                outItem.nonDeductible=Number(outItem.otherTaxes);
                            }
                            const taxAmount = (outItem.totalAmount/(1+Number(TaxRateRes.taxRate))*TaxRateRes.taxRate).toFixed(2);
                            outItem.taxAmount=taxAmount;
                            outItem.invoiceAmount=outItem.totalAmount-taxAmount;
                        }
                        outItem.invoiceTypeMeaning=outItem.resultInfo.invoiceTypeMeaning||outItem.resultInfo.type;
                        tempInvoiceOriginInfoArray.push(outItem);
                        this.invoiceInfoArray=tempInvoiceOriginInfoArray;
                    }
                    this.subEditDeal(outIndex);
                } catch (error) {
                    console.log(error);
                    // wx.showModal({title: '错误',content: '发票识别出错了',showCancel: false})
                }
            })
            this.currentCompany=getApp().globalData.currentCompanyInfo;
        }
    }
</script>
    
      