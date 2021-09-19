import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/params', component: Params }
      ]
    }
  ]
})

// 挂载路由导航守卫（就是个请求验证过滤器）
router.beforeEach((to, from, next) => {
  // 请求的是登录页，放行
  if (to.path === '/login') {
    next()
  }
  // 无效token，导航到登录页
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    next('/login')
  }
  // 有效token，放行
  next()
})

export default router
