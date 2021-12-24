import {BrowserEnv} from './browserEnv';
const browserEnv=BrowserEnv();
// 拍发票各种发票的类型的判定字段

export const invoiceType=[
    'VAT_INVOICE',//  增值税
    'TRAIN_TICKET',//火车票
    'TOLL_INVOICE',// '过路费',
    'TAXI_INVOICE',// '出租车打车发票',
    'FLIGHT_ITINERARY',// '航空客运机票行程单',
    'BUS_TICKET',// '客运发票',
    'QUOTA_INVOICE',// '定额发票',
    'SPOT_TICKET',// '景区门票',
    'BLOCK_CHAIN',// '区块链发票',
]
// 发票来源配置字段

/**
 * 
 * ALIPAY_PROGRAM        支付宝小程序        
 * WECHAT_PROGRAM        微信小程序        
 * ENTERPRISE_WECHAT     企业微信        
 * NAILS                 钉钉    
 * H5                    H5移动网页
 */

console.log('编译平台',process.env.VUE_APP_PLATFORM);
// 根据编译条件判断那个平台
let SOURCE;
switch (process.env.VUE_APP_PLATFORM) {
    case 'mp-alipay':
        // 支付宝平台
        SOURCE='ALIPAY_PROGRAM';
        break;
    case 'H5':
        if(browserEnv===1){
            // 企业微信
            SOURCE='ENTERPRISE_WECHAT';
        }else{
            // 钉钉
            SOURCE='NAILS';
        }
        break;
    default:
        // 默认为企业微信
        SOURCE='ENTERPRISE_WECHAT';
        break;
}
export {SOURCE};
export const ISV_APP_CODE='huishuitong_mini';
// 可以使用环境变量替换
export const WXAPPID = 'wx379630708e7952b7'