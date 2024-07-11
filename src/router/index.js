import { createRouter, createWebHistory } from 'vue-router'
// 1.导入页面：项目启动时就导入页面
import Index from '../views/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',         // 路由的路径   /项目根路径
      name: 'index',     // 路由名，今后可以根据路由的名字进行页面跳转
      component: Index   // 页面的名字，需要与导入时的名字一直
    },
    {
      path: '/play/:abc',  // 动态路由：可以用来传参  id：变量名
      name: 'play',
      // 路由懒加载：需要时再加载，不是提前就加载好
      component: () => import('../views/Play.vue')  // 在访问页面时才导入
    },
    {
      path: '/search',  // 动态路由：可以用来传参  id：变量名
      name: 'search',
      // 路由懒加载：需要时再加载，不是提前就加载好
      component: () => import('../views/SearchVideo.vue')  // 在访问页面时才导入
    },
    {
      // 播放历史界面
      path: '/history',  // 动态路由：可以用来传参  id：变量名
      name: 'history',
      // 路由懒加载：需要时再加载，不是提前就加载好
      component: () => import('../views/History.vue')  // 在访问页面时才导入
    },
    {
      path: '/upPersonal',
      name: 'upPersonal',
      component: () => import('../views/up/UpPersonal.vue'),
      children:[  // 二级路由：配子页面路由
        {
          path: 'videoManage',  // 二级路由的path不能以/开头，只写字符串就行
          name: 'upVideoManage',
          component: () => import('../views/up/VideoManage.vue')
        },
        {
          path: 'personalFun',  // 二级路由的path不能以/开头，只写字符串就行
          name: 'personalFun',
          component: () => import('../views/up/PersonalFun.vue')
        },
        {
          path: 'personalMessage',  // 二级路由的path不能以/开头，只写字符串就行
          name: 'personalMessage',
          component: () => import('../views/up/PersonalMessage.vue')
        },
        {
          path: 'message',
          name: 'message',
          component: () => import('../views/up/Message.vue')
        },
        {
          path: 'addVideo',
          name: 'addVideo',
          component: () => import('../views/up/AddVideo.vue')
        },
        {
          path:'viewVideo/:vid',
          name:'viewVideo',
          component:()=>import('@/views/up/ViewVideo.vue')
        },
        {
          path:'editVideo/:vid',
          name:'editVideo',
          component:()=>import('@/views/up/EditVideo.vue')
        }
      ]  
    },
    {
      path: '/adminPersonal',  // 动态路由：可以用来传参  id：变量名
      name: 'adminPersonal',
      // 路由懒加载：需要时再加载，不是提前就加载好
      component: () => import('../views/admin/AdminPersonal.vue'),
      children:[
        {
          path: 'videoManage',  // 二级路由的path不能以/开头，只写字符串就行
          name: 'adminVideoManage',
          component: () => import('../views/admin/VideoManage.vue')
        },
        {
          path: 'reviewManage',
          name: 'adminReviewManage',
          component: () => import('../views/admin/ReviewManage.vue')
        },
          {
          path: 'userManage',
          name: 'adminUserManage',
          component: () => import('../views/admin/UserManage.vue')
        }
      ] 
    }
  ]
})

export default router
