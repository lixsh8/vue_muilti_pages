<template>
  <div class="containter">
    <!-- 头部 -->
    <div class="header">
      <div
        class="l"
        @click="back"
      ></div>
      <div class="title">早起挑战</div>
    </div>

    <!-- 选择金额 -->
    <div class="panel">
      <div class="panel-hd f-row f-align-center">
        <h1>早起分钱挑战</h1>
        <p>
          <img
            src="../../assets/images/morningChallenge/icon_time.png"
            alt=""
          >
          <span>打卡时间: {{timeDesc}}</span>
        </p>
      </div>

      <div class="panel-bd pb-60">
        <div class="grid f-row f-justify-between">
          <div
            :class="item.num==selectFenshu?'grid-item active':'grid-item'"
            v-for="(item,index) in payList"
            :key="index+item.desc"
            @click="changeFenshu(item.num)"
          >
            <h1><em>{{item.num||0}}</em>份</h1>
            <h2>{{item.desc||''}}</h2>
          </div>
        </div>

        <div class="desc f-row">
          <img
            src="../../assets/images/morningChallenge/icon_help.png"
            alt=""
          >
          <span>1份等于1元,购买的份数越多，打卡成功后赚的越多</span>
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="panel">
      <div class="panel-hd"><h1>选择支付方式</h1></div>
      <div class="panel-bd">
        <div class="list">
          <div
            :class="item.id==selectPayType?'item active':'item'"
            v-for="(item) in payType"
            :key="item.id"
            @click="changePayType(item.id)"
          >
            <img
              class="icon"
              :src="item.icon||require('../../assets/images/morningChallenge/icon_qu.png')"
              alt=""
            >
            <div class="zf-name">{{item.name}}</div>
            <div class="addon" v-if="item.balance">{{item.balance}}元</div>
          </div>

        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="foot f-row f-align-center">
      <span>共计</span>
      <div class="total">￥<em>{{totalPrice}}</em></div>
      <div
        class="btn"
        @click="pay"
      ><img
          src="../../assets/images/morningChallenge/btn_zf.png"
          alt=""
        ></div>
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
      showModal: false,
      modalType: "",
      modalTitle: "支付失败",
      modalDesc: "支付宝支付取消",
      timeDesc: '6:00-9:00',
      payType: [],
      payList: [],
      selectFenshu: 1,
      totalPrice: '1.00',
      selectPayType: 0,
      total: 0
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
        .get(`/clockIn/sign?token=${this.token}`)
        .then(res => {
          this.payType = res.payType || [];
          this.payList = res.payList || [];
          this.timeDesc = res.desc;
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast("网络出错", 3000);
        });
    },

    // 支付
    pay() {
      this.$_loading.show({
        loadingType: "img-gif",
        contentBgColor: "rgba(243, 243, 245, 1)"
      });
      axios
        .post(
          `/clockIn/paying`,
          {
            token: this.token,
            payType: this.selectPayType,
            num: this.selectFenshu
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            }
          }
        )
        .then(res => {
          // console.log(res);
          if (res.message) {
            Toast(res.message || "网络出错", 3000);
            return false;
          }
          if (res.state) {
            // 成功
            this.jump("/morningChallengePayOk.html");
          } else {
            // 失败
            this.modalDesc = res.msg;
            this.showModal = true;
            this.modalType = "payFail";
          }

          this.$_loading.hide();
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          Toast(err.response.data.message || "网络出错", 3000);
        });
    },
    // 支付完成回调结果
    // playCallBack(status) {
    //   if (status === 1) {
    //     // 支付成功
    //     axios
    //       .post(
    //         `/clockIn/paying?token=${this.token}`,
    //         {
    //           payType: this.selectPayType,
    //           num: this.selectFenshu
    //         },
    //         {
    //           headers: {
    //             "Content-Type":
    //               "application/x-www-form-urlencoded; charset=utf-8"
    //             // 'Content-Type': 'application/json; charset=utf-8'
    //           }
    //         }
    //       )
    //       .then(res => {
    //         console.log(res);
    //         if (res.state) {
    //           // 成功
    //           this.jump("/morningChallengePayOk.html");
    //         } else {
    //           // 失败
    //           this.modalDesc = res.msg;
    //           this.showModal = true;
    //           this.modalType = "payFail";
    //         }

    //         this.$_loading.hide();
    //       })
    //       .catch(err => {
    //         console.log(err);
    //         this.$_loading.hide();
    //         Toast("网络出错", 3000);
    //       });
    //   } else {
    //     // 支付失败
    //     this.showModal = true;
    //     this.type = "payFail";
    //   }
    // },

    // 跳转
    jump(url) {
      console.log(url);
      if (process.env.NODE_ENV === "development") {
        window.location.href = url;
      } else {
        window.location.href = "/pages" + url;
      }
    },

    // 改变份数
    changeFenshu(num) {
      // console.log(num)
      this.selectFenshu = num;
      this.totalPrice = (num * 1).toFixed(2);
    },
    // 改变支付类型
    changePayType(type) {
      this.selectPayType = type;
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
.containter {
  position: relative;
  height: 100%;
  padding: 192px 0;
}

// header
.header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 192px;
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.08);

  .l {
    width: 132px;
    height: 132px;
    position: absolute;
    top: 60px;
    left: 0;
    background: url(../../assets/images/morningChallenge/arr_l_black.png)
      no-repeat center;
    background-size: cover;
  }
  .title {
    padding-top: 60px;
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

// panel
.panel {
  padding: 0 45px;

  .panel-hd {
    padding: 90px 0 45px;

    h1 {
      font-size: 54px;
      font-weight: bold;
      color: rgba(54, 54, 54, 1);
      line-height: 54px;
    }

    p {
      flex: 1;
      font-size: 0;
      text-align: right;
      img {
        display: inline-block;
        vertical-align: middle;
        width: 42px;
        height: 42px;
      }
      span {
        margin-left: 15px;
        display: inline-block;
        vertical-align: middle;
        font-size: 42px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        line-height: 42px;
      }
    }
  }

  .panel-bd {
    padding: 0 45px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 10px 20px 0px rgba(136, 136, 136, 0.15);
    border-radius: 30px;
  }

  // 选择金额
  .grid {
    flex-wrap: wrap;
    padding-top: 60px;

    .grid-item {
      margin-bottom: 45px;
      width: 427px;
      height: 210px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 15px;
      border: 3px solid rgba(226, 226, 226, 1);

      &.active {
        background: linear-gradient(
          90deg,
          rgba(255, 110, 110, 1) 0%,
          rgba(255, 54, 54, 1) 100%
        );
        box-shadow: 0px 10px 20px 0px rgba(252, 50, 6, 0.2);

        h1 {
          color: #fff;
        }
        h2 {
          color: #fff;
        }
      }

      h1 {
        font-size: 45px;
        font-weight: 500;
        color: rgba(54, 54, 54, 1);
        line-height: 45px;
        text-align: center;

        em {
          font-size: 90px;
          font-family: DIN-Medium,dim_medium;
          font-weight: 500;
          line-height: 45px;
        }
      }
      h2 {
        padding-top: 30px;
        text-align: center;
        font-size: 36px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 36px;
      }
    }
  }
  .pb-60 {
    padding-bottom: 60px;
  }

  // desc
  .desc {
    width: 900px;
    padding: 33px 0 33px;
    border-radius: 15px;
    font-size: 36px;
    font-weight: 400;
    color: rgba(255, 40, 51, 1);
    line-height: 36px;
    background: rgba(255, 40, 51, 0.05);

    img {
      margin: 0 15px 0 25px;
      display: block;
      width: 39px;
      height: 39px;
    }
  }

  // 支付方式
  .list {
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 60px 0;
      background: url(../../assets/images/morningChallenge/icon_check_no.png)
        no-repeat right center;
      background-size: 44px;
      border-bottom: 1px solid #e2e2e2;

      &:last-child {
        border-bottom: 0 solid #000;
      }

      &.active {
        background: url(../../assets/images/morningChallenge/icon_check.png)
          no-repeat right center;
        background-size: 44px;
      }

      .icon {
        display: block;
        width: 48px;
        height: 48px;
      }
      .zf-name {
        width: 240px;
        margin-left: 30px;
        font-size: 42px;
        font-weight: 600;
        color: rgba(54, 54, 54, 1);
        line-height: 42px;
      }
      .addon {
        flex: 1;
        font-size: 32px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        line-height: 32px;
      }
    }
  }
}

// 底部按钮
.foot {
  width: 100%;
  padding: 35px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow: 0px 10px 20px 0px rgba(136, 136, 136, 0.15);

  span {
    padding-left: 45px;
    font-size: 42px;
    font-weight: 600;
    color: rgba(54, 54, 54, 1);
    line-height: 42px;
  }
  .total {
    flex: 1;
    padding-left: 3px;
    font-size: 42px;
    font-weight: 500;
    color: rgba(54, 54, 54, 1);
    line-height: 72px;

    em {
      font-family: DIN-Medium;
      font-size: 72px;
    }
  }
  .btn {
    width: 540px;
    height: 166px;
    margin-right: 25px;

    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
