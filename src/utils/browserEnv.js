/**
 * 通过浏览器头 判断当前运行环境
 * 1==>企业微信内置浏览器环境
 * 2==> 钉钉app内置浏览器环境
 */
export const BrowserEnv=()=>{
    let ua = navigator.userAgent;
    if(ua&&ua.includes('wxwork')){
        return 1
    }else if(ua&&ua.includes('DingTalk')){
        return 2
    }else{
        // 其他情况
        return 3
    }
}
