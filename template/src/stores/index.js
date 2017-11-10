/*
 * Copyright (c) 2017. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
// different modules, changed it here
import release from './modules/release'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const stores = () => {
  return new Vuex.Store({
    actions,
    getters,
    modules: {
      release:release
    },
    strict: debug
  })
}

export default stores
