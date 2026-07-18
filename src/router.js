import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import AgendaPage from './views/AgendaPage.vue'
import Bus65Page from './views/Bus65Page.vue'
import StylesPage from './views/StylesPage.vue'

const routes = [
  { path: '/', name: 'accueil', component: HomePage },
  { path: '/agenda', name: 'agenda', component: AgendaPage },
  { path: '/bus-65', name: 'bus-65', component: Bus65Page },
  { path: '/styles', name: 'styles', component: StylesPage },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
