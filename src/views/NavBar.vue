<template>
    <nav class="navbar is-info">
        <div class="navbar-brand">
            <a :class="{ 'navbar-burger': true, 'is-active': show_burger }" @click="show_burger = !show_burger">
                <span></span>
                <span></span>
                <span></span>
            </a>
        </div>

        <div :class="{ 'navbar-menu': true, 'is-active': show_burger }">
            <div class="navbar-start">
                <router-link :class="{ 'navbar-item': true, 'is-active': current_route == 'companies' }" 
                :to="{ name: 'companies' }" replace>
                    Compañia
                </router-link>

                <router-link :class="{ 'navbar-item': true, 'is-active': current_route == 'employees' }" :to="{ name: 'employees'}" replace>
                    Empleados
                </router-link>         

            </div>

            <div class="navbar-end">
                <a class="navbar-item" @click="logout">
                    Cerrar sesión
                </a>
            </div>
        </div>
    </nav>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import helpers from '../helpers'

export default {
    name: 'NavBar',
    setup() {
        const route = useRoute()
        const show_burger = ref(false)
        const show_options = ref('')
        const { handleErrors, logout, getInformationUser } = helpers()
        const user = getInformationUser()

        const current_route = computed(() => {
            return route.name
        })

        onMounted(() => {
            document.addEventListener('click', event => {
                const classes = event.target.className.split(' ')

                if (classes.length == 2 && classes[0] == 'navbar-link') {
                    show_options.value = classes[1]
                }
                else if ((classes.length == 3 && classes[0] == 'fas') || (classes.length == 2 && classes[0] == 'icon')) {
                    show_options.value = 'profile'
                }
                else {
                    show_options.value = ''
                }
            })
        })

        return { show_burger, logout, current_route, show_options, user }
    }
}
</script>
