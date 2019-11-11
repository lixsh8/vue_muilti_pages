<template>
  <div :class="showShare?'containter noscroll':'containter'">
    <!-- 跳转拼多多按钮 -->
    <div class="fl-btn" @click="gopdd"></div>
    <div class="top">
      <!-- 头部 -->
      <div class="header">
        <div
          class="l"
          @click="back"
        ></div>
        <div class="title"></div>
        <div
          class="r"
          @click="jump('/pddInviteRule.html')"
        >活动规则</div>
      </div>

      <!-- 分享按钮 -->
      <div
        class="btn-invite"
        @click="share"
      ></div>
    </div>

    <div class="bot">
      <!-- 战绩 -->
      <div class="h1 pt0">— 邀请战绩 —</div>
      <div class="summ">
        <div class="summ-list f-row f-justify-center f-align-center">
          <div class="summ-item" v-for="(item, index) in inviteGains" :key="index">
            <h6><span>{{item.value}}</span>{{index==0?'人':'元'}}</h6>
            <p>{{item.name}}</p>
          </div>
        </div>

        <div
          class="summ-bt"
          @click="jump('/pddInvite.html#/mine')"
        >
          查看详情 >
        </div>
      </div>

      <!-- 3步 -->
      <div class="h1">— 3步得奖励 —</div>
      <div class="step"><img
          src="../../assets/images/pddInvite/how.png"
          alt=""
        ></div>

      <!-- 榜单 -->
      <div class="top-list" v-if="inviteRank&&inviteRank.length>0">
        <div class="top-list-t"></div>

        <div class="list">
          <div class="item f-row f-justify-center f-align-center" v-for=" item in inviteRank" :key="item.id">
            <div class="icon"><img
                :src="require('../../assets/images/pddInvite/rank_'+item.sort+'.png')"
                alt=""
              ></div>
            <div class="avatar"><img
                :src="item.avatar"
                alt=""
              ></div>
            <div class="uname">{{item.nickname}}</div>
            <div class="r">已赚<span>{{item.amount}}</span>元</div>
          </div>
        </div>
      </div>

      <!-- 活动规则 -->
      <div class="rule-bt">
        参与活动见 <span @click="jump('/pddInviteRule.html')"> 活动规则></span>
      </div>
    </div>

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
      selfInviteUrl: '',
      inviteGains: [],
      inviteRank: [],
      showShare: false, // 显示分享
      shareImg: require("../../assets/images/pddInvite/share.png"),
      showModalHelp: false, // 帮助弹窗只一次
      showModal: true
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
  },
  destroyed() {
    if (this.countDownTimer) clearInterval(this.countDownTimer);
    if (this.pollingTimer) clearInterval(this.pollingTimer);
  },
  methods: {
    // 加载数据
    loadData() {
      this.$_loading.show({
        loadingType: "img-gif",
        contentBgColor: "rgba(243, 243, 245, 1)"
      });
      axios
        .get(`/pdd/invite?token=${this.token}`)
        .then(res => {
          console.log(res);
          this.$_loading.hide();
          // this.inviteGains = res.inviteGains;
          // this.inviteRank = res.inviteRank;
          this.$set(this, 'selfInviteUrl', res.selfInviteUrl)
          this.$set(this, 'inviteGains', res.inviteGains)
          this.$set(this, 'inviteRank', res.inviteRank)
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
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

    // 跳转拼多多
    gopdd() {
      let url = this.selfInviteUrl;
      if (url) {
        window.GOD && window.GOD.go && window.GOD.go(url);
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
        .get(`/pdd/share?token=${this.token}`)
        .then(res => {
          // console.log(res);
          this.$_loading.hide();
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
      window.GOD && window.GOD.sharePoster && GOD.sharePoster(type, 'pdd', qrCode, title, desc);
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
@keyframes scale {
  0%{
    transform: scale(1)
  }
  50%{
    transform: scale(1.1)
  }
  100%{
    transform: scale(1)
  }
}

// 浮动按钮
.fl-btn {
  width: 150px;
  height: 178px;
  position: fixed;
  bottom: 192px;
  right: 16px;
  background: url(../../assets/images/pddInvite/pdd.png) no-repeat center;
  background-size: 100%;
  z-index: 3;
}

.top {
  position: relative;
  width: 100%;
  height: 1576px;
  padding-top: 60px;
  background: #fd965f url(../../assets/images/pddInvite/index_top.png) no-repeat
    center;
  background-size: 100%;
  box-sizing: border-box;

  // 分享按钮
  .btn-invite {
    width: 764px;
    height: 194px;
    position: absolute;
    top: 1147px;
    left: 50%;
    margin-left: -382px;
    background: url(../../assets/images/pddInvite/btn_invite.png) no-repeat
      center;
    background-size: 100%;
    animation: scale 2s linear infinite;
  }
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

// bot
.bot {
  width: 100%;
  // padding-top: 224px;
  position: relative;
  background: #fd965f;

  .h1 {
    padding: 90px 0 45px;
    text-align: center;
    font-size: 54px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 54px;
  }

  .pt0 {
    padding-top: 0;
  }

  // 战绩
  .summ {
    width: 960px;
    height: 425px;
    margin: 0 auto;
    background: linear-gradient(
      360deg,
      rgba(255, 130, 66, 1) 0%,
      rgba(255, 54, 54, 1) 100%
    );
    border-radius: 30px;

    .summ-item {
      width: 33.3333%;
      padding: 90px 0;
      h6 {
        text-align: center;
        font-size: 36px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 36px;

        span {
          font-size: 72px;
          font-family: DIN-Medium,dim_medium, DIN;
        }
      }

      p {
        padding-top: 30px;
        text-align: center;
        font-size: 36px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        line-height: 36px;
      }
    }

    .summ-bt {
      padding: 20px;
      text-align: center;
      font-size: 36px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 36px;
      text-decoration: underline;
    }
  }

  // 3步骤
  .step {
    width: 960px;
    margin: 0 auto;

    img {
      display: block;
      width: 100%;
    }
  }

  // 榜单
  .top-list {
    width: 960px;
    margin: 100px auto 0;

    .top-list-t {
      width: 100%;
      height: 189px;
      background: url(../../assets/images/pddInvite/panel_t.png) no-repeat
        center;
      background-size: 100%;
    }

    .list {
      margin-top: -1px;
      padding: 0px 45px 45px;
      background: #fff;
      border-radius: 0px 0px 30px 30px;

      .item {
        margin-bottom: 30px;
        padding: 35px 30px;
        background: rgba(255, 54, 54, 0.05);
        border-radius: 15px;

        .icon {
          flex-shrink: 0;
          width: 72px;
          height: 72px;

          img {
            display: block;
            width: 72px;
            height: 72px;
          }
        }
        .avatar {
          flex-shrink: 0;
          margin-left: 9px;
          width: 90px;
          height: 90px;

          img {
            display: block;
            width: 90px;
            height: 90px;
            border-radius: 50%;
          }
        }

        .uname {
          width: 180px;
          flex-shrink: 0;
          padding-left: 15px;
          font-size: 36px;
          font-weight: 400;
          color: rgba(54, 54, 54, 1);
          line-height: 36px;
        }
        .r {
          flex: 1;
          text-align: right;
          font-size: 36px;
          font-weight: 400;
          color: rgba(54, 54, 54, 1);
          line-height: 1;

          span {
            font-size: 54px;
            color: #ff3636;
            line-height: 1;
          }
        }
      }
    }
  }

  // 底部
  .rule-bt {
    padding: 90px 0 160px;
    text-align: center;
    font-size: 36px;
    font-weight: 400;
    color: rgba(204, 75, 0, 1);
    line-height: 36px;

    span {
      color: #fff;
      text-decoration: underline;
    }
  }
}
</style>
