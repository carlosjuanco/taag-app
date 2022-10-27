<template>
    <nav-bar v-if="showNavbar"></nav-bar>
    <login v-if="!showNavbar"></login>

    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component"></component>
        </transition>
    </router-view>
</template>
<script>
    import NavBar from "./views/NavBar.vue";
    import Login from "./views/Login.vue";
    export default {
        components: {
            NavBar,
            Login
        },
        computed: {
            showNavbar () {
                return this.$store.getters.showNavbar
            }
        }
    }
</script>

