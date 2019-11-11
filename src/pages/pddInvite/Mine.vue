<template>
  <div class="containter">
    <load-more
      :on-infinite="onInfinite"
      :enable-infinite="enableInfinite"
      :bottomDistance="60"
    >
      <div class="top">
        <!-- 头部 -->
        <div class="header">
          <div
            class="l"
            @click="back"
          ></div>
          <div class="title">邀请战绩</div>
        </div>
      </div>

      <div :class="list&&list.length>0?'panel':'panel pd-200'">
        <!-- tab -->
        <div class="tab f-row f-justify-center f-align-center">
          <div
            :class="type==0?'tab-item active':'tab-item'"
            @click="changeType(0)"
          >
            <div class="h1"><span>{{sumPot||0}}</span>元</div>
            <p>获得零花钱</p>
          </div>
          <div
            :class="type==1?'tab-item active':'tab-item'"
            @click="changeType(1)"
          >
            <div class="h1"><span>{{sumBlance||0}}</span>元</div>
            <p>获得现金</p>
          </div>
          <div
            :class="type==2?'tab-item active':'tab-item'"
            @click="changeType(2)"
          >
            <div class="h1"><span>{{sumReduce||0}}</span>元</div>
            <p>已失效</p>
          </div>
        </div>

        <div
          class="list"
          v-if="list&&list.length>0"
        >
          <div
            class="item"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="l"><img
                :src="item.avatar"
                alt=""
              ></div>
            <div class="m">
              <div class='h1'>{{item.nickname}}</div>
              <div class='h2'>{{item.date}}</div>
            </div>
            <div class="r">
              <div class='h1'><span>{{item.amount}}</span>元</div>
              <div class="h2" v-if="item.desc">{{item.desc}}</div>
            </div>
          </div>
        </div>

        <!-- 没有更多数据了 -->
        <div
          v-if="!hasMore && list.length > 0"
          class="no-more"
        >没有更多数据了</div>
        <none-data
          v-if="!hasMore && list.length < 1"
          class="none-data"
        />
      </div>
    </load-more>
  </div>
</template>

<script>
import LoadMore from "@/components/Loadmore";
import NoneData from "@/components/NoneData";
import axios from "@/config/axiosSign";
import { Toast } from "@/utils/util";
export default {
  components: {
    LoadMore,
    NoneData
  },
  props: {},
  data() {
    return {
      token: "",
      type: 0,
      next: 0,
      hasMore: true,
      list: [],
      sumBlance: 0,
      sumPot: 0,
      sumReduce: 0
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
    loadData(done) {
      if (this.next < 2) {
        this.$_loading.show({
          loadingType: "img-gif",
          contentBgColor: "rgba(243, 243, 245, 1)"
        });
      }
      axios
        .get(
          `/pdd/myInvite?token=${this.token}&type=${this.type}&next=${this.next}`
        )
        .then(res => {
          // console.log(res)
          this.sumBlance = res.sumBlance;
          this.sumPot = res.sumPot;
          this.sumReduce = res.sumReduce;

          this.list = this.list.concat(res.items);
          this.next = res.next;
          this.hasMore = res.hasMore;
          done && done();
          // this.headerHeight = this.$refs.header.clientHeight

          this.$_loading.hide();
        })
        .catch(err => {
          console.log(err);
          this.$_loading.hide();
          this.hasMore = false;
          Toast("网络出错", 3000);
          done && done();
          // this.headerHeight = this.$refs.header.clientHeight
        });
    },
    onInfinite(done) {
      this.onInfinitePort(done);
    },
    onInfinitePort(done) {
      if (!this.hasMore) {
        this.enableInfinite = false;
        done && done();
        return;
      }
      this.loadData(done);
    },
    // 切换分类
    changeType(type) {
      console.log(type);
      this.$set(this, "type", type);
      this.$set(this, "list", []);
      this.$set(this, "next", 0);
      this.$nextTick(() => {
        // DOM 现在更新了
        this.loadData();
      });
    },
    // 跳转
    jump() {
      window.GOD &&
        window.GOD.go &&
        window.GOD.go("ququqian://balance/logs?tab=balance");
    },
    // 返回上一页
    back() {
      window.history.go(-1);
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

.top {
  position: relative;
  z-index: 1;
  padding-top: 60px;
  width: 1080px;
  height: 600px;
  background: linear-gradient(
    360deg,
    rgba(253, 149, 95, 1) 0%,
    rgba(255, 54, 54, 1) 100%
  );
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

// panel
.panel {
  position: relative;
  z-index: 2;
  width: 990px;
  margin: -408px auto 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10px 20px 0px rgba(136, 136, 136, 0.15);
  border-radius: 30px;
  box-sizing: border-box;

  // tab
  .tab {
    border-radius: 30px 30px 0 0;
    background: rgb(254, 123, 96);

    .tab-item {
      width: 33.3333%;
      padding: 45px 0;
      text-align: center;
      background: rgb(254, 123, 96);
      overflow: hidden;

      .h1 {
        font-size: 30px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 1;

        span {
          font-size: 54px;
          font-family: DIN-Medium,dim_medium, DIN;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 54px;
        }
      }

      p {
        padding-top: 30px;
        font-size: 42px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 42px;
      }

      &.active {
        border-radius: 30px 30px 0 0 !important;
        background: #fff;

        .h1,
        p {
          color: #363636;

          span {
            color: #363636;
          }
        }
      }

      &:first-child {
        border-radius: 30px 0 0 0;
      }
      &:last-child {
        border-radius: 0 30px 0 0;
      }
    }
  }

  .list {
    padding: 15px 45px;

    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 45px 0;
      border-bottom: 1px solid #e2e2e2;

      .l {
        width: 110px;
        height: 110px;
        flex-shrink: 0;
        margin-right: 30px;

        img {
          display: block;
          width: 110px;
          height: 110px;
          border-radius: 50%;
        }
      }

      .m {
        flex: 1;

        .h1 {
          font-size: 39px;
          font-weight: 400;
          color: rgba(54, 54, 54, 1);
          line-height: 39px;
        }
        .h2 {
          padding-top: 35px;
          font-size: 36px;
          font-weight: 400;
          color: rgba(155, 155, 155, 1);
          line-height: 36px;
        }
      }

      .r {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        .h1 {
          width: 260px;
          flex-shrink: 0;
          text-align: right;
          font-size: 36px;
          font-weight: 500;
          color: rgba(54, 54, 54, 1);
          line-height: 36px;

          span {
            font-size: 48px;
            font-family: DIN-Medium,dim_medium, DIN;
            font-weight: 500;
            color: rgba(54, 54, 54, 1);
            line-height: 48px;
          }
        }
        .h2 {
          padding-top: 26px;
          text-align: right;
          font-size: 36px;
          font-weight: 400;
          color: rgba(155, 155, 155, 1);
          line-height: 36px;
        }
      }
    }
  }
}

.pd-200 {
  height: calc(100vh - 305px);
  .none-data {
    padding: 400px 0;
  }
}
</style>
