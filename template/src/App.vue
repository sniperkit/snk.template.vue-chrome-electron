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
    <v-app>
        <v-navigation-drawer
                fixed
                :clipped="$vuetify.breakpoint.width > 1264"
                v-model="drawer"
                app
        >
            <v-list dense>
                <v-list-tile exact :to="{name:'Home'}">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Home</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile exact :to="{name:'Login'}">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Login</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile exact :to="{name:'TableGrid'}">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Table Grid</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile exact :to="{name:'HotRelease'}">
                    <v-list-tile-action>
                        <v-icon>contact_mail</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Hot Release</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="blue-grey" dark fixed app clipped-left>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'"
                             class="ml-0 pl-3">{{name}}
            </v-toolbar-title>
            <v-text-field
                    light
                    solo
                    prepend-icon="search"
                    placeholder="Search"
                    style="max-width: 500px; min-width: 128px"
            ></v-text-field>
            <!--<span> US Pacific Time: \{{USTime}}</span>-->
            <div class="d-flex align-center" style="margin-left: auto">
                <v-btn icon>
                    <v-icon>notifications</v-icon>
                </v-btn>
            </div>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <!--详细的使用animate.css https://github.com/daneden/animate.css-->
                <!--Vue 提供了 过渡模式-->
                <!--in-out：新元素先进行过渡，完成之后当前元素过渡离开。-->
                <!--out-in：当前元素先进行过渡，完成之后新元素过渡进入。-->
                <transition
                        name="custom-classes-transition"
                        enter-active-class="animated fadeInRight"
                        leave-active-class="animated fadeOutLeft">
                    <router-view/>
                </transition>

            </v-container>
        </v-content>

        <v-footer color="indigo" app absolute>

            <span class="white--text">&copy;\{{ new Date().getFullYear() }} BecauseQA. All rights reserved </span>
            <v-spacer></v-spacer>
        </v-footer>
    </v-app>
</template>

<script>
    export default {
        data: () => ({
            drawer: false,
            now: Date.now()
        }),
        computed: {
            USTime: function () {
                return new Date(this.now).toLocaleString('en-US', {timeZone: 'America/Los_Angeles'})
            }
        },
        methods: {
            changeTime: function () {
                const self = this
                setInterval(function () {
                    self.now = Date.now()
                }, 1000)
            }
        },
        mounted() {
            this.changeTime()
        }
    }
</script>
<style>
    /*NOTICE: the proxy setting, otherwise it will not get correct data*/
    /*@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');*/
    @import url('https://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.min.css');
</style>
