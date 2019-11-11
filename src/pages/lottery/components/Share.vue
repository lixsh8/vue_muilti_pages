<template>
  <div class="share-wrap">
    <!-- 分享弹窗 -->
    <div :class="showShare?'share show':'share'">
      <div class="share-img">
        <img
          :src="shareImg"
          alt=""
        >
      </div>

      <div class="share-panel">
        <div class="share-t">
          <div
            class="cls-btn"
            @click="ok"
          ></div>
        </div>

        <div class="share-bd">
          <div class="h1 f-row f-justify-center f-align-center">
            <span v-if="friendsNum>0">成功邀请</span>
            <span v-else>暂未邀请好友</span>
            <div
              class="avatars"
              v-if="friendsAvatars.length>0"
            >
              <img
                v-for="(item, index) in friendsAvatars"
                :key="item+index"
                :src="item"
                alt=""
              >
            </div>
            <span v-if="friendsNum>0&&friendsNum<=3">{{friendsNum}}人</span>
            <span v-if="friendsNum>3">...等{{friendsNum}}人</span>
          </div>
          <div class="h2">当前中奖收益<span> +{{percent}}%</span></div>
          <div class="line"></div>

          <div class="share-ft f-row f-justify-between f-align-center">
            <div class="btn" @click="shareWith('wxsession')">
              <img
                :src="iconWxapp"
                alt=""
              >
              <p>微信好友</p>
            </div>
            <div class="btn" @click="shareWith('wxtimeline')">
              <img
                :src="iconPyq"
                alt=""
              >
              <p>朋友圈</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import shareTp from "@/assets/images/lottery/share_top_bg.png";
import iconPyq from "@/assets/images/morningChallenge/icon_pyq.png";
import iconWxapp from "@/assets/images/morningChallenge/icon_wxapp.png";
import iconCloseGray from "@/assets/images/morningChallenge/icon_close_gray.png";
export default {
  name: "Share",
  props: {
    showShare: {
      type: Boolean,
      default: false
    },
    shareImg: {
      type: String,
      default: ''
    },
    friendsNum: {
      type: String,
      default: ""
    },
    friendsAvatars: {
      type: Array,
      default: () => []
    },
    percent: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      iconPyq: iconPyq,
      shareTp: shareTp,
      iconWxapp: iconWxapp,
      iconCloseGray: iconCloseGray
    };
  },
  methods: {
    ok() {
      console.log(11111);
      this.$emit("okShare", {});
    },
    shareWith(type) {
      this.$emit('shareWith', type)
    }
  }
};
</script>

<style lang="less" scoped>
.share {
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
  // 分享图片
  .share-img {
    width: 430px;
    height: 747px;
    position: absolute;
    top: 163px;
    left: 50%;
    margin-left: -215px;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      border-radius: 16px;
    }
  }

  // 分享
  .share-panel {
    width: 100%;
    position: absolute;
    bottom: 0;

    .share-t {
      position: relative;
      width: 100%;
      height: 275px;
      background: url(../../../assets/images/lottery/share_top_bg.png)
        no-repeat center;
      background-size: cover;

      .cls-btn {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 76px;
        right: 16px;
        background: url(../../../assets/images/morningChallenge/icon_close_gray.png)
          no-repeat center;
        background-size: 72px;
      }
    }

    .share-bd {
      margin-top: -2px;
      height: 607px;
      background: #fff;

      .h1 {
        padding-top: 60px;
        font-size: 0;
        text-align: center;

        span {
          display: inline-block;
          vertical-align: middle;
          font-size: 42px;
          font-weight: 400;
          color: rgba(54, 54, 54, 1);
          line-height: 42px;
        }
        img {
          display: inline-block;
          vertical-align: middle;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin-left: -30px;

          &:first-child {
            margin-left: 30px;
          }
          &:last-child {
            margin-right: 30px;
          }
        }
      }

      .h2 {
        padding: 43px 0 60px;
        text-align: center;
        font-size: 42px;
        font-weight: bold;
        color: rgba(54, 54, 54, 1);
        line-height: 42px;

        span {
          color: #ff3636;
        }
      }
      .line {
        width: 960px;
        margin: 0 auto;
        height: 1px;
        background: #f9f9f9;
      }

      // 按钮
      .share-ft {
        padding: 60px 207px;

        .btn {
          img {
            width: 126px;
            height: 126px;
            border-radius: 50%;
          }
          p {
            padding-top: 12px;
            text-align: center;
            font-size: 33px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 33px;
          }
        }
      }
    }
  }
}
</style>
