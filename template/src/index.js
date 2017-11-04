/*
 * Copyright (c) 2017. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
import Vue from 'vue'

// import log from '@/utils/LoggerUtils.js'
// http://www.cnblogs.com/rlann/p/7192535.html
import 'animate.css/animate.min.css'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

import https from 'https'
import Axios from 'axios'

import VueRouter from 'vue-router'
import routes from '@/routers'
import App from './App'


//配置nprogress
NProgress.inc(0.2)
NProgress.configure({
    minimum: 0.1,
    easing: 'linear',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleSpeed: 200,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
})
Vue.prototype.$progress = NProgress
console.log('NProgress finished settings...')
// ---------------------------------------Vuetify
Vue.use(Vuetify)
// ---------------------------------------Axios
// 1. Axios configuration
const Agent = new https.Agent({
    rejectUnauthorized: false
})
const axios = Axios.create()
// axios.defaults.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
axios.defaults.httpsAgent = Agent
// Cross Domain request
axios.defaults.timeout = 54500

// If cookies/authorisation headers or TLS client certificates are required, send allowCredentials to true for the Axios request.
// 带cookie请求
// axios.defaults.withCredentials = true

// if (req.headers.cookie) {
//   axios.defaults.headers.common['cookie'] = req.headers.cookie
// }
// request and response
axios.interceptors.request.use(config => {
    // config.headers.Authorization = token
    console.log('[XHR-axios] Request: ', config)
    NProgress.start()
    return config
}, err => {
    return Promise.reject(err)
})

axios.interceptors.response.use(config => {
    console.log('[XHR-axios] Response: ', config)
    NProgress.done()
    return config
}, function (error) {
    // const originalRequest = error.config

    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true

    //   const refreshToken = window.localStorage.getItem('refreshToken')
    //   return axios.post('http://localhost:8000/auth/refresh', { refreshToken })
    //     .then(({ data }) => {
    //       window.localStorage.setItem('token', data.token)
    //       window.localStorage.setItem('refreshToken', data.refreshToken)
    //       axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token
    //       originalRequest.headers['Authorization'] = 'Bearer ' + data.token
    //       return axios(originalRequest)
    //     })
    // }
    NProgress.done()
    return Promise.reject(error)
})
Vue.prototype.$http = axios
// -------------------------------------------
Vue.config.productionTip = false
//****************************************Vue-Router*************************************************************************
Vue.use(VueRouter)
const basePath = __dirname
//const basePath='/vuejs' // when deploy into production for subdirectory,change this to your need
const router = new VueRouter({base: basePath, mode: 'history', routes: routes})

//beforeeach for router
router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})
router.afterEach((to, from, next) => {
    NProgress.done()
})
//****************************************Vue-Router*************************************************************************
new Vue({
    el: '#app',
    // store,
    router,
    render: h => h(App)
})
