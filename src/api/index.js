import encryptPwd from '../utils/decrypt';
import { post,get,fileUpload,effPost,effGet } from './url';
import { SOURCE, ISV_APP_CODE } from '@/utils/constant'
// 获取app唯一实例
const appInstance = getApp();

const getCompanyInfo=()=>appInstance.globalData.currentCompanyInfo;

/**
 * 格式化校验码
 */
const formatCheckCode = code => {
    return code.length > 6 ? code.substr(code.length - 6, 6) : code
}

const formatData = date => {
    console.log();
    return date.replace(/-|\//g, '')
}
const getDate = () => {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    month = month > 9 ? month : '0' + month
    day = day > 9 ? day : '0' + day
  
    return `${year}-${month}-${day}`
}
/**
 * 
 * 微信小程序通过coed 获取相关信息
 */

export const ApiWechatLogin = code => get(`/hcan/v1/0/get-we-chat/wechat-login?code=${code}`);

/**
 * 
 * 支付宝小程序通过授权code获取相关信息userId和accesstoken
 */

export const ApiAlipayLogin = code => post(`/hcan/v1/0/alipay/ali_pay_login?authCode=${code}`);

/**
 * 
 * 获取ac
 */

export const ApiGetAccessToken = () => get('/hcan/v1/0/get-we-chat/wechat-get-token');
/**
 * 账户登录
 */
export const ApiLogin = data => {
    data['password'] = encryptPwd(data['password'])
    Object.assign(data, {
        grant_type: 'password',
        client_id: 'h5',
        client_secret: 'zzzh5'
    })
    return post('/oauth/oauth/token', data,{
        'Content-Type': 'application/x-www-form-urlencoded'
    })
};
/**
 * 
 * 退出登录或者解绑openId关系
 * 
 */
export const ApiDeleteUserReleations= id =>post(`/hmdm/v1/0/user-releations/delete-user-releation?releationId=${id}`)

/**
 * 
 *  后台返回用户名和密码登录
 * 
 */
export const ApiBackAutoLogin = data => {
    Object.assign(data, {
        grant_type: 'password',
        client_id: 'h5',
        client_secret: 'zzzh5'
    })
    return post('/oauth/oauth/token', data,{
        'Content-Type': 'application/x-www-form-urlencoded'
    })
};
/**
 * 
 * 关联用户的openId与密码和用户名等相关信息
 */
export const ApiReleationsSave=data=>post(`/hmdm/v1/0/user-releations/save`,{
    appId:data.openId,
    cropId:data.openId,
    loginName:data.loginName,
    releationType:'alipay',
    rsaPassword:data.pwd,
    tenantId:0
});
/**
 * 获取租户列表
 */
export const ApiGetTenants = () => get(`/iam/hzero/v1/users/self-tenants`);

/**
 * 获取公司列表
 */
export const ApiGetCompanys = () =>{
    return get(`/hmdm/v1/${getCompanyInfo().tenantId}/employee-infos/query-current-employee-info-app`, {
        tenantId: getCompanyInfo().tenantId,
        lovCode: 'HMDM.CURRENT_EMPLOYEE'
    });
}
/**
  * 获取公告
  */
export const ApiGetNotice = () =>
    get('/hmsg/v1/0/notices?containsDeletedDataFlag=0&page=0&receiverTypeCode=ANNOUNCE&size=1');

/**
  * 获取公告详情
  */
export const ApiGetNoticeDetail = id =>
    get(`/hmsg/v1/0/notices/user/${id}`);

/**
 * 查询是否强制上传档案
 */
export const ApiGetInvImageCompulsory = () => get(`/hpfm/v1/0/lovs/data`, {
    lovCode: 'HIVP.FORCE_COLLECTION_INVOICE_IMAGES'
})
  
/**
 * 查询是否提示已有发票持有人的详细信息
 */
export const ApiGetEmployeeClearTips = () => get(`/hpfm/v1/0/lovs/data`, {
    lovCode: 'HMDM.EMPLOYEE_INFORMATION_TIPS'
})
/**
 * 查询首页列表的展示
 */
 export const ApiListHide = () => get(`/hpfm/v1/0/lovs/data`, {
    lovCode: 'CHAN.WE_CHAT_HIDE_FEATURE'
})   
/**
 * 查询发票是否已经在发票池内
 */
export const ApiIsInvExist = data => get(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-main/invoice-pool-search`, {
    companyId:getCompanyInfo().companyId,
    invoiceCode: data.invoiceCode,
    invoiceNo: data.invoiceNo || data.invoiceNumber
})
  
/**
 * 查验发票真实性
 */
export const ApiCheckInv = data => post(`/hcan/v1/${getCompanyInfo().tenantId}/invoice-check/invoice-check-within?companyCode=${getCompanyInfo().companyCode}&employeeNumber=${getCompanyInfo().employeeNum}`, {
    invoiceCode: data.invoiceCode,
    invoiceNumber: data.invoiceNumber,
    invoiceDate: formatData(data.invoiceDate),
    invoiceAmount: data.invoiceAmount,
    checkNumber: (data.checkNumber || data.checkCode)&&formatCheckCode(data.checkNumber || data.checkCode)
})

/**
 * 添加发票到发票池
 */
export const ApiPushInv = id => get(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-main/add-pool-by-invoice-id`, {
    invoiceHeaderInfoId: id,
    entryPoolSource: SOURCE,
    organizationId:getCompanyInfo().tenantId,
    companyId:getCompanyInfo().companyId,
    companyCode:getCompanyInfo().companyCode,
    companyName:getCompanyInfo().companyName,
    employeeId:getCompanyInfo().employeeId,
    employeeNum:getCompanyInfo().employeeNum,
    taxpayerNumber:getCompanyInfo().taxpayerNumber,
})

/**
 * 将发票归于自己
 */
export const ApiSetInvOwner = data => {
    data.internationalTelCode = getCompanyInfo().internationalTelCode;
    data.employeeIdentify = getCompanyInfo().mobile;
    data.ticketCollectorDate = getDate();
    data.ticketCollector = getCompanyInfo().employeeId;
    data.ticketCollectorDesc = `${getCompanyInfo().companyCode}-${getCompanyInfo().employeeNum}-${getCompanyInfo().employeeName}-${getCompanyInfo().mobile}`;
    return post(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-header-infos/batch-save`, [data])
}

/**
 * 通过 url 上传档案
 * @sourceCode 
 *      1: WECHAT_CARD '微信卡包' 需要下载
 *      2：OCR_IDENTIFY 'ocr识别'
 *      3：LOCAL_SERVICE 本地文件
 */

 export const ApiUploadByUrl = data => post(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-wechat/update-archives-by-url-weChat`,
 {
   companyId: getCompanyInfo().companyId,
   companyCode: getCompanyInfo().companyCode,
   employeeNumber: getCompanyInfo().employeeNum,
   fileUrl: data.fileUrl,
   invoicePoolHeaderId: data.invoicePoolHeaderId,
   sourceCode:data.sourceCode||'OCR_IDENTIFY'
 })

/**
 * 
 * ofd档案上传
 */
 export const ApiOfdFileUpload = data => fileUpload(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-wechat/update-archives-and-check-weChat?companyId=${getCompanyInfo().companyId}&companyCode=${getCompanyInfo().companyCode}&employeeNo=${getCompanyInfo().employeeNum}&sourceCode=INVOICE_POOL&invoicePoolHeaderId=${data.invoicePoolHeaderId}&isCheck=${data.checkTag}`,
 {filePath:data.filePath, name: 'file'} )
/**
 * 
 * 上传文件临时路径并上传档案
 */

export const ApiFileUpload = data => fileUpload(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-wechat/upload-archives-and-check-weChat?companyCode=${getCompanyInfo().companyCode}&employeeNo=${getCompanyInfo().employeeNum}&invoicePoolHeaderId=${data.invoicePoolHeaderId}&isCheck=${data.checkTag}`,
    {filePath:data.filePath, name: 'file'} )

/**
 * 
 * 将上传档案获取的url转化为可以预览的url(不清楚这个操作的意义)
 */

export const ApigetSignedUrl = url=> 
    get('/hfle/v1/7/files/signedUrl',{
        
        bucketName: 'hivp',
        url,
    },{},{
        sslVerify: false,
        dataType:'text'
    })
/**
 * 小程序发票OCR识别
 * 
 */

export const ApiPhotoUpload= data => fileUpload(`/hcan/v1/${getCompanyInfo().tenantId}/invoice-ocr/invoice-resolver-wechat?companyCode=${getCompanyInfo().companyCode}&employeeNumber=${getCompanyInfo().employeeNum}`,
 {filePath:data.filePath, name: 'imageFile'})

//非增值税发票添加入票据池
export const ApiAddBillpool= data => post(`/hivp/v1/${getCompanyInfo().tenantId}/invoices/applets-add-my-billPool?companyCode=${getCompanyInfo().companyCode}&employeeNum=${getCompanyInfo().employeeNum}&sourceCode=${SOURCE}`,
    data)

// 获取各个发票税率
export const ApiGetTaxRate = data =>post(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-wechat/get-taxrate-by-wechat`,data)

// ofd文件识别前 文件Base64加密
export const ApiBase64 = data => fileUpload(`/hcan/v1/${getCompanyInfo().tenantId}/invoice-ocr/image-base-encode`,
    {filePath:data.filePath, name: 'imageFile'})

// ofd发票识别
export const ApiOfdResolver = data => post(`/hcan/v1/${getCompanyInfo().tenantId}/ofd-invoice-resolver/resolver-encrypted?companyCode=${getCompanyInfo().companyCode}&employeeNumber=${getCompanyInfo().employeeNum}&encryptCode=0`,
    data)
// ofd文件url转jpg
export const ApiOfdUrlToJpg = url => post(`/hcan/v1/${getCompanyInfo().tenantId}/ofd-invoice-resolver/url-to-jpg?companyCode=${getCompanyInfo().companyCode}&employeeNumber=${getCompanyInfo().employeeNum}&file=${url}&encryptCode=0`,{})

// ofd文件转图片

export const ApiOfdToJpg = url => fileUpload(`/hcan/v1/${getCompanyInfo().tenantId}/ofd-invoice-resolver/toJpg?companyCode=${getCompanyInfo().companyCode}&employeeNumber=${getCompanyInfo().employeeNum}&encryptCode=0`,
    {filePath:url, name: 'file'});

export const ApiCheckSign = url => fileUpload(`/hcan/v1/${getCompanyInfo().tenantId}/ofd-invoice-resolver/signature-info?companyCode=${getCompanyInfo().companyCode}&employeeNumber=${getCompanyInfo().employeeNum}&encryptCode=0`,
    {filePath:url, name: 'file'})   
// 从发票池里筛选发票

export const ApiSearchInv= data=>get(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-wechat/my-invoice-search-weChat`,{
    // ...getCompanyInfo(),
    page: data.page,
    size: data.size,
    // companyId:'',
    inOutType:'IN',
    companyId:getCompanyInfo().companyId,
    employeeNum:getCompanyInfo().employeeNum,
    employeeId:getCompanyInfo().employeeId,
    notSubmittedFlag: data.notSubmittedFlag,
    isSubmittedFlag: data.isSubmittedFlag,
    invoiceDateFrom: data.invoiceDateFrom,
    invoiceDateTo: data.invoiceDateTo,
    invoiceType: data.invoiceType,
})

//获取所有发票类型
export const ApiGetInvTypes = () =>get(`/hpfm/v1/${getCompanyInfo().tenantId}/lovs/data`,{
    lovCode: 'HIVP.INVIOCE_AND_BILL_TYPE'
})

//删除发票
export const ApiDelInv = data =>get(`/hivp/v1/${getCompanyInfo().tenantId}/invoice-pool-wechat/my-invoice-delete-weChat`,{
    invoicePoolHeaderId:data.invoicePoolHeaderId,
    sourceCode:data.sourceCode,
    employeeNum:getCompanyInfo().employeeNum,
    companyId:getCompanyInfo().companyId,
})

// 支付宝电子票

// export const ApiGetIsvToken= () =>post(`/hcan/v1/0/alipay/get_invoice_token?isvAppCode=${ISV_APP_CODE}`)
export const ApiGetIsvToken= () =>post(`/hcan/v1/0/alipay/get_invoice_token?isvAppCode=${ISV_APP_CODE}`);


//
export const ApiGetAlipayInvoicePackage= data =>post(`/hcan/v1/0/alipay/query_invoice_package?encryptedUid=${URLDecoder.decode(data.encryptedUid, "utf-8")}&packageId=${data.packageId}`)