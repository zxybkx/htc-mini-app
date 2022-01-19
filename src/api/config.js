import {ENVPARAM} from '../utils/constant'
let BASE_URL;
console.log('OS_ENV',ENVPARAM);
switch (ENVPARAM) {
    case 'uat':
        BASE_URL = 'https://htaxuat.htc.hand-china.com'
        break
    case 'demo':
        BASE_URL = 'https://htaxdemo.htc.hand-china.com'
        break
    case 'prod':
        BASE_URL = 'https://htccloud.hand-china.com'
        break
    default:
        BASE_URL = 'https://htaxuat.htc.hand-china.com'
        break
}
let REDIRECT_URL;
switch (ENVPARAM) {
    case 'uat':
        REDIRECT_URL = 'http://htcuatcollector.htc.hand-china.com/'
        break;
    case 'demo':
        REDIRECT_URL = 'http://htcdemocollector.htc.hand-china.com/'
        break;
    case 'prod':
        REDIRECT_URL = 'https://htccloudcollector.hand-china.com/'
        break;
    default:
        REDIRECT_URL = 'http://htcuatcollector.htc.hand-china.com/'
        break
}
export {BASE_URL,REDIRECT_URL};
// export const BASE_URL = 'https://htccloud.hand-china.com';



