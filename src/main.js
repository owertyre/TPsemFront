import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import apolloProvider from "./apollo_client"
import {DEBUG} from "./settings"
import router from './router'

Vue.config.productionTip = DEBUG

new Vue({
  vuetify,
  apolloProvider,
  router,
  render: h => h(App)
}).$mount('#app')
