import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FileUpload from "@/components/FileUpload.vue";
import MessageBoard from "@/components/MessageBoard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'fileUpload',
      component: FileUpload
    },
    {
      path: '/messages',
      name: 'messageBoard',
      component: MessageBoard
    }
  ]
})

export default router
