/*
 * Copyright (c) 2017. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
// Pages with lazy reloading,Vue-Router 懒加载,这样会导致chunkFileName多生成js文件
// see: https://vuejsdevelopers.com/2017/07/08/vue-js-3-ways-code-splitting-webpack/
// const Home = resolve => require(['@/components/Home'], resolve)
// const HotRelease = resolve => require(['@/components/HotRelease'], resolve)
// const HotReleaseDetail = resolve => require(['@/components/HotReleaseDetail'], resolve)

const routers = [
  {
    name: 'Home',
    path: '/',
    component: view('Home')
  },
  {
    name: 'HotRelease',
    path: '/hot',
    component: view('HotRelease')
  },
  {
    name: 'HotReleaseDetail',
    path: '/hotdetail',
    component: view('HotReleaseDetail')
  },
  {
    name: 'globalException',
    path: '*',
    redirect: '/'
  }
]

/**
 * The common vue-router function to get the component page
 * https://router.vuejs.org/en/advanced/lazy-loading.html
 * @param componentName
 * @returns {function(): *}
 */
function view (componentName) {
  let chunkName = componentName
  if (componentName.indexOf('/') !== -1) {
    chunkName = componentName.replace(new RegExp('/', 'g'), '_')
  }
  console.log(`Not used chunk name is: ${chunkName}`)
  // const view = r => require.ensure([], () => r(require(`@/components/${componentName}`)), chunkName)
  const view = () => import(/* webpackChunkName: "lazyRouterChunk" */ `@/components/${componentName}`)
  return view
}

export default routers
