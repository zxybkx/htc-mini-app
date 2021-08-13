import {ApiGetEmployeeClearTips} from '@/api/index';
export default {
    created () {
        const tempCurrentCompany=getApp().globalData.currentCompanyInfo;
        if(getApp().globalData.tipInvoiceUser===''){
            // 为空时从接口获取是否提示发票持有人信息
            wx.showLoading({title:'加载中...'})
            ApiGetEmployeeClearTips()
            .then(res=>{
                const tag=res.some(item=>
                item.value===`${tempCurrentCompany.tenantId}-${tempCurrentCompany.companyCode}`);
                getApp().globalData.tipInvoiceUser=tag;
                wx.hideLoading();
            })
        }
    }
}