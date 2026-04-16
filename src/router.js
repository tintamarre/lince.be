import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import AgendaPage from './views/AgendaPage.vue'

const routes = [
  { path: '/', name: 'accueil', component: HomePage },
  { path: '/agenda', name: 'agenda', component: AgendaPage },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
