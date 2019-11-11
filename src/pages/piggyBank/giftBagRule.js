import '@/style/style.less'
import '@/style/common.less'
import '@/style/piggyBank/giftBagRule.less'

window.onload = function () {
  document.getElementById('download_btn').onclick = function (e) {
    console.log([e, 'download'])
  }
}
