<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	// import { ApiGetAlipayInvoicePackage } from '@/api'
	import { post } from './api/url';
	const ApiGetAlipayInvoicePackage= data =>post(`/hcan/v1/0/alipay/query_invoice_package?encryptedUid=${encodeURIComponent(data.encryptedUid)}&packageId=${data.packageId}`)
	const INVOICEKIND={
		PLAIN:'增值税电子普通发票',
		SPECIAL:'增值税专用发票',
		PLAIN_INVOICE:'增值税普通发票',
		SALSE_INVOICE:'机动车销售统一发票',
		PAPER_INVOICE:'增值税普通发票(卷式)'
	}

	const forMatting=invoiceInfo=>{
		let tempArr=invoiceInfo.alipay_ebpp_invoice_einvpackage_query_response.package_item_info_list;
		console.log('////obj.file_download_url',invoiceInfo.alipay_ebpp_invoice_einvpackage_query_response.package_item_info_list);
		return tempArr.map(obj => {
			return {
				invoiceDate: obj.invoice_output_info.invoice_date,
				invoiceTypeMeaning: INVOICEKIND[obj.invoice_output_info.invoice_kind],
				buyerName: obj.invoice_output_info.invoice_title.title_name,
				salerName: obj.invoice_output_info.payee,
				invoiceCode: obj.invoice_output_info.invoice_code,
				invoiceNumber: obj.invoice_output_info.invoice_no,
				invoiceNo: obj.invoice_output_info.invoice_no,
				checkCode: obj.invoice_output_info.check_code,
				invoiceAmount: obj.invoice_output_info.ex_tax_amount,
				totalAmount: obj.invoice_output_info.sum_amount,
				imageUrl: obj.invoice_output_info.invoice_img_url.replace('http','https'),
				fileUrl:obj.file_download_url.replace('http','https'),
				currency:'CNY',
				buyerTaxNo:obj.invoice_output_info.invoice_title.payer_register_no,
				buyerAddressPhone: obj.invoice_output_info.invoice_title.payer_address_tel,
				buyerAccount: obj.invoice_output_info.invoice_title.payer_bank_name_account,
			}
		});
	}
	export default {
		globalData: {
			currentCompanyInfo: {},//当前登录用户所在企业下的详细信息
			currentInvoiceInfo:{},//页面跳转时UI展示经过格式化后的信息 ===>格式方法在/utils/formatInvObj.js文件中
			currentInvoiceAllInfo:{},//页面逻辑跳转时发票的所有信息
			uploadRecord:'',//是否强制上传档案
			tipInvoiceUser:'', //是否提示发票持有人信息,
			loginInfo:{},//登录成功返回的信息
		},
		onLaunch(options) {
			console.log('App Launch',options);
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			console.log(res.hasUpdate);
			});

			updateManager.onUpdateReady(function (res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，请重启应用？',
					showCancel:false,
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function (res) {
			// 新的版本下载失败
			});
		},
		async onShow(options) {
			console.log('App Show',options);
			if(options.path&&options.path==='pages/import-invoice/index'){

				uni.showLoading();
				const getInfores=await ApiGetAlipayInvoicePackage(options.query);
				const tempRes=JSON.parse(getInfores.body);
				console.log('///tempRes',tempRes);
				const backRes = forMatting(tempRes);
				
                getApp().globalData.currentInvoiceAllInfo=backRes;
				uni.hideLoading();

				uni.navigateTo({
					url: '/pages/import-invoice-list/index',
				});
			}
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style>
	/* 头条小程序需要把 iconfont 样式放到组件外 */
	@import "components/m-icon/m-icon.css";

	/*每个页面公共css */
	uni-page-body{
		height: 100%;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}
	.C-flex{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	/* #ifdef H5 */
	uni-page-head {
		display: none;
	}
	/* #endif */
</style>
