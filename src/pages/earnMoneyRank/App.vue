<template>
  <div class="wrapper">
    <load-more :on-infinite="onInfinite" :enable-infinite="enableInfinite" :bottomDistance="60">
      <div class="w-content">
        <div ref="header" class="head">
          <img src="../../assets/images/rank/head_bg.png" alt="">
          <div class="menu-cont">
            <div class="menu-row f-row f-jusity-between f-align-end">
              <div class="menu-item" :class="{ 'active': type === '1' }" @click="changeType('1')">日排行榜<span v-if="type === '2'" class="split-line"></span></div>
              <div class="menu-item" :class="{ 'active': type === '3' }" @click="changeType('3')">历史总榜<span v-if="type === '1'" class="split-line"></span></div>
              <div class="menu-item" :class="{ 'active': type === '2' }" @click="changeType('2')">周排行榜</div>
            </div>
          </div>
        </div>
        <div  id="list_content" class="list" :style="'min-height: ' + listMinHeight + 'px'">
          <div v-if="list.length > 0" class="item-row avtive-bg">
            <div class="item-col f-row f-jusity-start f-align-center">
              <div class="number" :class="{ 'desc': !(parseInt(self.position) >= 0) }">{{ self.position }}</div>
              <div class="userinfo f-row f-jusity-start f-align-center">
                <div class="img-c">
                  <img class="avatar" :src="self.avatar" alt="">
                </div>
                <div class="username">{{ self.nickname }}</div>
              </div>
              <div class="value-c f-cover">
                <span class="money">{{ self.amount }}</span>
                <span class="text">元</span>
              </div>
            </div>
          </div>
          <div class="item-row" v-for="(item, index) in list" :key="index">
            <div class="item-col f-row f-jusity-start f-align-center border-b-1px">
              <div class="number" :class="{ 'desc': !(parseInt(item.position) >= 0), 'active': index < 3 }">{{ item.position }}</div>
              <div class="userinfo f-row f-jusity-start f-align-center">
                <div class="img-c">
                  <img v-if="index === 0" class="crown" src="../../assets/images/rank/gold_crown.png" alt="">
                  <img v-if="index === 1" class="crown" src="../../assets/images/rank/silver_crown.png" alt="">
                  <img v-if="index === 2" class="crown" src="../../assets/images/rank/copper_crown.png" alt="">
                  <img class="avatar" :src="item.avatar" alt="">
                </div>
                <div class="username">{{ item.nickname }}</div>
              </div>
              <div class="value-c f-cover">
                <span class="money">{{ item.amount }}</span>
                <span class="text">元</span>
              </div>
            </div>
          </div>
          <div v-if="!hasMore && list.length > 0" class="no-more">没有更多数据了</div>
          <none-data v-if="!hasMore && list.length < 1" class="none-data" />
        </div>
      </div>
    </load-more>
  </div>
</template>

<script>
import LoadMore from '@/components/Loadmore'
import NoneData from '@/components/NoneData'
import axios from '@/config/axiosSign'
import { Toast } from '@/utils/util'
export default {
  components: {
    LoadMore,
    NoneData
  },
  props: {},
  data() {
    return {
      headerHeight: 200,
      type: '3',
      userId: '',
      self: {
        position: '',
        avatar: '',
        nickname: '',
        amount: ''
      },
      list: [],
      enableInfinite: true,
      hasMore: true,
      next: 1
    }
  },
  computed: {
    listMinHeight() {
      return document.body.clientHeight - this.headerHeight - 30
    }
  },
  created() {
    // this.$_loading.show({
    //   loadingType: 'img-bounce',
    //   bgColor: 'rgba(255, 255, 255, 0)',
    //   contentBgColor: 'rgba(0, 0, 0, 0)',
    //   color: '#ffa396'
    // })
    this.userId = window.GOD && window.GOD.getUid ? window.GOD.getUid() : ''
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData(done) {
      if (this.next < 2) {
        this.$_loading.show({
          loadingType: 'img-gif',
          contentBgColor: 'rgba(243, 243, 245, 1)'
        })
      }
      axios.get(`/pot/ranking?userId=${this.userId}&type=${this.type}&next=${this.next}`).then(res => {
        // console.log(res)
        this.self = {
          position: res.position,
          avatar: res.avatar,
          nickname: res.nickname,
          amount: res.amount
        }
        this.list = this.list.concat(res.items)
        this.next = res.next
        this.hasMore = res.hasMore
        this.$_loading.hide()
        done && done()
        this.headerHeight = this.$refs.header.clientHeight
      }).catch(err => {
        console.log(err)
        this.$_loading.hide()
        this.hasMore = false
        Toast('网络出错', 3000)
        done && done()
        this.headerHeight = this.$refs.header.clientHeight
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
    changeType(type) {
      // 先回到顶部，避免发两次第一页请求数据重复
      // document.querySelector('#list_content').scrollIntoView(true)
      console.log([type, this.type])
      if (type === this.type) {
        return
      }
      this.type = type
      this.list = []
      this.next = 1
      this.hasMore = true
      let _this = this
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        _this.enableInfinite = true
        _this.loadData()
      }, 200)
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  position: relative;
  height: 100%;
  .w-content{
    // 避免列表无法超出整屏，上拉加载不了更多 所以高度加几px
    min-height: calc(100% + 5px);
  }
  .head{
    width: 100%;
    position: relative;
    img{
      width: 100%;
    }
    .menu-cont{
      position: absolute;
      left: 0;
      right: 0;
      bottom: -20px;
      margin: 0 45px;
      .menu-row{
        .menu-item{
          position: relative;
          width: 33.33%;
          height: 150px;
          line-height: 150px;
          background: rgba(238,238,238,1);
          font-size: 42px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(102,102,102,1);
          text-align: center;
          border-radius: 30px 30px 0px 0px;
          .split-line{
            width: 5px;
            height: 36px;
            display: inline-block;
            position: absolute;
            right: -1px;
            top: calc(50% + 2px);
            transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            background:rgba(153,153,153,1);
          }
        }
        .menu-item.active{
          font-size: 48px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(54,54,54,1);
          background: rgba(255,255,255,1);
        }
      }
    }
  }
  .list{
    margin: 20px 45px 60px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 10px 20px 0px rgba(156,31,0,0.1);
    border-radius: 0px 0px 30px 30px;
    .item-row{
      padding: 0 45px;
      .item-col{
        padding: 45px 0;
        .number{
          width: 124px;
          margin-right: 15px;
          font-size: 42px;
          font-family: DIN-Medium,dim_medium;
          font-weight: 500;
          color: rgba(54,54,54,1);
          text-align: center;
        }
        .number.active{
          color:rgba(255,40,51,1);
        }
        .number.desc{
          font-size: 36px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(153,153,153,1);
        }
        .userinfo{
          width: 420px;
          .img-c{
            position: relative;
            width: 120px;
            height: 120px;
            .crown{
              width: 83px;
              height: 54px;
              position: absolute;
              top: -42px;
              left: 50%;
              transform: translateX(-50%);
              -webkit-transform: translateX(-50%);
            }
            .avatar{
              width: 120px;
              height: 120px;
              border-radius: 100%;
            }
          }
          .username{
            margin-left: 30px;
            font-size: 42px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            color: rgba(54,54,54,1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .value-c{
          text-align: right;
          .money{
            font-size: 54px;
            font-family: DIN-Medium,dim_medium;
            font-weight: 500;
            color: rgba(54,54,54,1);
          }
          .text{
            margin-left: -10px;
            font-size: 36px;
            font-family: PingFangSC-Medium;
          }
        }
      }
    }
    .item-row.avtive-bg{
      background: rgba(255, 40, 51, 0.05);
    }
  }
  .none-data{
    padding: 190px 0;
  }
}
</style>
