import { createRouter,createWebHashHistory } from 'vue-router'
import home from "@/views/home";
import calendar from "@/views/calendar";
import detail from "@/views/detail";
import querynumber from "@/views/querynumber";
import searchdetail from "@/views/searchdetail";
import scarn from "@/views/scarn";
import inputcode from "@/views/inputcode";
import excelexport from "@/views/excelexport";
import my from  "@/views/my"
import userconfig from "@/views/userconfig";
import csvimport from "@/views/csvimport";
import sync from "@/views/sync";
import help from "@/views/help";
import drug from "@/views/drug";
const routes = [

    {
        path: '/',
        redirect:'home',
        meta: {index:1}
    },
    {
        path: '/home',
        name: 'home',
        component: home,
        meta: {index:1}
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: calendar,
        meta: {index:10}
    },
    {
        path: '/my',
        name: 'my',
        component: my,
        meta: {index:20}
    },
    {
        path: '/detail',
        name: 'detail',
        component: detail,
        meta: {index:2}
    },
    {
        path: '/searchdetail',
        name: 'searchdetail',
        component: searchdetail,
        meta: {index:1}
    },
    {
        path: '/querynumber',
        name: 'querynumber',
        component: querynumber,
        meta: {index:2}
    },
    {
        path: '/scarn',
        name: 'scarn',
        component: scarn,
        meta: {index:2}
    },
    {
        path: '/inputcode',
        name: 'inputcode',
        component: inputcode,
        meta: {index:3 }
    },
    {
        path: '/drug',
        name: 'drug',
        component: drug,
        meta: {index:3 }
    },
    {
        path: '/userconfig',
        name: 'userconfig',
        component: userconfig,
        meta: {index:25 }
    },
    {
        path: '/excelexport',
        name: 'excelexport',
        component: excelexport,
        meta: {index:31 }
    },
    {
        path: '/csvimport',
        name: 'csvimport',
        component: csvimport,
        meta: {index:31 }
    },
    {
        path: '/sync',
        name: '/sync',
        component: sync,
        meta: {index:31 }
    },
    {
        path: '/help',
        name: '/help',
        component: help,
        meta: {index:31 }
    },





]
const router = createRouter({
    history:createWebHashHistory(process.env.BASE_URL),
    routes
})
//导出
export default router