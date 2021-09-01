<style lang="scss">
page{
    background-color: #F6F6F6;
    padding-bottom: 120rpx;
}
.myInvoiceList{
    padding: 0rpx 20rpx;
}
.switchBtn{
  display:flex;
  align-items: center;
  justify-content: center;
  padding: 0rpx 20rpx;
  height: 50rpx;
}
.delBtn{
    height: 100%;
    width: 60px;
    background-color: #FA5051;
}
.selectBox{
    position: relative;
    width: 100%;
    height: 72rpx;
    background: #FFFFFF;
    border-radius: 4rpx;
    font-size: 28rpx;
    color: #666;
    .title{
        justify-content: flex-start;
        font-weight: 400;
        color: #2B2B2B;
        height: 72rpx;
        .tlist{
            margin-left: 32rpx;
            .active{
                color: #0282F0;
            }
        }
    }
    .sc_content{
        position: absolute;
        background: #fff;
        width: 100%;
        padding: 0rpx 32rpx;
        box-sizing: border-box;
        z-index: 999;
        .cnt{
            .title{
                margin-top:30rpx;
            }
            .dateBox{
                height: 100rpx;
                align-items: stretch;
                .picker{
                    width: 300rpx;
                    padding-bottom: 20rpx;
                    text-align: center;
                    border-bottom: 2rpx solid #eee;
                }
            }
            .status{
                justify-content: flex-start;
                height: 120rpx;
                checkbox .uni-checkbox-input {
                    width: 34rpx;
                    height: 34rpx;
                    margin-right: 16rpx;
                }
            }
            .radioBox{
                max-height: 400rpx;
                overflow-y: auto;
                padding: 20rpx 0rpx;
                .radio{
                  justify-content: flex-start;
                }
            }    
            
        }
        .bottom{
            width: 100%;
            height: 60rpx;
            justify-content: space-around;
            margin-bottom: 20rpx;
            .btn{
                width: 260rpx;
                height: 100%;
                border-radius: 12rpx;
                border:2rpx solid #0282F0;
            }
            .resetBtn{
                background: #eee;
            }
            .confirmBtn{
                background: #0282F0;
                color: #fff;
            }
        }
    }
}
.loadMoreUi{
    font-size: 28rpx;
    color:#666;
    margin-top: 20rpx;
}
</style>
<template>
    <div class="myInvoiceList">
        <user-card :currentCompany="currentCompany" >
            <view @click="handleQuitLogin" class="switchBtn">退出登录</view>
        </user-card>
        <div class="selectBox">
            <div class="C-flex title">
                <div class="tlist" @click="handleSelect(0)">
                    <div class="C-flex active" v-if="currentIndex===0">
                        <div>发票日期</div>
                        <uni-icons type="arrowup" />
                    </div>
                    <div class="C-flex" v-else>
                        <div>发票日期</div>
                        <uni-icons type="arrowdown"/>
                    </div>
                </div>
                <div class="tlist" @click="handleSelect(1)">
                    <div class="C-flex active" v-if="currentIndex===1">
                        <div>发票状态</div>
                        <uni-icons type="arrowup" />
                    </div>
                    <div class="C-flex" v-else>
                        <div>发票状态</div>
                        <uni-icons type="arrowdown" />
                    </div>
                </div>
                <div class="tlist" @click="handleSelect(2)">
                    <div class="C-flex active" v-if="currentIndex===2">
                        <div>发票类型</div>
                        <uni-icons type="arrowup" />
                    </div>
                    <div class="C-flex" v-else>
                        <div>发票类型</div>
                        <uni-icons type="arrowdown" />
                    </div>
                </div>  
            </div>
            <div class="sc_content" v-if="mianTag">
                <div class="cnt" v-if="currentIndex===0">
                    <div class="title">开票日期</div>
                    <div class="C-flex dateBox">
                        <picker mode="date" :value="time" @change="handleStartTime">
                            <view class="picker">{{tempStartDate||startDate|| "选择开始日期"}}</view>
                        </picker>
                        <div>至</div>
                        <picker mode="date" :value="time" @change="handleEndTime">
                            <view class="picker">{{tempEndDate||endDate ||"选择结束日期"}}</view>
                        </picker>
                    </div>
                </div>
                <div class="cnt" v-else-if="currentIndex===1">
                    <checkbox-group @change="handleStatusSelect">
                        <div class="C-flex status">
                            <div class="C-flex" style="margin-right:20rpx;"><checkbox value="0" :checked="invoiceStatus[0]"/>未使用</div>
                            <div class="C-flex"><checkbox value="1" :checked="invoiceStatus[1]"/>已使用</div>
                        </div>
                    </checkbox-group>
                </div>
                <div class="cnt" v-else>
                    <div class="radioBox">
                        <radio-group @change="handleTypeSelect">
                            <label class="C-flex radio" v-for="(item,index) in invoiceTypeArray" :key="index">
                                <radio style="transform:scale(0.7)" :value="item.value" :checked="item.value===invoiceType||item.value===tempInvoiceType"/>
                                <div>{{item.meaning}}</div>
                            </label>
                        </radio-group>
                    </div>
                </div>
                <div class="C-flex bottom">
                    <div class="C-flex btn resetBtn" @click="handleReset">重置</div>
                    <div class="C-flex btn confirmBtn" @click="handleConfirm">确定</div>
                </div>
            </div>
        </div>
        <!-- 可滑动删除 -->
        <uni-swipe-action>
          <div style="margin-top:20rpx;" v-for="(item, index) in list" :key="index">
            <uni-swipe-action-item :right-options="options" @click="handleDelItem(index)">
              <div @click="handleDetail(index)" style="width:100%;">
                <invoice-card :info="item" :index="index" :uiTag=true>
                    <div slot="title">{{item.invoiceTypeMeaning}}</div>
                </invoice-card>
              </div>
            </uni-swipe-action-item>
          </div>
        </uni-swipe-action>
        <div class="C-flex loadMoreUi" v-if="!loadMore">到底了</div>
    </div>
</template>

<script>
import { ApiSearchInv,ApiGetInvTypes,ApiDeleteUserReleations,ApiDelInv,ApiIsInvExist } from '@/api/index';
// import {invoiceType} from '@/utils/formatInvObj'
import userCard from '@/common/userCard.vue';
import invoiceCard from '@/common/invoiceCard.vue';
const seachConfig={
    size:10,
}
export default {
  components: {
      userCard,
      invoiceCard
  },
  data(){
    return {
        currentCompany:{},
        invoiceInfoArray:[],
        invoiceTypeArray:[],
        currentPage:0,
        mianTag:false,
        currentIndex:-1,
        startDate:'',
        endDate:'',
        invoiceType:'',
        invoiceStatus:[true,false],
        tempInvoiceStatus:[false,false],
        tempInvoiceType:"",
        tempStartDate:'',
        tempEndDate:'',
        list:[],
        loadMore:true,//加载更多
        options:[{
            text: '删除',
            style: {
                backgroundColor: '#dd524d'
            }
        }]
    }
    
  },
  methods:{
      async handleDetail(index){
          getApp().globalData.currentInvoiceInfo=this.list[index];
          
          if(this.list[index].invoiceType){
              getApp().globalData.currentInvoiceInfo.ocrType=this.list[index].invoiceType;
          }
          if(this.list[index].sourceCode=== 'INVOICE_POOL'){
              // 增值税情况==>请求一下接口获取增值税的全部信息列表的信息不全
              const refreshInvoiceInfo=await ApiIsInvExist({
                  invoiceCode: this.list[index].invoiceCode,
                  invoiceNumber: this.list[index].invoiceNumber
              });
              getApp().globalData.currentInvoiceInfo=refreshInvoiceInfo.content[0];
              uni.navigateTo({
                  url:'/pages/view-record/index'
              })
          }else{
              // 非增值税情况
              uni.navigateTo({
                  url:'/pages/other-photo-invoice-detail/index'
              })
          }
      },
      handleSelect(index){
          if(this.currentIndex===index){
              this.mianTag=!this.mianTag;
              
          }else{
              this.mianTag=true;
          }
          this.currentIndex=index;
          // 当选择框关闭时重置所有选择缓存状态
          if(this.mianTag===false){
              this.currentIndex=-1;
              this.tempInvoiceType="";
              this.tempStartDate='';
              this.tempEndDate='';
          }
      },
      handleReset(){
          if(this.currentIndex===0){
              this.tempStartDate='';
              this.tempEndDate='';
              this.startDate='';
              this.endDate='';
          }else if(this.currentIndex===1){
              this.invoiceStatus=[false,false];
              this.tempInvoiceStatus=[false,false];
          }else{
              this.invoiceType='';
              this.tempInvoiceType="";
          }
          this.mianTag=false;
          this.currentIndex=-1;
          this.currentPage=0;
          this.loadMore=true;
          this.list=[];
          this.subLoadListMore();
      },
      handleConfirm(){
          if(this.currentIndex===0){
              this.startDate=this.tempStartDate;
              this.endDate=this.tempEndDate;
          }else if(this.currentIndex===1){
              this.invoiceStatus=this.tempInvoiceStatus;
          }else{
              this.invoiceType=this.tempInvoiceType;
          }
          this.mianTag=false;
          this.currentIndex=-1;
          this.currentPage=0;
          this.loadMore=true;
          this.list=[];
          this.subLoadListMore();
      },
      handleTypeSelect(e){
          this.tempInvoiceType=e.detail.value;
      },
      handleStartTime(e){
          this.tempStartDate=e.detail.value.replace(/\//g,'-');
      },
      handleEndTime(e){
          this.tempEndDate=e.detail.value.replace(/\//g,'-');
      },
      handleStatusSelect(e){
          const res=e.detail.value;
          this.tempInvoiceStatus=[
              res.some(item=>item==='0'),
              res.some(item=>item==='1')
          ]
      },
      handleQuitLogin(){
          ApiDeleteUserReleations(getApp().globalData.loginInfo.releationId)
          .then(res=>{
              uni.clearStorageSync();//清楚缓存
              uni.reLaunch({url:'/pages/login/index'});//关闭所有页面跳转登录页
          })
      },
      async subLoadListMore(){
          if(!this.loadMore)return;
          const listRes = await ApiSearchInv({
              page: this.currentPage,
              size: seachConfig.size,
              notSubmittedFlag: this.invoiceStatus[0]?1:0,
              isSubmittedFlag: this.invoiceStatus[1]?1:0,
              invoiceDateFrom: this.startDate,
              invoiceDateTo: this.endDate,
              invoiceType: this.invoiceType,
          })
          this.list=[...this.list,...(listRes.content.map(item=>{
              item.invoiceNumber=item.invoiceNo;
              return item;
          }))];
          if (listRes.content.length<seachConfig.size) {
              // 上拉到底
              this.loadMore=false;
          }else{
              // 加载更多
              this.loadMore=true;
              this.currentPage++;
          }
      },
      async handleDelItem(index){
          // 删除发票
          const tempInvoice=this.list[index];
          try {
              const [error,modalRes] = await uni.showModal({title: '提示',content: '确定删除发票吗'});
              if (error)throw error;
              if(modalRes.confirm){
                  const delRes = await ApiDelInv({
                      invoicePoolHeaderId:tempInvoice.poolHeaderId,
                      sourceCode:tempInvoice.sourceCode,
                  });
                  if(!delRes.failed){
                      this.list.splice(index,1);
                      this.list=this.list;
                      uni.showToast({title: '删除发票成功',icon: 'none',duration: 2000})
                  }else{
                      uni.showModal({title: '错误',content: delRes.message,showCancel: false})
                  }
              }
          } catch (error) {
              console.log('error',error);
              uni.showToast({title: '删除发票失败',icon: 'none',duration: 2000})
          }
      }
  },
  async onReachBottom(){
      uni.showLoading({title: '加载更多'})
      await this.subLoadListMore();
      uni.hideLoading();
  },
  async onLoad(){
      try {
          this.currentCompany=getApp().globalData.currentCompanyInfo;
          ApiGetInvTypes()
          .then(res=>{
              this.invoiceTypeArray=res;
          });
          uni.showLoading()
          await this.subLoadListMore();
          uni.hideLoading();
      } catch (error) {
          console.log(error);
      }
  }
}
</script>