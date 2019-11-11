<template>
  <div class="container">
    <div class="top">
      <!-- 头部 -->
      <div class="header">
        <div
          class="l"
          @click="back"
        ></div>
        <!-- <div class="title">天天中彩</div> -->
        <!-- <div
          class="r"
          @click="jump('/lotteryRule.html')"
        >活动规则</div> -->
      </div>

      <!-- banner -->
      <div class="banner">
        <div class="total">
          <div class="h1">{{issueNum}}期选号</div>
          <div class="h2">开奖时间：{{date}}开奖</div>
          <div class="p" @click="jump('records')">中奖号码：{{desc}} ></div>
        </div>
      </div>
    </div>

    <!-- panel列表 -->
    <div class="main">
      <div class="list">
        <div
          :class="item==selectedNum?'item active':'item'"
          v-for="item in number"
          :key="item"
        >
          <div class="ball" @click="select(item)"><span>{{item}}</span></div>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btns">
      <div class="btn-com" @click="bet"><span>确定投注</span></div>
    </div>

    <!-- Modal弹窗 -->
    <Modal
      :showModal='showModal'
      :modalType='modalType'
      :modalTitle='modalTitle'
      :modalDesc='modalDesc'
      @okModal='okModal'
    ></Modal>
  </div>

</template>

<script>
import LoadMore from "@/components/Loadmore";
import NoneData from "@/components/NoneData";
import Modal from "./components/Modal";
import axios from "@/config/axiosSign";
import { Toast } from "@/utils/util";
export default {
  components: {
    LoadMore,
    Modal,
    NoneData
  },
  props: {},
  data() {
    return {
      token: "",
      selectedNum: '01',
      number: [],
      issueId: '',
      date: "",
      desc: ''
    };
  },
  computed: {},
  created() {
    this.token = window.GOD && window.GOD.getToken ? window.GOD.getToken() : "";
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 加载数据
    loadData() {
      axios
        .get(`/lottery/betNum?token=${this.token}`)
        .then(res => {
          this.number = res.number || [];
          this.issueId = res.issueId;
          this.issueNum = res.issueNum;
          this.date = res.date;
          this.desc = res.desc;
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
    },

    // 支付
    bet() {
      if (!this.selectedNum) {
        Toast("请选择要投注的号码", 3000);
        return;
      }
      this.$_loading.show({
        loadingType: "img-gif",
        contentBgColor: "rgba(243, 243, 245, 1)"
      });

      axios
        .post(
          `/lottery/storeNum`,
          {
            token: this.token,
            issueId: this.issueId,
            adLogId: sessionStorage.getItem('adLogId'),
            betNum: this.selectedNum
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            }
          }
        )
        .then(res => {
          // console.log(res);
          this.$_loading.hide();

          if (res.message) {
            Toast(res.message || "网络出错", 3000);
            return false;
          }
          // 成功
          Toast("选号成功，请等待开奖", 3000, () => {
            this.$router.push({ path: '/' })
          });
        })
        .catch(err => {
          console.log(err.response);
          this.$_loading.hide();
          Toast(err.response.data.message || "请勿频繁操作", 3000);
        });
    },

    // 选择号码
    select(item) {
      this.selectedNum = item
    },

    // 跳转
    jump(url) {
      console.log(url);
      this.$router.push({ path: '/' + url })
      // if (process.env.NODE_ENV === "development") {
      //   window.location.href = url;
      // } else {
      //   window.location.href = "/pages" + url;
      // }
    },

    // 关闭公用的弹窗组件
    okModal() {
      this.showModal = !1;
    },
    // 返回上一页
    back() {
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
html,
body {
  background: #f9f9f9;
}
em {
  font-style: normal;
}
.container{
  padding-bottom: 261px;
}
.top {
  position: relative;
  width: 100%;
  height: 780px;
  padding-top: 60px;
  background: url(../../assets/images/lottery/banner_bet.png) no-repeat center
    bottom;
  background-size: cover;
  box-sizing: border-box;
  z-index: 1;
}

// header
.header {
  height: 132px;
  position: relative;

  .l {
    width: 132px;
    height: 132px;
    position: absolute;
    top: 0;
    left: 0;
    background: url(../../assets/images/lottery/back_white.png) no-repeat center;
    background-size: cover;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 54px;
    color: rgba(255, 255, 255, 1);
    line-height: 132px;
  }
  .r {
    width: 258px;
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    font-size: 42px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 132px;
  }
}

// banner
.banner {
  .total {
    padding: 10px 45px 0;

    .h1 {
      padding-top: 10px;
      font-size: 72px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 72px;
    }
    .h2 {
      padding-top: 60px;
      font-size: 42px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 42px;
    }
    .p {
      padding-top: 30px;
      font-size: 42px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 42px;
    }
  }
}

// main
.main {
  position: relative;
  width: 990px;
  margin: -240px auto 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10px 20px 0px rgba(136, 136, 136, 0.15);
  border-radius: 30px;
  z-index: 2;

  .list {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 90px;

    .item {
      width: 33.3333%;
      padding-top: 90px;

      .ball{
        margin: 0 auto;
        width: 150px;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url(../../assets/images/lottery/ball_blue_2.png) no-repeat
          center bottom;
        background-size: contain;

        span{
          font-size:90px;
          font-family:DIN-Bold,DIN;
          font-weight:bold;
          color:rgba(255,255,255,1);
          line-height:90px;
        }
      }
      &.active .ball{
        background: url(../../assets/images/lottery/ball_blue.png) no-repeat
          center bottom;
        background-size: contain;
      }
    }
  }
}

// 按钮
.btns {
  width: 100%;
  padding: 41px 0;
  position: fixed;
  bottom: 0;
  z-index: 3;
  background: #fff;
  box-shadow:0px -1px 20px 0px rgba(136,136,136,0.15);
}
// 挑战按钮
.btn-com {
  width: 991px;
  height: 135px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: url(../../assets/images/lottery/btn.png) no-repeat center;
  background-size: cover;

  span {
    font-size: 48px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 48px;
  }
}
</style>
