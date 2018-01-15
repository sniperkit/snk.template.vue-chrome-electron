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
    <!--
    v-layout:
    justify-center:


    -->
    <v-layout row wrap align-center>
        <v-flex xs10 offset-xs1 wrap>
            <v-card>
                <v-card-text>
                    <v-tooltip right>
                        <v-btn top fab slot="activator">
                            <v-icon large>add</v-icon>
                        </v-btn>
                        <span>Add New Hot Topic</span>
                    </v-tooltip>
                    <v-list threeLine>
                        <v-subheader>\{{header}}</v-subheader>
                        <v-divider></v-divider>
                        <transition-group
                                name="custom-classes-transition"
                                enter-active-class="animated fadeInRight"
                                leave-active-class="animated fadeOutLeft">
                            <template v-for="(item,index) in items">
                                <v-list-tile v-if="items.length" avatar ripple
                                             :key="item.title"
                                             exact
                                             @click="showDetailNotes(item)">
                                    <v-list-tile-avatar>
                                        <v-badge overlay left overlap color="purple" v-model="item.showBadge">
                                            <span slot="badge">1</span>
                                            <v-icon large>new_releases</v-icon>
                                        </v-badge>
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>\{{item.title}} \{{item.tag_name}}
                                        </v-list-tile-title>
                                        <v-list-tile-sub-title class="grey--text text--darken-4">\{{item.published_at}}
                                        </v-list-tile-sub-title>
                                        <v-list-tile-sub-title>\{{item.body.substr(0,100)+'......'}}
                                        </v-list-tile-sub-title>
                                    </v-list-tile-content>

                                </v-list-tile>
                                <v-divider v-if="index + 1 < items.length" :key="item.title"></v-divider>
                                <!--<h4 v-else>Bad Gateway Request</h4>-->
                            </template>

                        </transition-group>
                    </v-list>
                </v-card-text>
                <!--<v-card-actions>-->

                <!--</v-card-actions>-->
            </v-card>
            <v-spinner :status="progress"></v-spinner>

        </v-flex>
    </v-layout>

</template>
<script>
    import VSpinner from '@/components/commons/VSpinner'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {
                header: new Date().toDateString(),
                items: [],
                progress: false
            }
        },
        components: {VSpinner},
        methods: {
            fetchLatestVersion: function () {
                const techs = {
                    Vuejs: 'vuejs/vue',
                    Vuex: 'vuejs/vuex',
                    vuerouter: 'vuejs/vue-router',
                    Vuejswepack: 'vuejs-templates/webpack',
                    Vuetify: 'vuetifyjs/vuetify',
                    Axios: 'axios/axios',
                    Threejs: 'mrdoob/three.js',
                    OKHttp: 'square/okhttp',
                    electron: 'electron/electron',
                    electronBuilder: 'electron-userland/electron-builder',
                    nodejs: 'nodejs/node',
                    Selenium: 'SeleniumHQ/selenium',
                    VSCode: 'Microsoft/vscode',
                    Jackson: 'FasterXML/jackson-core',
                    SpringBoot: 'spring-projects/spring-boot',
                    SpringFramework: 'spring-projects/spring-framework',

                }
                // use authentication header to get more limit rate in github api
                var config = {
                    headers: {'Authorization': 'Basic YWx0ZXJodTIwMjBAZ21haWwuY29tOmd1Y2hhbjEwMjY='}
                }

                for (const tech in techs) {
                    const latestRleaseUrl = `https://api.github.com/repos/${techs[tech]}/tags`
                    this.$http.get(latestRleaseUrl, config).then((response) => {
                        const latestReleaseData = response.data[0]
                        if (latestReleaseData) {
                            const latestTagName = latestReleaseData.name
                            const latestTagUrl = `https://api.github.com/repos/${techs[tech]}/releases/tags/${latestTagName}`
                            this.progress = true
                            this.$http.get(latestTagUrl, config).then((response) => {
                                const latestReleaseData = response.data
                                const latestReleaseDate = latestReleaseData.published_at
                                const releaseDate = new Date(latestReleaseDate).getTime()
                                const currentDate = new Date().getTime()
                                const oneDay = 24 * 60 * 60 * 1000
                                const days = Math.round(Math.abs((currentDate - releaseDate) / (oneDay)))
                                if (days <= 7) {
                                    latestReleaseData.showBadge = true
                                } else {
                                    latestReleaseData.showBadge = false
                                }
                                latestReleaseData.title = tech
                                this.items.push(latestReleaseData)
                                this.progress = false
                            }).catch((error) => {
                                this.progress = false
                                console.log(`exception occurred with error ${error}`)
                            })

                        }

                    })

                }
                // sort the data
                this.items.sort(function (firstData, secondData) {
                    return Date.parse(secondData.published_at) - Date.parse(firstData.published_at)
                })
            },
            showDetailNotes: function (item) {
                console.log('item body is ' + item)
                this.$store.dispatch('updateCurrentReleaseAction', item)
                this.$router.push({name: 'hotreleasedetail'})
            }
        },
        created() {
            this.fetchLatestVersion()
        }
    }
</script>
