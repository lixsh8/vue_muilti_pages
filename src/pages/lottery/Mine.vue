<template>
  <div class="containter">
    <!-- 头部 -->
    <div class="header">
      <div
        class="l"
        @click="back"
      ></div>
      <div class="title">我的投注</div>
      <!-- <div
        class="r"
        @click="jump('/lotteryRule.html')"
      >活动规则</div> -->
      <div class="r" @click="jump('/lotteryRule.html')">活动规则</div>
    </div>

    <load-more
      :on-infinite="onInfinite"
      :enable-infinite="enableInfinite"
      :bottomDistance="60"
    >

      <div class="list" v-if="list&&list.length>0">

        <div :class="item.show?'item show':'item '"
          v-for="(item, index) in list"
          :key="item.issueId"
          >
          <div :class="item.state==1?'tag award':item.state==2?'tag none':'tag'"></div>
          <div class="item-hd">
            <div class="l">
              <span class="issue">{{item.issueDesc}}</span><span class="time">{{item.openDate}}</span>
            </div>
            <div
              class="r"
              @click="showDetail(index,'more')"
            ></div>
          </div>
          <div class="item-bd">
            <div class="summ">
              <div
                :class="item1.num=='more'?'ball ball-more':item.state=='0'?'ball active':item1.isAward=='1'&&item.state=='1'?'ball active':'ball'"
                v-for="item1 in item.betNumShort"
                :key="item1"
                @click="showDetail(index,item1.num)"
              >
                <span v-if="item1.num!='more'">{{item1.num}}</span>
              </div>
            </div>

            <div class="detail">
              <div class="detail-wrap">
                <div class="h1">投注号码：<span>共{{item.betTotalCount}}注</span></div>
                <div class="detail-list">
                  <div
                    class="detail-item"
                    v-for="item2 in item.betNum"
                    :key="item2"
                  >
                    <div
                    :class="item.state=='0'?'ball active':item2.isAward=='1'&&item.state=='1'?'ball active':'ball'"
                    >
                    <span>{{item2.num}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="h5">我瓜分的奖金 <span>{{item.bonus}}<em>元</em></span></div>
              <div class="h6">中奖注数 <span>{{item.betCount}}<em>注</em></span></div>
            </div>
          </div>
        </div>

      </div>
      <!-- 没有更多 -->
      <div
        v-if="!hasMore && list&&list.length > 0"
        class="no-more"
      >没有更多数据了</div>
    </load-more>

    <div class="nodata-panel">
      <!-- 没有数据 -->
      <none-data
        v-if="list&&list.length < 1"
        class="none-data"
      />
    </div>
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
      show: false,
      next: 0,
      hasMore: true,
      list: []
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
        .get(`/lottery/myBet?token=${this.token}&next=${this.next}`)
        .then(res => {
          // console.log(res)
          this.list = this.list.concat(res.data);
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

    // 切换显示隐藏
    showDetail(idx, type) {
      // this.list[idx].show = !this.list[idx].show
      if (type === 'more') {
        this.$set(this.list[idx], 'show', !this.list[idx].show)
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
// header
.header {
  padding-top: 60px;
  height: 132px;
  position: relative;
  background: #fff;
  z-index: 3;

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

// 列表数据
.list {
  padding-top: 192px;

  .item {
    width: 990px;
    margin: 45px auto 0;
    padding: 85px 0 81px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 10px 20px 0px rgba(136, 136, 136, 0.15);
    border-radius: 30px;
    position: relative;
    box-sizing: border-box;

    .tag {
      width: 144px;
      height: 129px;
      position: absolute;
      top: 0;
      left: 0;
      background: url(../../assets/images/lottery/tag_waiting.png) no-repeat
        center;
      background-size: cover;
    }
    .award.tag {
      background: url(../../assets/images/lottery/tag_zj.png) no-repeat center;
      background-size: cover;
    }
    .none.tag {
      background: url(../../assets/images/lottery/tag_none.png) no-repeat center;
      background-size: cover;
    }

    .item-hd {
      padding: 0px 120px 83px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      position: relative;

      .l {
        flex: 1;

        .issue {
          font-size: 54px;
          font-weight: 600;
          color: rgba(54, 54, 54, 1);
          line-height: 54px;
        }
        .time {
          padding-left: 15px;
          font-size: 42px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 42px;
        }
      }
      .r {
        position: absolute;
        top: -28px;
        right: 45px;
        width: 84px;
        height: 120px;
        background: url(../../assets/images/lottery/arr_r_gray.png) no-repeat
          center;
        background-size: 37px 36px;
        transform: rotate(90deg);
      }
    }

    .item-bd {
      // 缩略图
      .summ {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 45px;

        .ball {
          width: 100px;
          height: 100px;
          margin-right: 57px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url(../../assets/images/lottery/ball_blue_2.png) no-repeat
            center bottom;
          background-size: contain;

          &:last-child{
            margin-right: 0;
          }

          span {
            font-size: 60px;
            font-family: DIN-Bold, DIN;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 60px;
          }
        }
        .active.ball {
          background: url(../../assets/images/lottery/ball_blue.png) no-repeat
            center bottom;
          background-size: contain;
        }
        .ball-more {
          background: url(../../assets/images/lottery/ball_more.png) no-repeat
            center bottom;
          background-size: contain;
        }
      }

      // 详情展开
      .detail {
        display: none;
        .detail-wrap {
          width: 900px;
          margin: 0 auto;
          padding: 60px 30px;
          box-sizing: border-box;
          background: rgba(249, 249, 249, 1);

          .h1 {
            font-size: 42px;
            font-weight: 400;
            color: rgba(54, 54, 54, 1);
            line-height: 42px;

            span {
              font-weight: bold;
            }
          }

          .detail-list {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;

            .detail-item {
              width: 16.6666667%;

              .ball {
                margin: 45px auto 0;
                width: 100px;
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: url(../../assets/images/lottery/ball_blue_2.png)
                  no-repeat center bottom;
                background-size: contain;

                span {
                  font-size: 60px;
                  font-family: DIN-Bold, DIN;
                  font-weight: bold;
                  color: rgba(255, 255, 255, 1);
                  line-height: 60px;
                }
              }
              .active.ball {
                background: url(../../assets/images/lottery/ball_blue.png)
                  no-repeat center bottom;
                background-size: contain;
              }
            }
          }
        }

        .h5 {
          padding-left: 45px;
          padding-top: 45px;
          font-size: 42px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 42px;

          span {
            font-size: 42px;
            font-family: DIN-Medium, DIN;
            font-weight: 500;
            color: rgba(255, 54, 54, 1);
            line-height: 42px;

            em {
              font-size: 30px;
            }
          }
        }
        .h6 {
          padding-left: 45px;
          padding-top: 45px;
          font-size: 42px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 42px;

          span {
            font-size: 42px;
            font-family: DIN-Medium, DIN;
            font-weight: 500;
            color: rgba(54, 54, 54, 1);
            line-height: 42px;

            em {
              font-size: 30px;
            }
          }
        }
      }
    }

    // 展开
    &.show {
      .item-hd {
        .r {
          transform: rotate(-90deg);
        }
      }
      .summ {
        display: none;
      }
      .detail {
        display: block;
      }
    }
  }
}

.p-400 {
  height: calc(100vh - 705px);
  padding: 300px 0;
}
.nodata-panel{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width:990px;
  margin: 45px auto;
  height: calc(100vh - 282px);
  background:rgba(255,255,255,1);
  box-shadow:0px 10px 20px 0px rgba(136,136,136,0.15);
  border-radius:30px;
}
</style>
