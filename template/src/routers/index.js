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
// Pages with lazy reloading,Vue-Router 懒加载,这样会导致chunkFileName多生成js文件
// see: https://vuejsdevelopers.com/2017/07/08/vue-js-3-ways-code-splitting-webpack/
// const Home = resolve => require(['@/components/Home'], resolve)
// const HotRelease = resolve => require(['@/components/HotRelease'], resolve)
// const HotReleaseDetail = resolve => require(['@/components/HotReleaseDetail'], resolve)

import Vue from 'vue'
import Router from 'vue-router'
// import ScrollBehavior from './ScrollBehavior'


const meta = require('./meta.json')
const releasePath = process.env.RELEASEPATH


Vue.use(Router)

export function createRouter() {
    const router = new Router({
        base: releasePath ? `/${releasePath}` : __dirname,
        mode: 'history',
        // ScrollBehavior,
        routes: [
            route('/', 'Home'),
            route('/login', 'Login'),
            route('/table', 'TableGrid'),
            route('/hot', 'HotRelease'),
            route('/hotdetail', 'HotReleaseDetail'),
            route('/upload', 'FileUpload'),
            {
                name: 'globalException',
                path: '*',
                redirect: '/'
            }

        ]
    })
    return router
}


const route = function (routePath, componentName) {
    const routeName = componentName.toLowerCase()
    return {
        name: routeName,
        path: routePath,
        meta: meta[routePath],
        component: () => import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazyRoute" */
            `@/components/${componentName}`
            )
    }
}


/**
 * The common vue-router function to get the component page
 * https://router.vuejs.org/en/advanced/lazy-loading.html
 * @param componentName
 * @returns {function(): *}
 */
function view(componentName) {
    let chunkName = componentName
    if (componentName.indexOf('/') !== -1) {
        chunkName = componentName.replace(new RegExp('/', 'g'), '_')
    }
    // console.log(`Not used chunk name is: ${chunkName}`)
    // const view = r => require.ensure([], () => r(require(`@/components/${componentName}`)), chunkName)
    const view = () => import(
        /* webpackChunkName: "routes" */
        /* webpackMode: "lazy" */
        `@/components/${componentName}`
        )
    return view
}

