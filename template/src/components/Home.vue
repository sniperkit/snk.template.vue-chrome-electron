<template>
    <div>
        <ul>
            <li>Demo for vue renderer: \{{ msg }}</li>
            <li>Demo for static image: <img src="/statics/img/react-38.png" alt="react image"></li>
            <li>Demo for vuetify component: <br>
                <v-btn color="primary" light @click.native.prevent="fetchLocationInfo">点击我显示我的IP</v-btn>
                <transition
                        name="custom-classes-transition"
                        mode="in-out"
                        enter-active-class="animated fadeInRight"
                        leave-active-class="animated fadeOutLeft">
                    <h4>Your IP: \{{ip}}, Your city: \{{city}}, latitude: \{{latitude}}, longitude: \{{longitude}}</h4>
                </transition>

            </li>
            <li>
                Demo for axios features, Latest Vuejs Version: <b>\{{latestReleaseVersion}}</b>,Release Date: \{{releaseDate}}<br>
                Changes: <b>\{{latestReleaseNote}}</b>
            </li>
            <li>Demo for routerlink: <a href="/about">About Page</a></li>
        </ul>


    </div>
</template>

<script>
    import getLocationInfo from '@/utils/LocationInfoUtils'

    export default {
        name: 'Home',
        data() {
            return {
                msg: 'Welcome to BecauseQA Web App',
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
                const url = 'https://freegeoip.net/json/?'+new Date().getTime()
                this.$http.get(url)
                    .then((response) => {
                        const data = response.data
                        console.log('LocationInfo: ' + data)
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
                const latestRleaseUrl = 'https://api.github.com/repos/vuejs/vue/releases/latest'
                this.$http.get(latestRleaseUrl).then((response) => {
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
