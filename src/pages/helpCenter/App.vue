<template>
  <div class="wrapper">
    <div v-if="marqueeContent.length > 0" class="marquee-wrapper">
      <div class="notice"><i class="iconfont mb-notice1"></i></div>
      <marquee-text :speed="speed" class="marquee-container">
        {{ marqueeContent }}
      </marquee-text>
    </div>
    <div class="header" :class="{ 'marquee-exist': marqueeContent.length > 0 }">
      <img src="../../assets/images/helpCenter/head_bg.png" alt="">
    </div>
    <div class="content">
      <div class="question-list">
        <div v-for="(item, index) in questionList" :key="index">
          <div @click="openDetail(item)" :class="{ 'border-b-1px': (index !== questionList.length - 1) }" class="question-item f-row f-justify-between f-align-start">
            <div class="q-icon">
              <img src="../../assets/images/helpCenter/q.png" alt="">
            </div>
            <div class="question-cont f-cover">
              <div class="title">{{ item.title }}</div>
              <div v-if="item.active" class="text">{{ item.content }}</div>
            </div>
            <div class="arrow-icon">
              <img :class="{ 'active': item.active }" src="../../assets/images/helpCenter/arrow_right.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div @click="openKefu" class="footer f-row f-justify-center f-align-center">
      <img class="kefu-icon" src="../../assets/images/helpCenter/kefu.png" alt="">
      <span class="text">在线客服</span>
    </div>
  </div>
</template>

<script>
import { Toast } from '@/utils/util'
import axios from '@/config/axiosSign'
const MarqueeText = () => import('@/components/Marquee/MarqueeText.vue')
export default {
  components: {
    MarqueeText
  },
  props: {},
  data() {
    return {
      marqueeContent: '',
      questionList: []
    }
  },
  computed: {},
  created() {
  },
  mounted() {
    this.loadMarquee()
    this.loadData()
  },
  methods: {
    loadData() {
      this.$_loading.show({
        loadingType: 'img-gif',
        contentBgColor: 'rgba(243, 243, 245, 1)'
      })
      axios.get(`/helpCenter`).then((res) => {
        // console.log(res)
        this.$_loading.hide()
        this.questionList = this.handleQuestions(res)
      }).catch((err) => {
        console.log(err)
        this.$_loading.hide()
        Toast('网络出错')
      })
    },
    handleQuestions(res) {
      let tempList = []
      res.forEach((item, index) => {
        tempList = tempList.concat(item.questions)
      })
      tempList.forEach((item, index) => {
        item.active = false
      })
      return tempList
    },
    openKefu() {
      console.log('open kefu')
      window.GOD && window.GOD.go && window.GOD.go('ququqian://app/consult')
    },
    openDetail(item) {
      // console.log(item)
      if (!item.active) {
        axios.post('/helpCenter/read', {
          questionId: item.id
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            // 'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((res) => {
          // console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }
      item.active = !item.active
    },
    loadMarquee() {
      axios.get(`/helpCenter/marquee`).then((res) => {
        console.log(res)
        this.marqueeContent = res.content
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  margin: 0 0;
  .header{
    width: 100%;
    img{
      width: 100%;
    }
  }
  .header.marquee-exist{
    margin-top: 72px;
  }
  .content{
    position: relative;
    top: -42px;
    border-radius: 30px 30px 0 0;
    background:rgba(255,255,255,1);
    padding-bottom: 156px;
    .question-list{
      margin: 0 45px 0 40px;
      .question-item{
        padding: 60px 0;
        .q-icon{
          margin: 0 30px 0 0;
          img{
            width: 60px;
          }
        }
        .question-cont{
          .title{
            margin-top: 4px;
            font-size: 42px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(102,102,102,1);
          }
          .text{
            margin-top: 60px;
            font-size: 45px;
            font-family: PingFangSC-Regular;
            font-weight:400;
            color: rgba(54,54,54,1);
            line-height: 67px;
          }
        }
        .arrow-icon{
          padding: 0 0 0 45px;
          img{
            width: 36px;
            transition: transform 0.2s linear;
            transform: rotate(0deg);
          }
          img.active{
            transition: transform 0.2s linear;
            transform: rotate(90deg);
          }
        }
      }
    }
  }
  .footer{
    height: 146px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,1);
    box-shadow: 10px 0px 20px 0px rgba(156,31,0,0.1);
    z-index: 999;
    .kefu-icon{
      width: 60px;
    }
    .text{
      margin: 0 0 0 30px;
      font-size: 42px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(54,54,54,1);
    }
  }
}

.marquee-wrapper{
  line-height: 72px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 0 0 100px;
  background: #ffebb1;
  z-index: 999;
  .notice{
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    padding: 0 25px 0;
    background: #ffebb1;
    color: #ff864a;
    z-index: 10;
    i{
      display: inline-block;
      margin-top: 4px;
      font-size: 50px;
    }
  }
}
.marquee-container{
  padding: 26px 0 30px;
  background: #ffebb1;
  color: #ff864a;
  font-size: 42px;
  letter-spacing: 4px
}
</style>
