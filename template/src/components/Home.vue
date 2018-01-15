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
    <v-layout justify-center align-center>
        <ul>
            <li>Demo for vue renderer: \{{ msg }}</li>
            <li>Demo for static image from <b>/static</b> folder(<b>Not worked for subfolder in production like:
                http://www.host/demo/</b>): /static/img/48.png<img
                    src="/static/img/48.png" alt="react image"></li>
            <li>Demo for static image from <b>/assets/img</b> folder <b>url-loader using here</b>:~@/assets/img/test.png
                <img
                        src="~@/assets/img/test.png" alt="react image"></li>
            <li>Demo for static image from <b>/assets/img</b> folder using es6 <b>url-loader using here</b>: import
                assetImage from '@/assets/img/test.png' <img
                        :src="img" alt="react image"></li>
            <li>Demo for vuetify component: <br>
                <v-btn color="primary" light @click.native.prevent="fetchLocationInfo">SHOW My IP</v-btn>
                <transition
                        name="custom-classes-transition"
                        mode="in-out"
                        enter-active-class="animated fadeInRight"
                        leave-active-class="animated fadeOutLeft">
                    <h4>Your IP: \{{ip}}, Your city: \{{city}}, latitude: \{{latitude}}, longitude: \{{longitude}}</h4>
                </transition>

            </li>
            <li>
                Demo for axios features, Latest Vuejs Version: <b>\{{latestReleaseVersion}}</b>,Release Date:
                \{{releaseDate}}<br>
                Changes: <b>\{{latestReleaseNote}}</b>
            </li>
            <li>Demo for routerlink: <a href="/hot">Find Hot Release</a></li>
        </ul>


    </v-layout>
</template>

<script>
    import getLocationInfo from '@/utils/LocationInfoUtils'
    import assetImage from '@/assets/img/test.png'

    export default {
        name: 'home',
        data() {
            return {
                msg: 'Welcome to {{name}} App',
                img: assetImage,
                ip: null,
                city: null,
                latitude: null,
                longitude: null,
                requestIntervalId: null,
                latestReleaseVersion: null,
                releaseDate: null,
                latestReleaseNote: ''
            }
        },
        methods: {
            fetchLocationInfo: function () {
                const url = 'https://freegeoip.net/json/?' + new Date().getTime()
                this.$http.get(url)
                    .then((response) => {
                        const data = response.data
                        // console.log('LocationInfo: ' + data)
                        this.ip = data.ip
                        this.city = data.city
                        this.latitude = data.latitude
                        this.longitude = data.longitude
                    }).catch((error) => {
                    if (error) {
                        console.log(error.stack)
                    }
                })

            },
            fetchLatestRelease: function () {
                var config = {
                    headers: {'Authorization': 'Basic YWx0ZXJodTIwMjBAZ21haWwuY29tOmd1Y2hhbjEwMjY='}
                }
                const latestRleaseUrl = 'https://api.github.com/repos/vuejs/vue/releases/latest'
                this.$http.get(latestRleaseUrl,config).then((response) => {
                    this.latestReleaseVersion = response.data.tag_name
                    this.latestReleaseNote = response.data.body
                    this.releaseDate = response.data.published_at
                })
            }
        },
        mounted() {
            const intervalTime = 60 * 1000
            const self = this
            // get host news
            this.fetchLatestRelease()
            this.requestIntervalId = setInterval(function () {
                self.fetchLatestRelease()
            }, intervalTime)
        },
        beforeDestroy() {
            clearInterval(this.requestIntervalId)
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
