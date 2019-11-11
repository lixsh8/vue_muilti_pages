<template>
  <div :class="showModal||showModalHelp||showShare?'containter noscroll':'containter'">
    <div class="top">
      <!-- 头部 -->
      <div class="header">
        <div
          class="l"
          @click="back"
        ></div>
        <div class="title">早起挑战</div>
        <div
          class="r"
          @click="jump('/morningChallengeRule.html')"
        >挑战规则</div>
      </div>

      <!-- banner -->
      <div class="banner">
        <div class="total">
          <h1>明早准时打卡可瓜分金额(元)</h1>
          <p>{{sign&&sign.amount || 0}}</p>
        </div>

        <div class="j-num">
          <div
            class="avatar-wrap f-row"
            v-if='sign&&sign.avatarList&&sign.avatarList.length>0'
          >
            <div class="avatars f-row">
              <div class="avatar"
                v-for="(item, index) in sign.avatarList"
                v-bind:key="index"
              >
                <img
                :src="item"
                alt
                />
              </div>
            </div>
            <img
              v-if="sign&&sign.memberCount>8"
              class="more"
              src="../../assets/images/morningChallenge/icon_more.png"
              alt
            />
          </div>
          <p>
            <em>{{sign&&sign.memberCount || 0}}</em>人参与
          </p>
        </div>

        <!-- 右边的按钮 -->
        <div
          class="btn-zj"
          @click="jump('/morningChallenge.html#/mine')"
        ></div>
        <div
          v-if="indexData&&(indexData.period==1||indexData.state!=1)"
          class="btn-invite"
          @click="share"
        ></div>
      </div>

      <!-- 按钮 -->
      <!-- 已经报名 打卡倒计时 -->
      <div
        class="btn-com btn"
        v-if="indexData&&indexData.period==3&&indexData.state==1"
      >{{sign&&sign.isToday?'':'明日'}}打卡 倒计时 {{countDownTxt}}</div>
      <!-- 打卡阶段 可打卡 -->
      <div
        class="btn-com btn-dk"
        v-else-if="indexData&&indexData.period==2&&indexData.state==1&&!adFail"
        @click="playAd"
      ></div>
      <!-- 睡眠 0:00~05:00 暂停挑战-->
      <div
        class="btn-com btn-rest"
        v-else-if="indexData&&indexData.period==1"
      ></div>
      <!-- 打卡阶段 打卡失败 -->
      <div
        class="btn-com btn"
        v-else-if="(indexData&&indexData.period==2&&indexData.state==2) || (indexData&&indexData.period==2&&adFail)"
      >打卡 倒计时 {{dkCountDownTxt}}</div>
      <!-- 未报名 可以挑战 -->
      <div
        class="btn-com btn-chan"
        @click="jump('/morningChallenge.html#/pay')"
        v-else
      ></div>

    </div>
    <div :class="indexData&&indexData.period!=1&&indexData.state==1?'bot has-share-btn':'bot'">

      <!-- 长分享按钮 -->
      <div
        v-if="indexData&&indexData.period!=1&&indexData.state==1"
        class="btn-share"
        @click="share"
      >
        <img
          src="../../assets/images/morningChallenge/btn_share.png"
          alt=""
        >
        <span>+10%</span>
      </div>

      <div class="panel">
        <div class="panel-t f-row">
          <h1 v-if="score&&score.isToday">今日战况</h1>
          <h1 v-else>昨日战况</h1>
          <div class="r f-cover">
            <h2>
              成功
              <em>{{score&&score.memberSuccessCount||0}}</em>
            </h2>
            <h3>
              失败
              <em>{{score&&score.memberFailureCount||0}}</em>
            </h3>
          </div>
        </div>

        <!-- top3 -->
        <div
          class="most f-row f-justify-center f-align-end"
          v-if="score&&score.items.length>0"
        >

          <div
            class="most-item"
            v-for="(item, index) in score.items"
            :key="item.desc+index"
          >
            <div class="avatar">
              <img
                :src="item.avatar||'../../assets/images/morningChallenge/icon_pig.png'"
                alt
              />
              <span>{{item.desc}}</span>
            </div>
            <div class="nick">{{item.name}}</div>
            <div class="desc">{{item.value}}</div>
          </div>

        </div>
      </div>
    </div>

    <!-- 第一次说明弹窗 -->
    <div :class="showModalHelp?'modal show':'modal'">
      <div class="modal-cnt">
        <div
          class="rule-btn"
          @click="jump('/morningChallengeRule.html')"
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
      showShare: false, // 显示分享
      // 分享基础数据
      shareImg: require('../../assets/images/morningChallenge/share.png'),
      friendsNum: 0,
      friendsAvatars: [],
      percent: 0,
      // 分享出去的数据
      title: '',
      desc: '',
      qrCode: '',
      showModalHelp: false, // 帮助弹窗只一次
      showModal: false,
      modalType: "",
      modalAmount: 0,
      modalTitle: "",
      modalDesc: "",
      sign: null,
      score: null,
      indexData: null,
      pollingTimer: null,
      countDownNum: 0,
      countDownTxt: "00:00:00",
      countDownTimer: null,
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

    // 将backToday方法绑定到window下面，提供给外部调用
    let me = this;
    window['playCallBack'] = (status) => {
      me.playCallBack(status); // 这个也就是我定义的方法
    }
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
        .get(`/clockIn/index?token=${this.token}`)
        .then(res => {
          // console.log(res);
          this.$_loading.hide();
          this.$set(this, 'indexData', res)
          this.$set(this, 'sign', res.sign)
          this.$set(this, 'score', res.score)

          // 不是打卡阶段  重置播放广告失败次数
          console.log('res.period===' + res.period)
          if (res.period !== 2) {
            localStorage.setItem('adFailCount', 0);
            localStorage.setItem('adFail', 0);
          } else {
            let adFail = localStorage.getItem('adFail') + ''
            let adFailCount = localStorage.getItem('adFailCount') * 1;
            console.log('adFail===' + adFail + ',adFailCount===' + adFailCount)
            if (adFail === '1') {
              if (adFailCount === 1) {
                this.$set(this, 'adFail', true)
                this.$set(this, 'dkCountDown', this.firstAdTime)
                this.$set(this, 'dkCountDownTxt', '00:0' + (this.firstAdTime / 60) + ':00')
                console.log("this.dkCountDown===" + this.dkCountDown);
                this.setCountDown('dk');
                this.countDown('dk');
              } else if (adFailCount === 2) {
                this.$set(this, 'adFail', true)
                this.$set(this, 'dkCountDown', this.secondAdTime)
                this.$set(this, 'dkCountDownTxt', '00:0' + (this.secondAdTime / 60) + ':00')
                console.log("this.dkCountDown===" + this.dkCountDown);
                this.setCountDown('dk');
                this.countDown('dk');
              } else if (adFailCount >= 3) {
                this.adSucc()
              }
            }
          }

          // 是否打卡失败
          if (res.prev_fail_clock === 1) {
            // 打卡失败
            this.showModal = true;
            this.modalType = 'dkFail'
            this.modalTitle = '打卡失败'
            this.modalAmount = res.prev_fail_amount
          }
          // 倒计时
          if (res.countdown > 0) {
            this.countDownNum = res.countdown || 0;
            console.log("this.countDownNum===" + this.countDownNum);
            this.setCountDown();
            this.countDown();
          }
          // 轮询
          if (this.pollingTimer) clearInterval(this.pollingTimer);
          if (res.sign.crond > 0) {
            this.pollingTimer = setInterval(() => {
              this.polling();
            }, res.sign.crond * 1000);
          }
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
            this.$set(this, 'sign', res.sign)
            this.$set(this, 'score', res.score)
            // this.$forceUpdate();
          }
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
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
        .get(`/clockIn/adinfo?token=${this.token}`)
        .then(res => {
          console.log(res);
          // this.$_loading.hide();
          const { adLogId, adIdVideo } = res;
          window.GOD &&
            window.GOD.playVideoAd &&
            window.GOD.playVideoAd(adLogId, adIdVideo, 'playCallBack');
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
    },
    // 看完广告回调结果
    playCallBack(status) {
      console.log('看广告结果：' + status)
      this.$_loading.hide();
      if (status === '1') {
        this.adSucc()
      } else {
        // 看广告失败
        // 首次失败间隔1分钟，第二次失败间隔三分钟，第三次还失败就直接成功
        localStorage.setItem('adFail', 1);
        let adFailCount = localStorage.getItem('adFailCount') * 1;
        adFailCount += 1;
        localStorage.setItem('adFailCount', adFailCount);
        // 广告失败弹窗
        this.showModal = true;
        this.modalTitle = "看广告失败";
        this.modalType = "payFail";

        if (adFailCount === 1) {
          this.modalDesc = '请' + (this.firstAdTime / 60) + '分钟后再次尝试';

          this.$set(this, 'adFail', true)
          this.$set(this, 'dkCountDown', this.firstAdTime)
          this.$set(this, 'dkCountDownTxt', '00:0' + (this.firstAdTime / 60) + ':00')
          console.log("this.dkCountDown===" + this.dkCountDown);
          this.setCountDown('dk');
          this.countDown('dk');
        } else if (adFailCount === 2) {
          this.modalDesc = '请' + (this.secondAdTime / 60) + '分钟后再次尝试';

          this.$set(this, 'adFail', true)
          this.$set(this, 'dkCountDown', this.secondAdTime)
          this.$set(this, 'dkCountDownTxt', '00:0' + (this.secondAdTime / 60) + ':00')
          console.log("this.dkCountDown===" + this.dkCountDown);
          this.setCountDown('dk');
          this.countDown('dk');
        } else if (adFailCount >= 3) {
          this.adSucc()
        }
      }
    },

    // 看广告成功
    adSucc() {
      // 看广告成功
      axios
        .get(`/clockIn/doing?token=${this.token}`)
        .then(res => {
          localStorage.setItem('adFailCount', 0);
          localStorage.setItem('adFail', 0);
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
      if (type === 'dk') {
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
      if (type === 'dk') {
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
        if (type === 'dk') {
          this.$set(this, 'dkCountDownTxt', countDownTxt)
        } else {
          this.$set(this, 'countDownTxt', countDownTxt)
        }
        // this.countDownTxt = countDownTxt;
      } else {
        if (type === 'dk') {
          // 如果有定时器要清空定时器
          if (this.dkCountDownTimer) clearInterval(this.dkCountDownTimer);
          this.$set(this, 'adFail', false)
        } else {
          this.loadData();
        }
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
      console.log('back')
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
        .get(`/clockIn/shareinfo?token=${this.token}`)
        .then(res => {
          // console.log(res);
          this.$_loading.hide();
          this.$set(this, 'friendsNum', res.invite_num)
          this.$set(this, 'percent', res.invite_income)
          this.$set(this, 'friendsAvatars', res.invite_avatar)
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
      console.log(type)
      // sharePoster(type, poster, qrcode, title, desc); 分享海报图
      // type: wxsession 发送给好友，wxtimeline 发送朋友圈
      // poster:  default(好友帮我赚)，daka(打卡)，pdd(拼多多)
      // qrcode: 二维码内容
      // title: 海报标题(hi, 我是xxx)
      // desc: 海报描述
      let qrCode = this.qrCode;
      let title = this.title;
      let desc = this.desc;
      window.GOD && window.GOD.sharePoster && GOD.sharePoster(type, 'daka', qrCode, title, desc);
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
      // 重新加载数据
      if (this.modalType === 'dkSuc') {
        this.loadData();
      }
    },

    // 关闭分享
    okShare() {
      this.showShare = !1;
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
  height: 1424px;
  padding-top: 60px;
  background: rgba(78, 196, 184, 1)
    url(../../assets/images/morningChallenge/index_bg.png) no-repeat center
    bottom;
  background-size: cover;
  box-sizing: border-box;
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
    background: url(../../assets/images/morningChallenge/arr_l_white.png)
      no-repeat center;
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
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 132px;
  }
}

// 瓜分金额
.banner {
  position: relative;

  .total {
    padding: 90px 20px 0 70px;
    h1 {
      font-size: 42px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 42px;
    }
    p {
      padding-top: 30px;
      font-size: 150px;
      font-family: DIN-Medium,dim_medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 150px;
    }
  }

  .j-num {
    padding: 90px 20px 0 70px;

    .avatars {
      .avatar {
        width: 80px;
        height: 80px;
        margin-left: -27px;
        border-radius: 50%;
        border: 4px solid #fff;
        box-sizing: border-box;
        overflow: hidden;

        &:first-child {
          margin-left: 0;
        }

        img{
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .more {
      margin-left: 12px;
      width: 80px;
      height: 80px;
    }

    p {
      padding-top: 30px;
      font-size: 42px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 42px;

      em {
        font-size: 54px;
        font-family: DIN-Medium,dim_medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 54px;
      }
    }
  }

  // 右边按钮
  .btn-zj {
    width: 120px;
    height: 148px;
    position: absolute;
    top: 30px;
    right: 45px;
    background: url(../../assets/images/morningChallenge/icon_zj.png) no-repeat
      center;
    background-size: cover;
  }
  .btn-invite {
    width: 120px;
    height: 148px;
    position: absolute;
    top: 223px;
    right: 45px;
    background: url(../../assets/images/morningChallenge/icon_invite.png)
      no-repeat center;
    background-size: cover;
  }
}

// 挑战按钮
.btn-com {
  position: absolute;
  bottom: 48px;
  left: 50%;
  margin-left: -450px;
  width: 900px;
}
.btn {
  padding: 43px 0;
  text-align: center;
  font-size: 48px;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  line-height: 48px;
  background: url(../../assets/images/morningChallenge/btn.png) no-repeat center;
  background-size: cover;
}
.btn-chan {
  height: 134px;
  background: url(../../assets/images/morningChallenge/btn_challenge.png)
    no-repeat center;
  background-size: cover;
}
.btn-rest {
  height: 134px;
  background: url(../../assets/images/morningChallenge/btn_rest.png) no-repeat
    center;
  background-size: cover;
}
.btn-dk {
  height: 134px;
  background: url(../../assets/images/morningChallenge/btn_dk.png) no-repeat
    center;
  background-size: cover;
}

.bot {
  width: 1080px;
  height: 694px;
  padding-top: 42px;
  position: relative;
  background: linear-gradient(
    0deg,
    rgba(26, 179, 200, 1) 0%,
    rgba(78, 196, 184, 1) 100%
  );

  &.has-share-btn{
    padding-top: 224px;
  }

  // 分享按钮
  .btn-share {
    position: absolute;
    top: 0;
    left: 50%;
    width: 900px;
    margin-left: -450px;

    img {
      display: block;
      width: 100%;
    }

    span {
      position: absolute;
      top: -14px;
      left: 716px;
      padding: 8px 12px;
      text-align: center;
      font-size: 42px;
      font-family: DIN-Medium,dim_medium, DIN;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 42px;
      background: rgba(254, 154, 2, 1);
      border-radius: 20px 0px 20px 0px;
    }
  }

  .panel {
    width: 990px;
    padding-bottom: 45px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 10px 20px 0px rgba(0, 112, 156, 0.1);
    border-radius: 30px;
    .panel-t {
      padding-top: 45px;
      h1 {
        padding-left: 45px;
        width: 220px;
        font-size: 54px;
        font-weight: 500;
        color: rgba(54, 54, 54, 1);
        line-height: 54px;
      }

      .r {
        padding-right: 45px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }

      h2,
      h3 {
        display: inline-block;
        vertical-align: middle;
        font-size: 39px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 39px;
      }
      h2 {
        em {
          padding-left: 3px;
          font-size: 42px;
          font-family: DIN-Medium,dim_medium;
          font-weight: 500;
          color: rgba(255, 40, 51, 1);
          line-height: 42px;
        }
      }
      h3 {
        margin-left: 60px;
        em {
          padding-left: 3px;
          font-size: 42px;
          font-family: DIN-Medium,dim_medium;
          font-weight: 500;
          color: rgba(21, 172, 183, 1);
          line-height: 42px;
        }
      }
    }

    // 最高排行
    .most {
      padding-top: 80px;

      .most-item {
        width: 33.33333%;

        .avatar {
          width: 150px;
          height: 150px;
          margin: 0 auto;
          position: relative;
          box-sizing: border-box;
          border-radius: 50%;
          border: 9px solid rgba(9, 153, 220, 1);
          // border-image:linear-gradient(360deg, rgba(9,153,220,1), rgba(68,198,191,1)) 9 9;
          border-radius: 50%;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          span {
            display: block;
            width: 150px;
            text-align: center;
            padding: 15px 0px;
            position: absolute;
            bottom: -27px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 30px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 30px;
            border-radius: 100px;
            background: linear-gradient(
              270deg,
              rgba(9, 153, 220, 1) 0%,
              rgba(68, 198, 191, 1) 100%
            );
          }
        }

        &:nth-child(2) {
          .avatar {
            width: 180px;
            height: 180px;
            border: 9px solid rgba(255, 85, 0, 1);

            span {
              background: linear-gradient(
                90deg,
                rgba(255, 151, 71, 1) 0%,
                rgba(255, 85, 0, 1) 100%
              );
            }
          }
        }

        .nick {
          padding-top: 35px;
          text-align: center;
          font-size: 36px;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 36px;
        }
        .desc {
          padding-top: 30px;
          text-align: center;
          font-size: 42px;
          font-weight: 400;
          color: rgba(255, 40, 51, 1);
          line-height: 42px;
        }
      }
    }
  }
}

// 弹窗
/*通用弹出框*/

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
  background: url(../../assets/images/morningChallenge/modal_rule.png) no-repeat
    center;
  background-size: cover;

  .rule-btn {
    position: absolute;
    left: 50%;
    margin-left: -250px;
    bottom: 100px;
    width: 500px;
    text-align: center;
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
  background: url(../../assets/images/morningChallenge/icon_close.png) no-repeat
    center;
  background-size: 90px;
  z-index: 10;
}
</style>
