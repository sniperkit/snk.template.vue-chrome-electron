/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Becauseqa.Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
// Vue core, vue,vue-router,vuex
import '@/assets/css/style.css'  //move into the App.vue file
import Vue from 'vue'
import {createRouter} from '@/routers'
import App from './App'
import store from '@/stores'

// Animation progressbar, http://www.cnblogs.com/rlann/p/7192535.html
import 'animate.css/animate.min.css'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

// UI, Vuetify
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

// HttpRequest, axios
import https from 'https'
import Axios from 'axios'

// ---------------------------plugins-----------------------------------
// 1.Offline-plugin OfflinePluginRuntime plugin only in production
const isProd = process.env.NODE_ENV === 'production'
if (isProd) require('offline-plugin/runtime').install()
// 2. vue-upload-component:
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
// ---------------------------------------Axios configuration--------------------
// 1. Axios configuration
const axios = Axios.create()
const Agent = new https.Agent({
    rejectUnauthorized: false
})
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
    console.debug('[XHR-axios] Request: ', config)
    NProgress.start()
    return config
}, err => {
    return Promise.reject(err)
})

axios.interceptors.response.use(config => {
    console.debug('[XHR-axios] Response: ', config)
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

// ---------------------------------------------------------------------------------------------------------
Vue.use(Vuetify)

Vue.prototype.$progress = NProgress
Vue.prototype.$http = axios

//****************************************Vue-Router*************************************************************************
const router = createRouter()
router.beforeEach((to, from, next) => {
    NProgress.start()
    // google analysis
    next()
})
router.afterEach((to, from, next) => {
    NProgress.done()
})
//****************************************Vue-Router*************************************************************************
Vue.config.productionTip = false
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
