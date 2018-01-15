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
