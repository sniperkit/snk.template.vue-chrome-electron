/*
 * Copyright (c) 2017. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

import * as types from '../mutation-types'
// 1. initial state
const state = {
  releaseItem: {}
}

//2. init the local getter
const getters = {
  getCurrentReleaseNote: state => state.releaseItem
}

//3. local mutations 业务独立
const mutations = {
  [types.UPDATE_CURRENT_RELEASE] (state, releaseItem) {
    console.log(`previous body is ${state.releaseItem}, now body need change to ${releaseItem}`)
    state.releaseItem = releaseItem
  }
}

//4. actions
const actions = {
  updateCurrentReleaseAction ({commit, state}, releaseItem) {
    commit(types.UPDATE_CURRENT_RELEASE, releaseItem)
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
