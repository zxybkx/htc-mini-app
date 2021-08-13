import JSEncrypt from './jsencrypt'

const publicKey =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJL0JkqsUoK6kt3JyogsgqNp9VDGDp+t3ZAGMbVoMPdHNT2nfiIVh9ZMNHF7g2XiAa8O8AQWyh2PjMR0NiUSVQMCAwEAAQ=='

function encryptPwd(password) {
  var encrypt = new JSEncrypt() // 设置公钥
  encrypt.setPublicKey(publicKey) // 加密
  return encrypt.encrypt(password)
}

module.exports = encryptPwd
