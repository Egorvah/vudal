import Vue from 'vue';

import App from './App.vue';
import { VudalPlugin } from './../src/index.js';

Vue.use(VudalPlugin);
new Vue({
  render: h => h(App),
}).$mount('#app');
