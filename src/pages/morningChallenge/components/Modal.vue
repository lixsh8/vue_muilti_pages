<template>
  <div class="modal-wrap">
    <!-- 看广告失败 支付失败弹窗 -->
    <div :class="showModal&&modalType=='payFail'?'modal show':'modal'">
      <div class="modal-cnt">
        <img :src="Icon" alt="" class="icon">
        <div class="h1">{{modalTitle}}</div>
        <div class="msg">{{modalDesc}}</div>
        <div class="modal-ft" @click="ok">
          <img :src="BtnImg" alt="">
        </div>
      </div>
    </div>

    <!-- 打卡成功 -->
    <div :class="showModal&&modalType=='dkSuc'?'modal show':'modal'">
      <div class="modal-top"><img :src="iconClock" alt=""></div>
      <div class="modal-cnt modal-cnt-dk">
        <div class="h1">{{modalTitle}}</div>
        <div class="msg1">今日预计可瓜分金额: <span><em>{{modalAmount}}</em>元</span></div>
        <div class="msg2">9点打卡结束后，可在我的战绩页查看瓜分金额，<br/>10点前发放早起奖金</div>
        <div class="modal-ft" @click="ok">
          <img :src="btnModalOk" alt="">
        </div>
      </div>
    </div>

    <!-- 打卡失败 -->
    <div :class="showModal&&modalType=='dkFail'?'modal show':'modal'">
      <div class="modal-top"><img :src="iconClockGray" alt=""></div>
      <div class="modal-cnt modal-cnt-dk">
        <div class="h1">{{modalTitle}}</div>
        <div class="msg1">你的 <em>{{modalAmount}}</em>元 参与金额将被瓜分</div>
        <div class="msg2">
          早起的鸟儿有虫吃！<br/>
          已经超过最晚打卡时间了，明天加油！
        </div>
        <div class="modal-ft" @click="ok">
          <img :src="btnModalTom" alt="">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Icon from '@/assets/images/morningChallenge/icon_danger.png'
import BtnImg from '@/assets/images/morningChallenge/btn_sure.png'
import iconClock from '@/assets/images/morningChallenge/icon_clock.png'
import iconClockGray from '@/assets/images/morningChallenge/icon_clock_gray.png'
import btnModalOk from '@/assets/images/morningChallenge/btn_modal_ok.png'
import btnModalTom from '@/assets/images/morningChallenge/btn_modal_tom.png'
export default {
  name: 'Modal',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: ''
    },
    modalAmount: {
      type: String,
      default: '0'
    },
    modalTitle: {
      type: String,
      default: ''
    },
    modalDesc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Icon: Icon,
      iconClock: iconClock,
      iconClockGray: iconClockGray,
      btnModalOk: btnModalOk,
      btnModalTom: btnModalTom,
      BtnImg: BtnImg
    }
  },
  methods: {
    ok() {
      console.log(11111)
      this.$emit('okModal', {})
    }
  }
}
</script>

<style lang="less" scoped>
  .modal{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 96;
    visibility: hidden;
    opacity: 0;
    transition: opacity 1s, visibility 1s;

    &.show {
      opacity: 1;
      visibility: visible;
    }

    .modal-top{
      width: 239px;
      height: 239px;
      position: relative;
      z-index: 2;

      img{
        display: block;
        width: 100%;
      }
    }

    .modal-cnt{
      width:900px;
      position: relative;
      z-index: 1;
      margin-top: -120px;
      background:rgba(255,255,255,1);
      border-radius:30px;

      .icon{
        width: 200px;
        height: 200px;
        display: block;
        margin: 100px auto;
      }

      .h1{
        text-align: center;
        font-size:54px;
        font-weight:600;
        color:rgba(54,54,54,1);
        line-height:54px;
      }

      .msg{
        padding-top: 100px;
        text-align: center;
        font-size:45px;
        font-weight:400;
        color:rgba(54,54,54,1);
        line-height:45px;
      }

      .modal-ft{
        padding: 140px 0 69px;
        width: 740px;
        margin: 0 auto;

        img{
          display: block;
          width: 100%;
        }
      }
    }

    .modal-cnt-dk{
      .h1{
        padding-top: 220px;
        font-size:54px;
        font-weight:600;
        color:rgba(54,54,54,1);
        line-height:54px;
      }
      .msg1{
        padding-top: 100px;
        text-align: center;
        font-size:45px;
        font-weight:400;
        color:rgba(54,54,54,1);
        line-height:45px;

        span{
          color: #FF3636;
        }
        em{
          font-style: normal;
          font-family: DIN-Medium,dim_medium;
        }
      }

      .msg2{
        width: 780px;
        margin: 0 auto;
        padding-top: 30px;
        text-align: center;
        font-size:36px;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:54px;
      }

      .modal-ft{
        padding: 100px 0 69px;
        width: 740px;
        margin: 0 auto;

        img{
          display: block;
          width: 100%;
        }
      }
    }
  }

</style>
