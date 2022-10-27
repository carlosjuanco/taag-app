import { createRouter, createWebHistory } from "vue-router";
import store from '../store'
import HomeView from "../views/HomeView.vue";
import NavBar from "../views/NavBar.vue";
import Login from "../views/Login.vue";
import Companies from "../components/Companies.vue";
import Employees from "../components/Employees.vue";

const routes = [
  {
      path: '/navbar',
      name: 'navbar',
      component: NavBar
  },
  {
      path: '/login',
      name: 'login',
      component: Login,
  },
  {
      path: '/companies',
      name: 'companies',
      component: Companies,
  },
  {
      path: '/employees',
      name: 'employees',
      component: Employees
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
    try {
        await store.dispatch('check')

        if (to.name == 'login') {
            next({ name: 'home' })
        }
        else {
            store.dispatch('toggleNavbar', true)

            next()
        }
    }
    catch (error) {
        store.dispatch('destroySession')

        if (to.name == 'login') {
            store.dispatch('toggleNavbar', false)

            next()
        }
        else {
            next({ name: 'login' })
        }
    }
})

export default router;
