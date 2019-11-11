<template>
  <div class="modal-wrap">
    <!-- 免费投注中大奖弹窗-->
    <div :class="showModal&&modalType=='desc'?'modal show':'modal'">
      <div class="modal-cnt">
        <div class="h1">{{modalTitle}}</div>
        <div class="msg">{{modalDesc}}</div>
        <div class="msg">{{modalDesc2}}</div>
        <div class="modal-ft" @click="ok">
          <img :src="btnModalOk" alt="">
        </div>
        <div class="bot">{{modalBotDesc}}</div>
      </div>
    </div>

  </div>
</template>

<script>
import btnModalOk from '@/assets/images/lottery/btn_modal.png'
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
    modalTitle: {
      type: String,
      default: ''
    },
    modalDesc: {
      type: String,
      default: ''
    },
    modalDesc2: {
      type: String,
      default: ''
    },
    modalBotDesc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnModalOk: btnModalOk
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

    .modal-cnt{
      width:900px;
      padding: 110px 63px;
      position: relative;
      z-index: 1;
      background:rgba(255,255,255,1);
      border-radius:30px;
      box-sizing: border-box;

      .h1{
        padding-bottom: 55px;
        text-align: center;
        font-size:72px;
        font-weight:bold;
        color:rgba(54,54,54,1);
        line-height:72px;
      }

      .msg{
        padding-top: 40px;
        font-size:40px;
        font-weight:400;
        color:rgba(54,54,54,1);
        line-height:1.5;
      }

      .modal-ft{
        width: 740px;
        margin: 0 auto;
        padding-top: 110px;

        img{
          display: block;
          width: 100%;
        }
      }
      .bot{
        padding-top: 21px;
        text-align: center;
        font-size:36px;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:36px;
      }
    }

  }

</style>
