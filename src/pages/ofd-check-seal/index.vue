<style lang="scss">
page{
    background:#F6F6F6;
    margin-bottom: 40rpx;
    padding:20rpx;
    box-sizing: border-box;
}
.split-wrapper{
    margin: 0 10rpx;
    height: 42rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;

    text{
      text-align: center;
      font-size: 12px;
      color: #9b9b9b;
    }

    view {
      width: calc((100% - 120px) / 2);
      height: 1px;
      &:first-of-type {
          background: #e8e8e8;
      }
      &:last-of-type {
          background: #e8e8e8;
      }
    }
    .bottomView{
        width: 100%;
        margin-bottom: 20px;
    }
  }
.ofdCheckSeal{
    padding: 16rpx;
    background: #fff;
    padding-bottom: 40rpx;
    border-radius: 4rpx;
    .imageBox{
        image{
            width: 100%;
            height: 388rpx;
        }
    }
    .result{
        height: 80rpx;
        justify-content: space-between;
        .taxName{
            font-size: 28rpx;
            font-weight: 500;
            color: #4D4D4D;
        }
        .tag{
            font-size: 24rpx;
            font-weight: 400;
            color: #4D4D4D;
            margin-left: 6rpx;
        }
    }
    .sealDesc{
        font-size: 28rpx;
        font-weight: 400;
        color: #2B2B2B;
    }
    .time{
        margin-top: 6rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #3A3A3A;
    }
    .section{
        .sectiontitle{
            font-size: 28rpx;
            font-weight: 400;
            color: #B7BBC0;
            margin-top: 60rpx;
            margin-bottom: 16rpx;
        }
        .sectionList{
            margin-top: 6rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: #3A3A3A;
            display: flex;
            align-items: stretch;

            .label{
                width:120rpx;
                flex-shrink: 0;
                text-align: justify;
                text-align-last: justify;
            }
        }
    }
}
</style>
<template>
    <div class="ofdCheckSeal">
        <div class="imageBox">
            <image :src="imgUrl" ></image>
        </div>
        <!-- <van-divider dashed="true" style="font-size:28rpx;" contentPosition="center">OFD验章详情</vanDivider> -->
        <!-- <van-divider dashed="true" /> -->
        <view class="split-wrapper">
            <view></view>
            <text>OFD 验章详情</text>
            <view></view>
        </view>
        <div class="C-flex result">
            <div class="taxName">{{signInfo.sealName}}</div>
            <div class="C-flex">
                <icon class="icon-small" type="success" size="12"></icon>
                <div class="tag">{{ signInfo.isValid ? '有效！' : '无效！' }}</div>
            </div>
        </div>
        <!-- <van-divider dashed="true" /> -->
        <view class="split-wrapper">
            <view class="bottomView"></view>
        </view>
        <div class="sealDesc">自应用本签章一来，文档内容未被修改。</div>
        <div class="time">签章时间：{{signInfo.signatureDate}}</div>
        <div class="section">
            <div class="sectiontitle">签章印章相关信息</div>
            <div class="sectionList">
                <div class="label">厂商</div>
                <div class="labelValue">：{{signInfo.company}}</div>
            </div>
            <div class="sectionList">
                <div class="label">起始时间</div>
                <div class="labelValue">：{{signInfo.startTime}}</div>
            </div>
            <div class="sectionList">
                <div class="label">结束时间</div>
                <div class="labelValue">：{{signInfo.endTime}}</div>
            </div>
            <div class="sectionList">
                <div class="label">颁布者</div>
                <div class="labelValue">：{{signInfo.issuer}}</div>
            </div>
            <div class="sectionList">
                <div class="label">授权给</div>
                <div class="labelValue">：{{signInfo.authorizedTo}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { ApiOfdToJpg, ApiCheckSign } from '../../api/index'
export default{
    data(){
        return{
            imgUrl:'',
            signInfo:{}
        }
    },
    async onLoad(){
        try {
            uni.showLoading();
            ApiCheckSign(getApp().globalData.currentInvoiceAllInfo.tempFilePath)
            .then(res=>{
                const tempCheckSignRes=JSON.parse(res);
                if (tempCheckSignRes.status!=='1000') {
                    uni.showModal({
                        title: '提示',
                        content: tempCheckSignRes.message,
                        showCancel: false,
                        confirmText: '确定'
                    })
                }else{
                    this.signInfo = tempCheckSignRes.data;
                }
            })
            const transformRes=await ApiOfdToJpg(getApp().globalData.currentInvoiceAllInfo.tempFilePath);
            this.imgUrl = 'data:image/jpg;base64,' +JSON.parse(transformRes).data;
            uni.hideLoading();
        } catch (error) {
            console.log(error);
            uni.hideLoading();
            uni.showModal({title: '错误',content: error.message||error.errMsg,showCancel: false})    
        }
    }
}
</script>