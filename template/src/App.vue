<template>
    <v-app id="inspire">
        <v-navigation-drawer
                persistent
                clipped
                v-model="drawer"
                enable-resize-watcher
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
        <v-toolbar color="blue-grey" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Dashboard, US Pacific Time: \{{ustime}}</v-toolbar-title>
        </v-toolbar>
        <main>
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
        </main>
        <v-footer color="indigo" app>
            <span class="white--text">&copy;\{{ new Date().getFullYear() }} BecauseQA. All rights reserved.</span>
        </v-footer>
    </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: true,
      now: Date.now()
    }),
    computed: {
      ustime: function () {
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
    mounted () {
      this.changeTime()
    }
  }
</script>
