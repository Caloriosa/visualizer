import Vue from 'vue'
import Vuex from 'vuex'
import ClientMixin from "./plugins/clientMixin"
import Dashboard from './components/Dashboard.vue'

Vue.use(Vuex)
Vue.use(ClientMixin);

new Vue({
  el: '#dashboard',
  template: '<Dashboard />',
  components: { Dashboard }
})

