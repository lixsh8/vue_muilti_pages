import MD5 from 'blueimp-md5'
import Axios from 'axios'
import config from './env.js'
// import { isWeiXin } from '../utils/util'

axios = Axios.create({
  baseURL: config.baseURL,
  timeout: 30000
})

// 请求拦截
axios.interceptors.request.use(function (config) {
  // console.log(config)
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  // 加上设备号Device-Id
  config.headers['Device-Id'] = (window.GOD && window.GOD.getDeviceId && window.GOD && window.GOD.getDeviceId()) || ''
  // 接口不加签名，自行设置{ headers: { 'No-Sign': true }}
  if (config.headers['No-Sign']) {
    return config
  }

  let accessURL = config.baseURL + config.url
  let routeURL = config.url
  let time = Date.parse(new Date()) / 1000
  if (accessURL.indexOf('?') !== -1) {
    accessURL += '&ts=' + time
    routeURL += '&ts=' + time
  } else {
    accessURL += '?ts=' + time
    routeURL += '?ts=' + time
  }

  let accessSign = ''
  // get 请求
  if (config.method === 'get') {
    accessSign = window.GOD && window.GOD.sign ? window.GOD.sign(config.method, accessURL, '') : ''
  }

  // post请求
  if (config.method === 'post') {
    // console.log(config.data);
    if (config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('application/json') !== -1) {
      let jsonStr = JSON.stringify(config.data)
      config.data = jsonStr
      accessSign = window.GOD && window.GOD.sign ? window.GOD.sign(config.method, accessURL, MD5(jsonStr)) : ''
    }

    if (config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1) {
      let postStr = ''
      let postArr = Object.keys(config.data)
      postArr.forEach((key, index) => {
        postStr += (key + '=' + config.data[key])
        if (index > 0 || index < (postArr.length - 1)) {
          postStr += '&'
        }
      })
      // 截掉最后一个&
      if (postStr[postStr.length - 1] === '&') {
        postStr = postStr.substring(0, postStr.length - 1);
      }
      config.data = postStr
      accessSign = window.GOD && window.GOD.sign ? window.GOD.sign(config.method, accessURL, MD5(postStr)) : ''
    }

    // multipart/form-data 类型暂时不加sign
    if (config.headers['Content-Type'] && config.headers['Content-Type'] === 'multipart/form-data') {
      // console.log('form')
      // accessSign = window.GOD && window.GOD.sign ? window.GOD.sign(config.method, accessURL, MD5(config.data.FormData)) : ''
    }
  }

  // 如果是开发环境就加上免testToken
  if (process.env.NODE_ENV === 'development') {
    routeURL += '&testToken=testToken'
  }
  // 在超级淘接口上测试:
  // config.headers['X-M'] = 'wx_2e3f126903bbc50bd61ab992266129d5'
  // config.headers['X-TOKEN'] = 'd1ac92de0d58efcbc587c1bbe587d42d'
  // config.headers['X-TIMESTAMP'] = '1569218098289'

  config.url = routeURL + '&sign=' + accessSign
  // console.log(config.url)
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应
axios.interceptors.response.use(function (response) {
  if (response.status && response.status === 200) {
    // alert('res----' + JSON.stringify(response))
    return response.data
  } else {
    return Promise.reject(response)
  }
}, function (error) {
  // if (error.response.status === 401 && isWeiXin()) {
  //   console.log(isWeiXin())
  //   window.location.href = error.response.data.url
  //   return
  // }
  // alert('error----' + JSON.stringify(error))
  return Promise.reject(error)
})

export default axios
