// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import '@/style/style.less'
import '@/style/common.less'
import Loading from '@/components/Loading/index.js'
import router from './router'

Vue.config.productionTip = false

Vue.use(Loading)

// /* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<App/>'
})
