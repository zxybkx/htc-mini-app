import {BASE_URL} from '../api/config';
// 请求token鉴权
let token;
// 普通请求
const common=({url,params})=>{
  if(!url.startsWith('http')){
    url=`${BASE_URL}${url}`
  }
  // url=`${BASE_URL}${url}`
  
  return new Promise(function(resolve, reject) {
    try {
      token = uni.getStorageSync('token');
    } catch (e) {console.log(e);}
    if(params.method==='file'){
      uni.uploadFile({
        url,
        fileType:'image',
        hideLoading:true,
        filePath:params.filePath,
        name:params.name,
        // ...params,
        header: Object.assign(params.headers, { Authorization:token }),
        success (res) {
          resolve(res);
        },
        fail(err){
          console.log('err///',err)
          reject(err)
        }
      })
    } else {
      uni.request({
        url,
        ...params,
        header: Object.assign(params.headers, { Authorization:token }),
        success (res) {
          // console.log('success',res);
          resolve(res);
        },
        fail(err){
          console.log('err',err)
          reject(err)
        }
      })
    }
  })
}
// 请求封装
const uniRequest=async ({url,params})=>{
  try {
    const res= await common({url,params});
    // console.log('根请求res',res);
    //错误抛出
    res.data.error&&uni.showModal({
      title: '错误',
      content: res.data.message,
      showCancel: false,
    });
    if(res.data.error==='unauthorized'&&res.data.code==='hoth.warn.passwordError'){
      console.log(getCurrentPages()[0].$page.fullPath)
      uni.showModal({
        title: '错误',
        content: res.data.message,
        showCancel: false,
      }).then(res=>{
        if(getCurrentPages()[0].$page.fullPath==='/pages/login/index'){
          // wx.reLaunch({url:'/pages/login'});
        }else{
          uni.reLaunch({url:'/pages/login/index'});
        }
      });
      uni.hideLoading()
      return;
    }
    // if(res.data.failed){
    //   uni.showModal({
    //     title: '错误',
    //     content: res.data.message,
    //     showCancel: false,
    //   });
    // }
    if (res.data.error==='unauthorized'||res.statusCode===401||res.data.status==='1609') {
    // if (res.data.error==='unauthorized') {
      // uni.showToast({title: '登录状态过期',icon: 'none',duration: 2000})
      uni.showModal({
        title: '提示',
        content: '登录状态过期',
        showCancel: false,
      });
      // 未授权清缓存
      uni.clearStorage(); 
      // token过期进入登录过度页
      uni.reLaunch({url:'/pages/excessive/index'});
    }
    if(res.data.access_token) {
      token=`${res.data.token_type} ${res.data.access_token}`;
      try {
        uni.setStorageSync('token',token);
      } catch (e) { console.log(e);}
    }
    return res.data;
  } catch (error) {
    uni.showModal({
      title: '错误',
      content: error.data.message||error.errMsg,
      showCancel: false,
    });
  }
}


export default uniRequest;