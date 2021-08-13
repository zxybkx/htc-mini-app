export const formatCheckObj = function (inv) {
  return {
    identify: 'qr',
    invoiceType: getType(inv['invoiceType']),
    invoiceTypeMeaning: getType(inv['invoiceType']),
    currency: "CNY",
    invoiceCode: inv['invoiceCode'],
    invoiceNumber: inv['invoiceNo'],
    invoiceNo: inv['invoiceNo'],
    checkCode:inv['checkCode'],
    invoiceDate: inv['invoiceDate'],
    totalAmount: inv['totalAmount'],
    invoiceAmount: inv['invoiceAmount'],
    invoiceHeaderId: inv['invoiceHeaderId'],
    buyerName: inv['buyerName'],
    salerName: inv['salerName'],
    buyerTaxNo: inv['buyerTaxNo']||inv['sellerId'],
    salerAddressPhone: inv['salerAddressPhone'],
    salerAccount: inv['salerAccount'],
    invoiceLinesInfoList:inv.invoiceLinesInfoList
  }
}

export const formatExistInvObj = function (inv) {
  return {
    identify: 'exist',
    invoiceType: inv['invoiceTypeMeaning'],
    invoiceTypeMeaning: inv['invoiceTypeMeaning'],
    currency: "CNY",
    invoiceCode: inv['invoiceCode'],
    invoiceNumber: inv['invoiceNo'],
    invoiceNo: inv['invoiceNo'],
    invoiceDate: inv['invoiceDate'],
    totalAmount: inv['totalAmount'],
    invoiceAmount: inv['invoiceAmount'],
    invoiceHeaderId: inv['invoiceHeaderId'],
    invoicePoolHeaderId: inv['invoicePoolHeaderId'],
    buyerName: inv['buyerName'],
    salerName: inv['salerName'],
    buyerTaxNo: inv['buyerTaxNo'],
    salerAddressPhone: inv['salerAddressPhone'],
    salerAccount: inv['salerAccount'],
  }
}

export const formatOcrInv = function (inv) {
  return {
    identify: 'ocr',
    invoiceType: getOcrType(inv['type']),
    currency: "CNY",
    checkCode: inv['checkCode'],
    invoiceCode: inv['code'],
    invoiceNumber: inv['number'],
    invoiceDate: inv['issueDate'],
    imageUrl: inv['imageUrl'],
    totalAmount: inv['total'],
    invoiceAmount: inv['subtotalAmount'],
    buyerName: inv['buyerName'],
    salerName: inv['sellerName'],
    buyerTaxNo: inv['buyerId'],
    salerAddressPhone: inv['sellerAddress'],
    salerAccount: inv['sellerBank'],
  }
}

export const formatOfdInv = (inv) => {
  return {
    identify: 'ofd',
    invoiceType: getType(inv['invoiceType']),
    currency: "CNY",
    checkCode: inv['checkCode'].replace(/\s*/g,""),
    invoiceCode: inv['invoiceCode'],
    invoiceNumber: inv['invoiceNumber'],
    invoiceDate: inv['issueDate'].replace(/年|月/g,'-').replace('日',''),
    totalAmount: inv['total'].replace(/¥/g, ''),
    invoiceAmount: inv['subtotalAmount'].replace(/¥/g, ''),
    salerName: inv['sellerName'],
    buyerName: inv['buyerName'],
    buyerTaxNo: inv['buyerTaxpayerIdentificationNumber'],
    salerAddressPhone: inv['sellerAddress'],
    salerAccount: inv['sellerBank'],
  }
}

export const getType=num=> {
  let type = ''
  switch (num) {
    case '01':
      type = '增值税专用发票'
      break
    case '02':
      type = '货运运输业增值税专用发票'
      break
    case '03':
      type = '机动车销售统一发票'
      break
    case '04':
      type = '增值税普通发票'
      break
    case '08':
      type = '增值税电子专用发票'
      break
    case '10':
      type = '增值税普通发票(电子)'
      break
    case '11':
      type = '增值税普通发票(卷式)'
      break
    case '14':
      type = '通行费发票'
      break
    case '15':
      type = '二手车发票'
      break
    default:
      type = '未识别类型'
  }
  return type
}

function getOcrType(str) {
  let type = ''
  switch (str) {
    case 'special':
      type = '增值税专用发票'
      break
    case 'normal':
      type = '增值税普通发票'
      break
    case 'electronic':
      type = '增值税普通发票(电子)'
      break
  }
  return type
}