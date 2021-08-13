import {ApiGetInvImageCompulsory} from '@/api/index';
export default {
    
    created () {
        const tempCurrentCompany=getApp().globalData.currentCompanyInfo;
        if(getApp().globalData.uploadRecord===''){
            // 为空时从接口获取是否强制上传档案
            wx.showLoading({title:'加载中...'})
            ApiGetInvImageCompulsory()
            .then(res=>{
                const tag=res.some(item=>
                    item.value===`${tempCurrentCompany.tenantId}-${tempCurrentCompany.companyCode}`);
                //全局存储 下次不需要再次调接口查询 
                getApp().globalData.uploadRecord=tag;
                wx.hideLoading();
            })
        }
    }
}