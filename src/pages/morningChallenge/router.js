import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const getPage = name => {
  return resolve => require([`./${name}.vue`], resolve)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: getPage('Index')
    },
    {
      path: '/mine',
      name: 'mine',
      component: getPage('Mine')
    },
    {
      path: '/pay',
      name: 'pay',
      component: getPage('Pay')
    }
  ]
})
