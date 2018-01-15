<!--
  - The MIT License (MIT)
  -
  - Copyright (c) 2017 Becauseqa.Inc.
  -
  - Permission is hereby granted, free of charge, to any person obtaining a copy
  - of this software and associated documentation files (the "Software"), to deal
  - in the Software without restriction, including without limitation the rights
  - to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  - copies of the Software, and to permit persons to whom the Software is
  - furnished to do so, subject to the following conditions:
  -
  - The above copyright notice and this permission notice shall be included in all
  - copies or substantial portions of the Software.
  -
  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  - IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  - FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  - AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  - LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  - OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  - SOFTWARE.
  -
  -->

<template>
    <div class="loading-container" v-show="status">
        <div class="loading-backdrop"></div>
        <div class="loading">
            <div class="loading-icon">
                <img :src="url" v-if="url"/>
                <div v-if="!url && html" v-html="html"></div>
            </div>
            <div class="loading-label">\{{message}}</div>
        </div>
    </div>
</template>

<script>
    //参考 https://github.com/sergeyloysha/vue-spinner-component/blob/master/src/Spinner.vue
    import loadingImage from '@/assets/img/loading.gif'

    export default {
        name: 'BlockUI',
        props: {
            status: {
                type: Boolean,
                default: true
            },
            url: {
                type: [Object, String],
                default: loadingImage
            },
            html: {
                type: String,
                default: ''
            },
            message: {
                type: String,
                default: 'loading...'
            }
        }
    }
</script>

<style scoped>
    .loading-container {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        text-align: center;
    }

    .loading-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: lightgray;
        opacity: 0.5;
        z-index: 9998;
    }

    .loading {
        z-index: 9999;
        position: fixed;
        display: inline-block;
        background-color: white;
        padding: 20px 50px;
        border-radius: 12px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        left: 50%;
        top: 50%;
        -ms-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .loading-icon {
        margin-bottom: 8px;
    }
</style>
