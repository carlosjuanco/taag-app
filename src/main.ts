import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store'
import bulma from "bulma/css/bulma.css"
import axios from 'axios'

const api_token = localStorage.getItem('api_token')

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
axios.defaults.withCredentials = true

if (api_token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${api_token}`
}

import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App);

app.use(store).use(router);

app.mount("#app");
