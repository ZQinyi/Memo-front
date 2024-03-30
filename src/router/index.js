import {createRouter, createWebHistory} from 'vue-router';

import LoginVue from '@/views/Login.vue';
import NotesVue from '@/views/Notes.vue';
import PendingVue from '@/views/Pending.vue';

const routes = [
    {path:'/login', component: LoginVue},
    {path: '/:userId/notes', component: NotesVue, name: 'notes' },
    {path: '/:userId/pendings', component: PendingVue, name: 'pendings' },

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router