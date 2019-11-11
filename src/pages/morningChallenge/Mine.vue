<template>
  <div class="containter">
    <load-more :on-infinite="onInfinite" :enable-infinite="enableInfinite" :bottomDistance="60">
      <div class="top">
        <!-- 头部 -->
        <div class="header">
          <div class="l" @click="back"></div>
          <div class="title">我的战绩</div>
        </div>

        <!-- summ -->
        <div class="summ f-row">
          <div class="summ-item">
            <h1>{{overview&&overview.cost}}</h1>
            <h2>投入(元)</h2>
          </div>
          <div class="summ-item">
            <h1>{{overview&&overview.prize}}</h1>
            <h2>收入(元)</h2>
          </div>
          <div class="summ-item">
            <h1>{{overview&&overview.signDays}}</h1>
            <h2>参与(天)</h2>
          </div>
          <div class="summ-item">
            <h1>{{overview&&overview.successDays}}</h1>
            <h2>成功(天)</h2>
          </div>
        </div>
        <div class="desc" @click="jump">每日结算金额将于 24:00 前到账趣取钱余额</div>
      </div>

      <div :class="list.length < 1?'panel p-400':'panel'">

        <div class="list">
          <div :class="item.state==1?'item waiting':item.state==2?'item suc':'item fail'" v-for="item in list" :key="item.id">
            <div class="l">
              <h1>{{item.date}}</h1>
              <h2>{{item.createTime}}</h2>
            </div>
            <div class="r">
              <h1><span>{{item.cost}}</span><em>{{item.result}}</em></h1>
              <p v-if="item.desc">{{item.desc}}</p>
            </div>
          </div>
          <!-- <div class="item suc">
            <div class="l">
              <h1>08-59</h1>
              <h2>报名:08-22 12:44:30</h2>
            </div>
            <div class="r">
              <h1><span>投入1.00</span><em>收入1.05</em></h1>
              <p>早起:08-22 05:44:30</p>
            </div>
          </div>
          <div class="item fail">
            <div class="l">
              <h1>08-59</h1>
              <h2>报名:08-22 12:44:30</h2>
            </div>
            <div class="r">
              <h1><span>投入1.00</span><em>早起失败</em></h1>
              <p>很遗憾，未参与打卡</p>
            </div>
          </div> -->
        </div>

        <!-- 没有更多数据了 -->
        <div v-if="!hasMore && list.length > 0" class="no-more">没有更多数据了</div>
        <none-data v-if="!hasMore && list.length < 1" class="none-data" />
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
      token: '',
      start: 0,
      hasMore: true,
      list: [],
      overview: null
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
          loadingType: 'img-gif',
          contentBgColor: 'rgba(243, 243, 245, 1)'
        })
      }
      axios.get(`/clockIn/scorelist?token=${this.token}&start=${this.start}`).then(res => {
        // console.log(res)
        this.overview = res.overview;
        this.list = this.list.concat(res.items)
        this.start = res.next
        this.hasMore = res.hasMore
        done && done()
        // this.headerHeight = this.$refs.header.clientHeight

        this.$_loading.hide();
      }).catch(err => {
        console.log(err)
        this.$_loading.hide()
        this.hasMore = false
        Toast('网络出错', 3000)
        done && done()
        // this.headerHeight = this.$refs.header.clientHeight
      })
    },
    onInfinite(done) {
      this.onInfinitePort(done)
    },
    onInfinitePort(done) {
      if (!this.hasMore) {
        this.enableInfinite = false
        done && done()
        return
      }
      this.loadData(done)
    },
    // 跳转
    jump() {
      window.GOD && window.GOD.go && window.GOD.go('ququqian://balance/logs?tab=balance');
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
  width:1080px;
  height:840px;
  background:linear-gradient(180deg,rgba(7,134,221,1) 0%,rgba(57,194,195,1) 100%);
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

// summ
.summ{
  padding: 90px 45px 0;

  .summ-item{
    width: 25%;

    h1{
      font-size:54px;
      font-family:DIN-Medium,dim_medium;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:54px;
    }
    h2{
      padding-top: 30px;
      font-size:42px;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:42px;
    }
  }
}

.desc{
  width:900px;
  margin: 60px auto 0;
  padding: 26px 45px;
  font-size:36px;
  font-weight:400;
  color:rgba(255,255,255,1);
  border-radius:15px;
  background:rgba(255,255,255,.1) url(../../assets/images/morningChallenge/arr_r_white.png)
      no-repeat 95% center;
  background-size: 36px 37px;
}

// panel
.panel{
  position: relative;
  z-index: 2;
  width:990px;
  margin: -240px auto 0;
  background:rgba(255,255,255,1);
  box-shadow:0px 10px 20px 0px rgba(136,136,136,0.15);
  border-radius:30px;
  box-sizing: border-box;

  .list{
    padding: 0 45px;

    .item{
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 60px 0;
      border-bottom: 1px solid #E2E2E2;

      .l{
        width: 45%;

        h1{
          font-size:42px;
          font-weight:400;
          color:#666666;
          line-height:42px;
        }
        h2{
          padding-top: 30px;
          font-size:36px;
          font-weight:400;
          color:#9B9B9B;
          line-height:36px;
        }
      }
      .r{
        width: 55%;
        text-align: right;

        h1{
          font-size:42px;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:42px;

          em{
            padding-left: 30px;
          }
        }
        p{
          padding-top: 30px;
          font-size:36px;
          font-weight:400;
          color:rgba(155,155,155,1);
          line-height:36px;
        }
      }

      &.waiting{
        .l{
          h1{
            color: #FF2833;
          }
        }

        .r{
          h1{
            color: #FF2833;
          }
        }
      }

      &.suc{
        .r{
          h1{
            em{
              color: #FF2833;
            }
          }
        }
      }
      &.fail{
        .r{
          h1{
            em{
              color: #15ACB7;
            }
          }
        }
      }
    }
  }
}

.p-400{
  height: calc(100vh - 705px);
  padding: 300px 0;
}

</style>
