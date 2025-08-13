import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import mitt from "mitt";

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import './assets/styles/main.css'
import Vue3Sanitize from "vue-3-sanitize";
import '@bbva-web-components/bbva-foundations-theme';

const vuetify = createVuetify({
  components,
  directives,
});

const emitter = mitt();
const app = createApp(App)
app.config.globalProperties.emitter = emitter;

app.use(vuetify)
app.use(router)
app.use(Vue3Sanitize);

app.mount('#app')
