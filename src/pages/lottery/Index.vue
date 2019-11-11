<template>
  <div :class="showModal||showModalHelp||showShare?'containter noscroll':'containter'">
    <div class="top">
      <!-- 头部 -->
      <div :class="scrollHeader?'header2':'header'">
        <div
          class="l"
          @click="back"
        ></div>
        <div class="title">{{scrollHeader?'天天中彩':''}}</div>
        <div
          class="r"
          @click="jump('/lotteryRule.html')"
        >活动规则</div>
      </div>

      <!-- banner -->
      <div class="banner">
        <div class="total">
          <div class="h1">当前奖池(元)</div>
          <div class="h2">{{indexData&&indexData.currentAmount}}</div>
          <div
            class="p"
            @click="jump('/lotteryRule.html')"
          >第三方数据开奖，公正公开 ></div>
        </div>

        <!-- 开奖记录按钮 -->
        <div
          class="btn-record"
          @click="jump('/lottery.html#/records')"
        ></div>
        <div
          class="btn-my"
          @click="jump('/lottery.html#/mine')"
        ></div>
      </div>
    </div>

    <!-- main -->
    <div class="main">
      <!-- 上期幸运得主 -->
      <div class="sec-award">
        <div class="h1">上期幸运得主</div>
        <div class="h2">中奖号码 <span>{{indexData&&indexData.lastIssueNumber}}</span>&emsp;奖池金额 <span>{{indexData&&indexData.lastIssueAmount}}<em class="unit">元</em></span></div>
        <div :class="lastIssueLucky&&lastIssueLucky.length==1?'top3 center':'top3'">
          <div
            class="top3-item"
            v-for="item in lastIssueLucky"
            :key="item"
          >
            <div class="avatar"><img
                :src="item.avatar"
                alt=""
              ></div>
            <div class="nick">{{item.nickname}}</div>
            <div class="amount">{{item.bonus}}<em>元</em></div>
          </div>
        </div>
      </div>

      <!-- 当前期 -->
      <div class="sec-cur">
        <div class="h1"><span>{{indexData&&indexData.currentDesc}}</span><em>{{indexData&&indexData.currentType}}</em></div>
        <!-- 邀请按钮 -->
        <div
          class="invite-btn"
          @click="share"
        ></div>

        <div class="panel">
          <div class="filter-bar">
            <div
              :class="sort==1&&asc?'col3 asc':sort==1&&!asc?'col3 desc':'col3'"
              @click="sortHandler('1')"
            ><span>号码</span><em></em></div>
            <div
              :class="sort==2&&asc?'col3 asc':sort==2&&!asc?'col3 desc':'col3'"
              @click="sortHandler('2')"
            ><span>已投总数</span><em></em></div>
            <div
              :class="sort==3&&asc?'col3 asc':sort==3&&!asc?'col3 desc':'col3'"
              @click="sortHandler('3')"
            ><span>我已投</span><em></em></div>
          </div>

          <div class="list">
            <div
              class="item"
              v-for="item in currentData"
              :key="item"
            >
              <div class="col no">
                <div class="ball"><span>{{item.betNum}}</span></div>
              </div>
              <div class="col cur-total">{{item.sumBetCount}}注</div>
              <div :class="item.myBet>0?'col cur-my active':'col cur-my'">{{item.myBet||'--'}}</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="btns">
      <!-- 投注按钮 -->
      <div
        class="btn-com btn-vedio"
        v-if="indexData&&indexData.state==1&&indexData.nextBetTime==0"
        @click="advClick"
      ><img
          src="../../assets/images/lottery/icon_vedio.png"
          alt=""
        ><span>免费投注中大奖</span></div>

      <!-- 倒计时 -->
      <div
        class="btn-com btn-countdown"
        v-else-if="indexData&&indexData.state==1&&indexData.nextBetTime>0"
      ><span>免费投注 倒计时 {{countDownTxt}}</span></div>
      <!-- 暂停投注按钮 -->
      <div
        class="btn-rest"
        v-else
      ></div>
    </div>

    <!-- 第一次说明弹窗 -->
    <div :class="showModalHelp?'modal show':'modal'">
      <div class="modal-cnt">
        <div
          class="rule-btn"
          @click="jump('/lotteryRule.html')"
        >详细规则></div>
      </div>
      <div
        class="cls-btn-com"
        @click="clsModal"
      ></div>
    </div>

    <!-- Modal弹窗 -->
    <Modal
      :showModal='showModal'
      :modalType='modalType'
      :modalAmount='modalAmount'
      :modalTitle='modalTitle'
      :modalDesc='modalDesc'
      :modalDesc2='modalDesc2'
      :modalBotDesc='modalBotDesc'
      @okModal='okModal'
    ></Modal>

    <!-- 分享弹窗 -->
    <Share
      :shareImg='shareImg'
      :showShare='showShare'
      :friendsAvatars='friendsAvatars'
      :friendsNum='friendsNum'
      :percent='percent'
      @shareWith='shareWith'
      @okShare='okShare'
    />
  </div>
</template>

<script>
import LoadMore from "@/components/Loadmore";
import NoneData from "@/components/NoneData";
import Modal from "./components/Modal";
import Share from "./components/Share";
import axios from "@/config/axiosSign";
import { Toast } from "@/utils/util";
export default {
  components: {
    LoadMore,
    Modal,
    Share,
    NoneData
  },
  props: {},
  data() {
    return {
      token: "",
      // 滚动的头部
      scrollHeader: 0,
      showShare: false, // 显示分享
      // 分享基础数据
      shareImg: '',
      friendsNum: 0,
      friendsAvatars: [],
      percent: 0,
      // 分享出去的数据
      title: "",
      desc: "",
      qrCode: "",
      showModalHelp: 0, // 帮助弹窗只一次
      // 弹窗
      showModal: 0,
      modalType: "desc",
      modalAmount: 0,
      modalTitle: "免费投注中大奖",
      modalDesc: "投注次数：1小时/次",
      modalDesc2: "选号规则：每次选择1个号码，可重复选号",
      modalBotDesc: "视频广告费用100%放入奖池中作为奖金",

      // 首页数据
      indexData: null,
      currentData: [],
      lastIssueLucky: [],
      pollingTimer: null,
      countDownNum: 0,
      countDownTxt: "00:00:00",
      countDownTimer: null,
      // 控制排序
      sort: "1",
      asc: !0,

      // 看广告失败
      firstAdTime: 60, // 第一次广告失败倒计时时间，单位秒
      secondAdTime: 180, // 第二次广告失败倒计时时间，单位秒
      dkCountDownTimer: null,
      adFail: false,
      dkCountDown: 0,
      dkCountDownTxt: "00:00:00"
    };
  },
  computed: {},
  created() {
    this.token = window.GOD && window.GOD.getToken ? window.GOD.getToken() : "";
  },
  mounted() {
    if (!localStorage.getItem("isShowModal")) {
      this.showModalHelp = !0;
    } else {
      this.showModalHelp = !1;
    }
    this.loadData();
    // 监听滚动
    window.addEventListener("scroll", this.scrollToTop);
    // 将playCallBack方法绑定到window下面，提供给外部调用
    let me = this;
    window["playCallBack"] = status => {
      me.playCallBack(status); // 这个也就是我定义的方法
    };
  },
  destroyed() {
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    if (this.dkCountDownTimer) clearInterval(this.dkCountDownTimer);
    if (this.countDownTimer) clearInterval(this.countDownTimer);
  },
  methods: {
    // 加载数据
    loadData() {
      // 如果有定时器要清空定时器
      if (this.dkCountDownTimer) clearInterval(this.dkCountDownTimer);
      if (this.countDownTimer) clearInterval(this.countDownTimer);

      this.$_loading.show({
        loadingType: "img-gif",
        contentBgColor: "rgba(243, 243, 245, 1)"
      });
      axios
        .get(`/lottery/index?token=${this.token}`)
        .then(res => {
          // console.log(res);
          this.$_loading.hide();
          this.$set(this, "indexData", res);
          this.$set(this, "currentData", res.currentData);
          this.$set(this, "lastIssueLucky", res.lastIssueLucky);

          // 倒计时
          if (res.nextBetTime > 0) {
            this.countDownNum = res.nextBetTime || 0;
            console.log("this.countDownNum===" + this.countDownNum);
            this.setCountDown();
            this.countDown();
          }
          // 轮询
          if (this.pollingTimer) clearInterval(this.pollingTimer);
          // if (res.sign.crond > 0) {
          //   this.pollingTimer = setInterval(() => {
          //     this.polling();
          //   }, res.sign.crond * 1000);
          // }
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
    },

    // 轮询数据接口
    polling() {
      axios
        .get(`/clockIn/crond?token=${this.token}`)
        .then(res => {
          // console.log(res);
          // 如果过了阶段就重新加载数据
          if (this.sign.period !== res.sign.period) {
            this.loadData();
          } else {
            this.$set(this, "sign", res.sign);
            this.$set(this, "score", res.score);
            // this.$forceUpdate();
          }
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
    },
    // 点击投注按钮事件处理函数
    advClick() {
      if (localStorage.getItem("firstClick") !== "1") {
        this.showModal = true;
        localStorage.setItem("firstClick", "1");
      } else {
        this.playAd();
      }
    },
    // 点击看广告
    playAd() {
      console.log("开始请求广告资源");
      this.$_loading.show({
        loadingType: "img-gif",
        contentBgColor: "rgba(243, 243, 245, 1)"
      });
      // 请求广告资源
      axios
        .get(`/lottery/betAdv?token=${this.token}`)
        .then(res => {
          console.log(res);
          // this.$_loading.hide();
          const { adLogId, adIdVideo } = res;
          sessionStorage.setItem('adLogId', adLogId);
          window.GOD &&
            window.GOD.playVideoAd &&
            window.GOD.playVideoAd(adLogId, adIdVideo, "playCallBack");
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
    },
    // 看完广告回调结果
    playCallBack(status) {
      console.log("看广告结果：" + status);
      this.$_loading.hide();
      if (status === "1") {
        this.adSucc();
      } else {
        // 看广告失败
        // 首次失败间隔1分钟，第二次失败间隔三分钟，第三次还失败就直接成功
        localStorage.setItem("adFail", 1);
        let adFailCount = localStorage.getItem("adFailCount") * 1;
        adFailCount += 1;
        localStorage.setItem("adFailCount", adFailCount);
        // 广告失败弹窗
        this.showModal = true;
        this.modalTitle = "看广告失败";
        this.modalType = "payFail";

        if (adFailCount === 1) {
          this.modalDesc = "请" + this.firstAdTime / 60 + "分钟后再次尝试";

          this.$set(this, "adFail", true);
          this.$set(this, "dkCountDown", this.firstAdTime);
          this.$set(
            this,
            "dkCountDownTxt",
            "00:0" + this.firstAdTime / 60 + ":00"
          );
          console.log("this.dkCountDown===" + this.dkCountDown);
          this.setCountDown("dk");
          this.countDown("dk");
        } else if (adFailCount === 2) {
          this.modalDesc = "请" + this.secondAdTime / 60 + "分钟后再次尝试";

          this.$set(this, "adFail", true);
          this.$set(this, "dkCountDown", this.secondAdTime);
          this.$set(
            this,
            "dkCountDownTxt",
            "00:0" + this.secondAdTime / 60 + ":00"
          );
          console.log("this.dkCountDown===" + this.dkCountDown);
          this.setCountDown("dk");
          this.countDown("dk");
        } else if (adFailCount >= 3) {
          this.adSucc();
        }
      }
    },

    // 看广告成功
    adSucc() {
      // 看广告成功
      this.$router.push({ path: "/Bet" });
      axios
        .get(`/clockIn/doing?token=${this.token}`)
        .then(res => {
          localStorage.setItem("adFailCount", 0);
          localStorage.setItem("adFail", 0);
          // console.log(res);
          this.$_loading.hide();
          if (res.state === 2) {
            // 成功
            this.showModal = true;
            this.modalAmount = res.amount;
            this.modalTitle = "打卡成功";
            this.modalDesc = res.desc;
            this.modalType = "dkSuc";
          } else {
            // 失败
            this.loadData();
          }
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
    },

    // 倒计时
    countDown(type) {
      if (type === "dk") {
        if (this.dkCountDownTimer) clearInterval(this.dkCountDownTimer);
        this.dkCountDownTimer = setInterval(() => {
          this.dkCountDown--;
          this.setCountDown(type);
        }, 1000);
      } else {
        if (this.countDownTimer) clearInterval(this.countDownTimer);
        this.countDownTimer = setInterval(() => {
          this.countDownNum--;
          this.setCountDown(type);
        }, 1000);
      }
    },

    // 设置倒计时
    setCountDown(type) {
      var countDownNum = 0;
      if (type === "dk") {
        countDownNum = this.dkCountDown;
      } else {
        countDownNum = this.countDownNum;
      }
      var h = "",
        m = "",
        s = "",
        countDownTxt = "";
      console.log(countDownNum);
      if (countDownNum >= 0) {
        h =
          Math.floor(countDownNum / 3600) > 9
            ? Math.floor(countDownNum / 3600)
            : "0" + Math.floor(countDownNum / 3600);
        m =
          Math.floor((countDownNum / 60) % 60) > 9
            ? Math.floor((countDownNum / 60) % 60)
            : "0" + Math.floor((countDownNum / 60) % 60);
        s =
          countDownNum % 60 > 9 ? countDownNum % 60 : "0" + (countDownNum % 60);
        countDownTxt = h + ":" + m + ":" + s;
        console.log(h, m, s, countDownTxt);
        if (type === "dk") {
          this.$set(this, "dkCountDownTxt", countDownTxt);
        } else {
          this.$set(this, "countDownTxt", countDownTxt);
        }
        // this.countDownTxt = countDownTxt;
      } else {
        if (type === "dk") {
          // 如果有定时器要清空定时器
          if (this.dkCountDownTimer) clearInterval(this.dkCountDownTimer);
          this.$set(this, "adFail", false);
        } else {
          this.loadData();
        }
      }
    },

    // 滚动事件
    scrollToTop() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop);
      if (scrollTop > 100) {
        this.scrollHeader = true;
      } else {
        this.scrollHeader = false;
      }
    },

    // 跳转
    jump(url) {
      console.log(url);
      if (process.env.NODE_ENV === "development") {
        window.location.href = url;
      } else {
        window.location.href = "/pages" + url;
      }
    },

    // 返回上一页
    back() {
      console.log("back");
      window.GOD && window.GOD.close && window.GOD.close();
    },

    // 邀請分享
    share() {
      console.log("invite");
      this.$_loading.show({
        loadingType: "img-gif",
        contentBgColor: "rgba(243, 243, 245, 1)"
      });
      // 请求分享数据
      axios
        .get(`/lottery/share?token=${this.token}`)
        .then(res => {
          // console.log(res);shareimg
          this.$_loading.hide();
          this.$set(this, "friendsNum", res.friendsCount);
          this.$set(this, "percent", res.friendPercent);
          this.$set(this, "friendsAvatars", res.friendAvatar);
          this.$set(this, "shareImg", res.shareimg);
          // 要分享出去的信息
          this.title = res.title;
          this.desc = res.desc;
          this.qrCode = res.qrCode;
          this.showShare = true;
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
    },

    // 调用原生方法分享
    shareWith(type) {
      console.log(type);
      // sharePoster(type, poster, qrcode, title, desc); 分享海报图
      // type: wxsession 发送给好友，wxtimeline 发送朋友圈
      // poster:  default(好友帮我赚)，daka(打卡)，pdd(拼多多)
      // qrcode: 二维码内容
      // title: 海报标题(hi, 我是xxx)
      // desc: 海报描述
      let shareImg = this.shareImg;
      // let desc = this.desc;
      window.GOD &&
        window.GOD.shareImage &&
        GOD.shareImage(type, shareImg);
      this.showShare = false;
    },

    // 关闭弹窗
    clsModal() {
      this.showModalHelp = !1;
      localStorage.setItem("isShowModal", true);
    },

    // 关闭公用的弹窗组件
    okModal() {
      this.showModal = !1;
      // 观看视频
      this.playAd();
    },

    // 关闭分享
    okShare() {
      this.showShare = !1;
    },

    // 排序方法
    sortBy(property, acs) {
      return function(a, b) {
        var value1 = a[property] * 1;
        var value2 = b[property] * 1;
        if (acs) {
          return value1 - value2;
        } else {
          return value2 - value1;
        }
      };
    },

    // 排序处理函数
    sortHandler(type) {
      let currentData = this.currentData;

      if (this.sort === type) {
        this.asc = !this.asc;
      } else {
        this.sort = type;
        this.asc = false;
      }
      // 排序
      if (type === "1") {
        currentData.sort(this.sortBy("betNum", this.asc));
      } else if (type === "2") {
        currentData.sort(this.sortBy("sumBetCount", this.asc));
      } else if (type === "3") {
        currentData.sort(this.sortBy("myBet", this.asc));
      }
      this.currentData = currentData;
    }
  }
};
</script>

<style lang="less" scoped>
em {
  font-style: normal;
}
.containter {
  position: relative;
  height: 100%;
}
.noscroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.top {
  position: relative;
  width: 100%;
  height: 949px;
  padding-top: 190px;
  background: url(../../assets/images/lottery/index_bg1.png) no-repeat center
    bottom;
  background-size: cover;
  box-sizing: border-box;
}

// header
.header {
  height: 132px;
  padding-top: 60px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
  transition: background-color 1s;

  .l {
    width: 132px;
    height: 132px;
    position: absolute;
    top: 60px;
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
    top: 60px;
    right: 0;
    text-align: center;
    font-size: 42px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 132px;
  }
}

// header
.header2 {
  width: 100%;
  padding-top: 60px;
  height: 132px;
  position: relative;
  z-index: 3;
  position: fixed;
  top: 0;
  background-color: rgba(255, 255, 255, 1);
  transition: background-color 1s;

  .l {
    width: 132px;
    height: 132px;
    position: absolute;
    top: 60px;
    left: 0;
    background: url(../../assets/images/lottery/back_black.png) no-repeat center;
    background-size: cover;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 54px;
    font-weight: 400;
    color: rgba(54, 54, 54, 1);
    line-height: 132px;
  }
  .r {
    width: 258px;
    position: absolute;
    top: 60px;
    right: 0;
    text-align: center;
    font-size: 42px;
    font-weight: 400;
    color: rgba(54, 54, 54, 1);
    line-height: 132px;
  }
}

// banner
.banner {
  .total {
    padding: 40px 0 0;

    .h1 {
      text-align: center;
      font-size: 42px;
      font-weight: 400;
      color: rgba(96, 131, 250, 1);
      line-height: 42px;
    }
    .h2 {
      text-align: center;
      padding-top: 50px;
      font-size: 110px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 90px;
      background: linear-gradient(
        315deg,
        rgba(71, 51, 254, 1) 0%,
        rgba(254, 68, 126, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .p {
      text-align: center;
      padding-top: 60px;
      font-size: 36px;
      font-weight: 400;
      color: rgba(146, 171, 255, 1);
      line-height: 36px;
    }
  }

  // 按钮
  .btn-record {
    width: 149px;
    height: 150px;
    position: absolute;
    bottom: 86px;
    left: 120px;
    background: url(../../assets/images/lottery/btn_record.png) no-repeat center;
    background-size: cover;
  }
  .btn-my {
    width: 149px;
    height: 150px;
    position: absolute;
    bottom: 86px;
    right: 120px;
    background: url(../../assets/images/lottery/btn_my.png) no-repeat center;
    background-size: cover;
  }
}

// main
.main {
  margin-top: -1px;
  position: relative;
  width: 100%;
  padding-bottom: 261px;
  background: #3d62e4 url(../../assets/images/lottery/index_bg2.png) no-repeat
    center top;
  background-size: 100% 1369px;

  // 上期幸运得主
  .sec-award {
    .h1 {
      padding-top: 60px;
      text-align: center;
      font-size: 54px;
      font-weight: bold;
      color: rgba(243, 211, 182, 1);
      line-height: 54px;
      background: linear-gradient(
        180deg,
        rgba(255, 242, 166, 1) 0%,
        rgba(255, 201, 31, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .h2 {
      width: 750px;
      padding: 27px 0;
      margin: 24px auto 0;
      text-align: center;
      font-size: 36px;
      font-weight: normal;
      color: rgba(148, 198, 255, 1);
      line-height: 36px;
      background: rgba(37, 104, 202, 1);
      border-radius: 100px;

      span {
        font-size: 42px;
        font-family: DIN-Medium, DIN;
        font-weight: 500;
        color: rgba(255, 236, 146, 1);
        line-height: 42px;
      }
      em {
        font-size: 30px;
      }
    }

    .top3 {
      width: 810px;
      margin: 30px auto 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &.center{
        justify-content: center;
      }

      .top3-item {
        width: 33.3333%;

        .avatar {
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 6px solid #fff;

          img {
            display: block;
            width: 100%;
            height: 100;
            top: 0;
            left: 0;
          }
        }
        .nick {
          width: 100%;
          padding: 15px 15px 0;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 30px;
          font-weight: 400;
          color: rgba(148, 198, 255, 1);
          line-height: 30px;
          box-sizing: border-box;
        }
        .amount {
          width: 100%;
          padding-top: 15px;
          text-align: center;
          font-size: 39px;
          font-family: DIN-Medium, DIN;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 39px;
        }
      }
    }
  }

  // 当前期
  .sec-cur {
    width: 826px;
    margin: 0 auto;
    padding-top: 142px;
    position: relative;

    .h1 {
      position: relative;

      span {
        display: inline-block;
        vertical-align: middle;
        font-size: 54px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 54px;
        background: linear-gradient(
          180deg,
          rgba(255, 242, 166, 1) 0%,
          rgba(255, 201, 31, 1) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      em {
        margin-left: 15px;
        display: inline-block;
        vertical-align: middle;
        padding: 6px 12px;
        font-size: 42px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 42px;
        background: rgba(25, 127, 228, 1);
        border-radius: 4px;
      }
    }

    .invite-btn {
      position: absolute;
      top: 136px;
      right: -36px;
      width: 212px;
      height: 72px;
    }

    // panel
    .panel {
      width: 826px;
      margin: 50px auto 0;
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      position: relative;

      &::before,&::after{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 33.3333%;
        width: 1px;
        height: 100%;
        background: rgba(96,131,250,.1);
      }
      &::after{
        left: 66.6666%;
      }

      // 排序
      .filter-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: rgba(96, 131, 250, 0.05);

        .col3 {
          width: 33.3333%;
          padding: 40px 0;
          font-size: 0;
          text-align: center;

          span {
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            font-size: 39px;
            font-weight: bold;
            color: rgba(96, 131, 250, 1);
            line-height: 39px;
          }
          em {
            margin-left: 12px;
            position: relative;
            display: inline-block;
            vertical-align: middle;
            width: 14px;
            height: 25px;

            &::before {
              content: "";
              display: block;
              position: absolute;
              left: 0;
              top: 0;
              width: 14px;
              height: 8px;
              background: url(../../assets/images/lottery/arr_t_blue_lt.png)
                no-repeat center;
              background-size: cover;
            }
            &::after {
              content: "";
              display: block;
              position: absolute;
              left: 0;
              bottom: 0;
              width: 14px;
              height: 8px;
              background: url(../../assets/images/lottery/arr_b_blue_lt.png)
                no-repeat center;
              background-size: cover;
            }
          }

          &.asc em::before {
            background: url(../../assets/images/lottery/arr_t_blue.png)
              no-repeat center;
            background-size: cover;
          }
          &.desc em::after {
            background: url(../../assets/images/lottery/arr_b_blue.png)
              no-repeat center;
            background-size: cover;
          }
        }
      }

      // 列表
      .list {
        .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 30px 0;

          &:nth-child(2n) {
            background: rgba(96, 131, 250, 0.05);
          }

          .col {
            width: 33.3333%;
          }
          .ball {
            width: 100px;
            height: 100px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 60px;
            font-family: DIN-Bold, DIN;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 60px;
            background: url(../../assets/images/lottery/ball_blue.png) no-repeat
              center;
            background-size: contain;
          }
          .cur-total,
          .cur-my {
            text-align: center;
            font-size: 36px;
            font-weight: 400;
            color: rgba(96, 131, 250, 1);
            line-height: 36px;
          }
          .cur-my.active {
            color: #ff3636;
          }
        }
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
  z-index: 2;
  background: linear-gradient(
    90deg,
    rgba(104, 140, 255, 1) 0%,
    rgba(45, 111, 242, 1) 100%
  );
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
.btn-vedio {
  img {
    width: 64px;
    height: 64px;
    display: block;
    margin-right: 30px;
  }
}
.btn-rest {
  width: 901px;
  height: 134px;
  margin: 0 auto;
  background: url(../../assets/images/lottery/btn_rest.png) no-repeat center;
  background-size: cover;
}

/*第一次帮助弹出框*/

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -moz-box;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -moz-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -moz-box-align: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 96;
  visibility: hidden;
  opacity: 0;
  transition: opacity 1s, visibility 1s;
}

.modal.show {
  opacity: 1;
  visibility: visible;
}

.modal .modal-cnt {
  width: 900px;
  height: 1098px;
  position: relative;
  background: url(../../assets/images/lottery/modal_rule.png) no-repeat center;
  background-size: cover;

  .rule-btn {
    position: absolute;
    left: 50%;
    margin-left: -250px;
    bottom: 86px;
    width: 500px;
    text-align: center;
    text-decoration: underline;
    padding: 34px;
    font-size: 36px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
  }
}

.cls-btn-com {
  width: 160px;
  height: 90px;
  position: absolute;
  left: 50%;
  margin-left: -80px;
  bottom: 150px;
  background: url(../../assets/images/lottery/icon_x_white.png) no-repeat center;
  background-size: 90px;
  z-index: 10;
}
</style>
