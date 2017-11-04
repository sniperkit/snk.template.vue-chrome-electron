<template>
    <div id="app">
        <!--详细的使用animate.css https://github.com/daneden/animate.css-->
        <!--Vue 提供了 过渡模式-->
        <!--in-out：新元素先进行过渡，完成之后当前元素过渡离开。-->
        <!--out-in：当前元素先进行过渡，完成之后新元素过渡进入。-->
        <transition
                name="custom-classes-transition"
                mode="in-out"
                enter-active-class="animated fadeInRight"
                leave-active-class="animated fadeOutLeft">
            <router-view/>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'VueWebApp'
    }
</script>
