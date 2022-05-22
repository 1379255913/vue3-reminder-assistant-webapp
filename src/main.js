import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'
import router from "./router";
import 'vant/lib/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueQuagga from 'vue-quaggajs';
import './appback'
createApp(App).use(Vant).use(router).use(VueQuagga).use(VueAxios, axios).mount('#app')
