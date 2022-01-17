let BASE_URL;
console.log('OS_ENV',OS_ENV);
switch (OS_ENV) {
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
export {BASE_URL};
// export const BASE_URL = 'https://htccloud.hand-china.com';



