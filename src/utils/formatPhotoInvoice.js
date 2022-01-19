import { invoiceType } from './constant';
// 发票列表对应字段基本信息
// const nonOcrResData = {
//     VAT_INVOICE: {
//         time: 'issueDate',
//         amount: 'total',
//         payName: 'buyerName',
//         sellName: 'sellerName',
//         code: 'code',
//         num: 'number',
//     },
//     TRAIN_TICKET: {
//         time: 'invoiceDate',
//         amount: 'ticketPrice',
//         payName: 'name',
//         sellName: '',
//         code: 'serialNumber',
//         num: 'ticketNumber',
//     },
//     TOLL_INVOICE: {
//         time: 'tollDate',
//         amount: 'amount',
//         payName: '',
//         sellName: '',
//         code: 'invoiceCode',
//         num: 'invoiceNumber',
//     },
//     TAXI_INVOICE: {
//         time: 'date',
//         amount: 'totalFare',
//         payName: '',
//         sellName: '',
//         code: 'invoiceCode',
//         num: 'number',
//     },
//     FLIGHT_ITINERARY: {
//         time: 'issueDate',
//         amount: 'total',
//         payName: 'passengerName',
//         sellName: '',
//         code: 'agentCode',
//         num: 'ticketNumber',
//     },
//     BUS_TICKET: {
//         time: 'ticketDate',
//         amount: 'amount',
//         payName: '',
//         sellName: '',
//         code: 'invoiceCode',
//         num: 'invoiceNumber',
//     },
//     QUOTA_INVOICE: {
//         time: '',
//         amount: 'amount',
//         payName: '',
//         sellName: '',
//         code: 'code',
//         num: 'number',
//     },
//     SPOT_TICKET: {},
//     BLOCK_CHAIN: {},
// };
export const eachChildInfos={
    // 火车票
    [invoiceType[1]]:[
        {
            name: 'serialNumber',
            dbName: 'invoiceCode',
            label: '发票代码',
            type: 'string',
            required: true,
        },
        {
            name: 'ticketNumber',
            dbName: 'invoiceNo',
            label: '发票号码',
            type: 'string',
            required: true,
        },
        {
            name: 'invoiceDate',
            dbName: 'invoiceDate',
            length: 12,
            label: '开票日期',
            type: 'date',
            required: true,
        },
        {
            name: 'ticketPrice',
            dbName: 'totalAmount',
            label: '价税合计',
            type: 'digit',
            required: true,
        },
        {
            name: 'taxRate',
            dbName: 'taxRate',
            label: '税率',
            type: 'string',
        },
        {
            name: 'taxAmount',
            dbName: 'taxAmount',
            label: '税额合计',
            type: 'digit',
            // required: true,
        },
        {
            name: 'invoiceAmount',
            dbName: 'invoiceAmount',
            label: '不含税金额',
            type: 'digit',
            // required: true,
        },
        {
            name: 'name',
            dbName: 'buyerName',
            label: '归属人',
            type: 'string',
            required: true,
        },
        {
            name: 'trainNumber',
            dbName: 'trainAndFlight',
            label: '车次',
            type: 'string',
        },
        {
            name: 'startingTime',
            dbName: 'boardingTime',
            label: '乘车时间',
            type: 'time',
        },
        {
            name: 'startingStation',
            dbName: 'entrance',
            label: '始发地',
            type: 'string',
        },
        {
            name: 'destinationStation',
            dbName: 'destination',
            label: '目的地',
            type: 'string',
        },
        {
            name: 'seatCategory',
            dbName: 'seatType',
            label: '座位类型',
            type: 'string',
        },
    ],
    // 通行费发票
    [invoiceType[2]]: [
        {
            name: 'invoiceCode',
            dbName: 'invoiceCode',
            label: '发票代码',
            type: 'string',
            required: true,
        },
        {
            name: 'invoiceNumber',
            dbName: 'invoiceNo',
            label: '发票号码',
            type: 'string',
            required: true,
        },
        {
            name: 'tollDate',
            dbName: 'invoiceDate',
            label: '开票日期',
            type: 'date',
            required: true,
        },
        {
            name: 'amount',
            dbName: 'totalAmount',
            label: '价税合计',
            type: 'digit',
            required: true,
        },
        {
            name: 'tollExit',
            dbName: 'tollExit',
            label: '出口',
            type: 'string',
        },
        {
            name: 'tollEntrance',
            dbName: 'tollEntrance',
            label: '入口',
            type: 'string',
        },
        {
            name: 'tollTime',
            dbName: 'tollTime',
            label: '时间',
            type: 'time',
        },
    ],
    // 出租车发票
    [invoiceType[3]]: [
        {
            name: 'invoiceCode',
            dbName: 'invoiceCode',
            label: '发票代码',
            type: 'string',
            required: true,
        },
        {
            name: 'number',
            dbName: 'invoiceNo',
            label: '发票号码',
            type: 'string',
            required: true,
        },
        {
            name: 'date',
            dbName: 'invoiceDate',
            label: '开票日期',
            type: 'date',
            required: true,
        },
        {
            name: 'totalFare',
            dbName: 'totalAmount',
            label: '价税合计',
            type: 'digit',
            required: true,
        },
        {
            name: 'province',
            dbName: 'province',
            type: 'string',
            label: '省份(章子上)',
        },
        {
            name: 'city',
            dbName: 'city',
            type: 'string',
            label: '城市',
        },
        {
            name: 'boardingTime',
            dbName: 'boardingTime',
            type: 'time',
            label: '上车时间',
        },
        {
            name: 'alightingTime',
            dbName: 'alightingTime',
            label: '下车时间',
            type: 'time',
        },
        // {
        //     name: '',
        //     dbName: '',
        //     label: '乘车日期',
        // },
        {
            name: 'mileage',
            dbName: 'mileage',
            label: '里程',
            type: 'string',
        },
    ],
    //'航空客运机票行程单'
    [invoiceType[4]]: [
        {
            name: 'serialNumber',
            dbName: 'invoiceCode',
            label: '发票代码',
            type: 'string',
            required: true,
        },
        {
            name: 'ticketNumber',
            dbName: 'invoiceNo',
            label: '发票号码',
            type: 'string',
            required: true,
        },
        {
            name: 'issueDate',
            dbName: 'invoiceDate',
            length: 12,
            label: '开票日期',
            type: 'date',
            required: true,
        },
        {
            name: 'taxRate',
            dbName: 'taxRate',
            label: '税率',
            type: 'string',
        },
        {
            name: 'taxAmount',
            dbName: 'taxAmount',
            label: '税额合计(税额)',
            type: 'digit',
            disabled:true,
            hidden:true
        },
        {
            name: 'invoiceAmount',
            dbName: 'invoiceAmount',
            label: '不含税金额',
            type: 'digit',
            disabled:true,
            hidden:true
        },
        {
            name: 'passengerName',
            dbName: 'buyerName',
            label: '姓名',
            type: 'string',
            required: true,
        },
        {
            name: 'idNumber',
            dbName: 'identity',
            label: '身份证号',
            type: 'string',
        },
        {
            name: 'total',
            dbName: 'total',
            label: '总金额',
            type: 'digit',
            required: true,
        },

        {
            name: 'totalAmount',
            dbName: 'totalAmount',
            label: '价税合计',
            type: 'digit',
            // required: true,
            disabled:true,
            hidden:true
        },

        {
            name: 'nonDeductible',
            dbName: 'nonDeductible',
            label: '不可抵扣',
            type: 'digit',
            hidden:true
        },
        {
            name: 'flightStr',
            dbName: 'trainAndFlight',
            label: '航班信息',
            type: 'string',
        },
        {
            name: 'issueBy',
            dbName: 'salerName',
            label: '开票单位',
            type: 'string',
        },
        {
            name: 'fare',
            dbName: 'fare',
            label: '票价',
            type: 'string',
            required: true,
        },
        {
            name: 'fuelSurcharge',
            dbName: 'fuelSurcharge',
            label: '燃油附加费',
            required: true,
            type: 'digit',
        },
        {
            name: 'devFund',
            dbName: 'aviationDevelopmentFund',
            label: '民航发展基金',
            required: true,
            type: 'digit',
        },
        {
            name: 'otherTaxes',
            dbName: 'otherTaxes',
            label: '其他税费',
            type: 'digit',
            required: true,
        },
        {
            name: 'insurance',
            dbName: 'insurance',
            label: '保险费',
            type: 'digit',
        },
        {
            name: 'SalesCode',
            dbName: 'salerTaxNo',
            label: '销售单位代号',
            type: 'string',
        },
        
    ],
    // '客运发票'
    [invoiceType[5]]: [
        {
            name: 'invoiceCode',
            dbName: 'invoiceCode',
            label: '发票代码',
            type: 'string',
            required: true,
        },
        {
            name: 'invoiceNumber',
            dbName: 'invoiceNo',
            label: '发票号码',
            type: 'string',
            required: true,
        },
        {
            name: 'ticketDate',
            dbName: 'invoiceDate',
            label: '开票日期',
            type: 'date',
            required: true,
        },
        {
            name: 'taxRate',
            dbName: 'taxRate',
            type: 'string',
            label: '税率',
        },
        {
            name: 'taxAmount',
            dbName: 'taxAmount',
            label: '税额合计',
            type: 'digit',
            // required: true,
        },
        {
            name: 'invoiceAmount',
            dbName: 'invoiceAmount',
            label: '不含税金额',
            type: 'digit',
            // required: true,
        },
        {
            name: 'totalAmount',
            dbName: 'totalAmount',
            label: '价税合计',
            type: 'digit',
            required: true,
        },
        {
            name: 'startingStation',
            dbName: 'entrance',
            label: '始发地',
            type: 'string',
        },
        {
            name: 'destinationStation',
            dbName: 'destination',
            label: '目的地',
            type: 'string',
        },
        {
            name: 'ticketTime',
            dbName: 'boardingTime',
            label: '时间',
            type: 'time',
        },
    ],
    // '定额发票'
    [invoiceType[6]]: [
        {
            name: 'code',
            dbName: 'invoiceCode',
            label: '发票代码',
            type: 'string',
            required: true,
        },
        {
            name: 'number',
            dbName: 'invoiceNo',
            label: '发票号码',
            type: 'string',
            required: true,
        },
        {
            name: 'amount',
            dbName: 'totalAmount',
            label: '价税合计',
            type: 'digit',
            required: true,
        },
        {
            name: 'salerName',
            dbName: 'salerName',
            label: '销售方名称',
            type: 'string',
        },
        {
            name: 'taxRegistrationNumber',
            dbName: 'salerTaxNo',
            label: '销售方纳税登记号',
            type: 'string',
        },
        {
            name: 'province',
            dbName: 'province',
            label: '省份',
            type: 'string',
        },
        {
            name: 'invoiceStamp',
            dbName: 'isInvoiceSeal',
            label: '是否有发票章',
            type: 'string',
        },
    ],
    SPOT_TICKET: [],
    [invoiceType[8]]: [
        {
            name: 'number',
            dbName: 'invoiceNo',
            label: '发票号码',
            type: 'string',
            required: true,
        },{
            name: 'code',
            dbName: 'invoiceCode',
            label: '发票代码',
            type: 'string',
            required: true,
        },{
            name: 'issueDate',
            dbName: 'invoiceDate',
            label: '开票日期',
            type: 'string',
            required: true,
        },{
            name: 'checkCode',
            dbName: 'checkCode',
            label: '校验码',
            type: 'string',
        },{
            name: 'buyerName',
            dbName: 'buyerName',
            label: '购买方名称',
            type: 'string',
            required: true,
        },{
            name: 'buyerId',
            dbName: 'buyerTaxNo',
            label: '购方纳税人识别号',
            type: 'string',
        },{
            name: 'buyerAddress',
            dbName: 'buyerAddressPhone',
            label: '购方地址电话',
            type: 'string',
        },{
            name: 'buyerBank',
            dbName: 'buyerAccount',
            label: '购方银行账号',
            type: 'string',
        },{
            name: 'sellerName',
            dbName: 'salerName',
            label: '销方名称',
            type: 'string',
            required: true,
        },{
            name: 'sellerId',
            dbName: 'salerTaxNo',
            label: '销方纳税人识别号',
            type: 'string',
        },{
            name: 'sellerAddress',
            dbName: 'salerAddressPhone',
            label: '销方地址电话',
            type: 'string',
        },{
            name: 'sellerBank',
            dbName: 'salerAccount',
            label: '销方银行账号',
            type: 'string',
        },{
            name: 'subtotalAmount',
            dbName: 'invoiceAmount',
            label: '发票金额',
            type: 'digit',
            required: true,
        },{
            name: 'subtotalTax',
            dbName: 'taxAmount',
            label: '发票税额',
            type: 'digit',
            required: true,
        },{
            name: 'total',
            dbName: 'totalAmount',
            label: '价税合计',
            type: 'digit',
            required: true,
        },{
            name: 'receiver',
            dbName: 'payee',
            label: '收款人',
            type: 'string',
        },{
            name: 'reviewer',
            dbName: 'reviewer',
            label: '复核人',
            type: 'string',
        },{
            name: 'issuer',
            dbName: 'drawer',
            label: '开票人',
            type: 'string',
        },
    ],
    [invoiceType[9]]:[
        {
            name: 'number',
            dbName: 'invoiceNo',
            label: '发票号码',
            type: 'string',
            required: true,
        },{
            name: 'code',
            dbName: 'invoiceCode',
            label: '发票代码',
            type: 'string',
            required: true,
        },{
            name: 'issueDate',
            dbName: 'invoiceDate',
            label: '开票日期',
            type: 'string',
            required: true,
        },{
            name: 'checkCode',
            dbName: 'checkCode',
            label: '校验码',
            type: 'string',
        },{
            name: 'buyerName',
            dbName: 'buyerName',
            label: '购买方名称',
            type: 'string',
        },{
            name: 'buyerId',
            dbName: 'buyerTaxNo',
            label: '购方纳税人识别号',
            type: 'string',
        },{
            name: 'buyerAddress',
            dbName: 'buyerAddressPhone',
            label: '购方地址电话',
            type: 'string',
        },{
            name: 'buyerBank',
            dbName: 'buyerAccount',
            label: '购方银行账号',
            type: 'string',
        },{
            name: 'sellerName',
            dbName: 'salerName',
            label: '销方名称',
            type: 'string',
        },{
            name: 'sellerId',
            dbName: 'salerTaxNo',
            label: '销方纳税人识别号',
            type: 'string',
        },{
            name: 'sellerAddress',
            dbName: 'salerAddressPhone',
            label: '销方地址电话',
            type: 'string',
        },{
            name: 'sellerBank',
            dbName: 'salerAccount',
            label: '销方银行账号',
            type: 'string',
        },{
            name: 'subtotalAmount',
            dbName: 'invoiceAmount',
            label: '发票金额',
            type: 'digit',
            required: true,
        },{
            name: 'subtotalTax',
            dbName: 'taxAmount',
            label: '发票税额',
            type: 'digit',
            required: true,
        },{
            name: 'total',
            dbName: 'totalAmount',
            label: '价税合计',
            type: 'digit',
            required: true,
        },{
            name: 'receiver',
            dbName: 'payee',
            label: '收款人',
            type: 'string',
        },{
            name: 'reviewer',
            dbName: 'reviewer',
            label: '复核人',
            type: 'string',
        },{
            name: 'issuer',
            dbName: 'drawer',
            label: '开票人',
            type: 'string',
        }, 
    ]
}
export const FormatData={
    [invoiceType[0]](item){
        // 增值税
        item.ticketCollectorDate=item.resultInfo.issueDate;
        item.invoiceAmount=item.resultInfo.total;
        item.invoiceCode=item.resultInfo.code;
        item.invoiceNo=item.resultInfo.number;
        item.checkCode=item.resultInfo.checkCode;
        item.invoiceType=item.resultInfo.type;
        item.invoiceTypeMeaning=item.resultInfo.type;
        item.invoiceNumber=item.resultInfo.number;
        item.currency='人民币';
        item.invoiceDate=item.resultInfo.issueDate;
        item.totalAmount=item.resultInfo.total;
        item.invoiceAmount=item.resultInfo.subtotalAmount;
        item.buyerName= item.resultInfo.buyerName;
        item.salerName= item.resultInfo.sellerName;
        item.buyerTaxNo= item.resultInfo.buyerId;
        item.salerAddressPhone= item.resultInfo.sellerAddress;
        item.salerAccount= item.resultInfo.sellerBank;
        item.resultInfo.itemList&&item.resultInfo.itemList.forEach(item=>{
            item.specificationModel=item.specification;
            item.unit=item.unit;
            item.num=item.quantity;
            item.unitPrice=item.unitPrice;
            item.detailAmount=item.amount;
            item.taxRate=item.taxRate;
        })
        item.invoiceLinesInfoList=item.resultInfo.itemList||[];
    },
    [invoiceType[1]](outItem){
        // 火车票
        // 处理没有或者需要额外处理的数据
        const tempTime=outItem.startingTime.split('日');
        outItem.invoiceTypeMeaning='火车票';
        if(!outItem.invoiceDate){
            outItem.invoiceDate=tempTime[0].replace(/月|年/g,'-');
        }
    },
    [invoiceType[2]](outItem){
        // 处理没有或者需要额外处理的数据
        outItem.invoiceTypeMeaning='通行费发票';
    },
    [invoiceType[3]](outItem){
        // 处理没有或者需要额外处理的数据
        outItem.invoiceTypeMeaning='出租车发票';
        const time=outItem.time.split('-');
        outItem.boardingTime=time[0];
        outItem.alightingTime=time[1];
        outItem.fare=outItem.totalFare;
    },
    [invoiceType[4]](outItem){
        outItem.invoiceTypeMeaning='航空客运机票行程单';
        const tempInfo=outItem.itineraryList[0];
        outItem.flightStr=`${tempInfo.departureStation}-${tempInfo.destinationStation}-${tempInfo.flight}-${tempInfo.flightDate} ${tempInfo.flightTime}`
    },
    [invoiceType[5]](outItem){
        outItem.invoiceTypeMeaning='客运发票';
    },
    [invoiceType[6]](outItem){
        outItem.invoiceTypeMeaning='定额发票';
    },
    [invoiceType[8]](outItem){
        outItem.invoiceTypeMeaning='区块链发票';
    },
    [invoiceType[9]](outItem){
        outItem.invoiceTypeMeaning='通用机打发票';
    },
}