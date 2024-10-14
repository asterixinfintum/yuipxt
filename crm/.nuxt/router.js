import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _624e38a6 = () => interopDefault(import('..\\pages\\activities.vue' /* webpackChunkName: "pages/activities" */))
const _29c47058 = () => interopDefault(import('..\\pages\\addannouncement.vue' /* webpackChunkName: "pages/addannouncement" */))
const _51ac031f = () => interopDefault(import('..\\pages\\addcontact.vue' /* webpackChunkName: "pages/addcontact" */))
const _56e56cf6 = () => interopDefault(import('..\\pages\\addcsv.vue' /* webpackChunkName: "pages/addcsv" */))
const _5e71b8ed = () => interopDefault(import('..\\pages\\addlead.vue' /* webpackChunkName: "pages/addlead" */))
const _cf441808 = () => interopDefault(import('..\\pages\\announcements.vue' /* webpackChunkName: "pages/announcements" */))
const _211c48e0 = () => interopDefault(import('..\\pages\\asset.vue' /* webpackChunkName: "pages/asset" */))
const _06187443 = () => interopDefault(import('..\\pages\\assets.vue' /* webpackChunkName: "pages/assets" */))
const _b017bd38 = () => interopDefault(import('..\\pages\\createasset.vue' /* webpackChunkName: "pages/createasset" */))
const _41959a16 = () => interopDefault(import('..\\pages\\editasset.vue' /* webpackChunkName: "pages/editasset" */))
const _778cbdb3 = () => interopDefault(import('..\\pages\\viewagents.vue' /* webpackChunkName: "pages/viewagents" */))
const _011b8638 = () => interopDefault(import('..\\pages\\viewcontacts.vue' /* webpackChunkName: "pages/viewcontacts" */))
const _828ffbfc = () => interopDefault(import('..\\pages\\viewleads.vue' /* webpackChunkName: "pages/viewleads" */))
const _bad6747c = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _68d6d554 = () => interopDefault(import('..\\pages\\admin\\_dashboard.vue' /* webpackChunkName: "pages/admin/_dashboard" */))
const _7f597fca = () => interopDefault(import('..\\pages\\client\\_client_id.vue' /* webpackChunkName: "pages/client/_client_id" */))
const _83e3d2b6 = () => interopDefault(import('..\\pages\\editclient\\_client_id.vue' /* webpackChunkName: "pages/editclient/_client_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/activities",
    component: _624e38a6,
    name: "activities"
  }, {
    path: "/addannouncement",
    component: _29c47058,
    name: "addannouncement"
  }, {
    path: "/addcontact",
    component: _51ac031f,
    name: "addcontact"
  }, {
    path: "/addcsv",
    component: _56e56cf6,
    name: "addcsv"
  }, {
    path: "/addlead",
    component: _5e71b8ed,
    name: "addlead"
  }, {
    path: "/announcements",
    component: _cf441808,
    name: "announcements"
  }, {
    path: "/asset",
    component: _211c48e0,
    name: "asset"
  }, {
    path: "/assets",
    component: _06187443,
    name: "assets"
  }, {
    path: "/createasset",
    component: _b017bd38,
    name: "createasset"
  }, {
    path: "/editasset",
    component: _41959a16,
    name: "editasset"
  }, {
    path: "/viewagents",
    component: _778cbdb3,
    name: "viewagents"
  }, {
    path: "/viewcontacts",
    component: _011b8638,
    name: "viewcontacts"
  }, {
    path: "/viewleads",
    component: _828ffbfc,
    name: "viewleads"
  }, {
    path: "/",
    component: _bad6747c,
    name: "index"
  }, {
    path: "/admin/:dashboard?",
    component: _68d6d554,
    name: "admin-dashboard"
  }, {
    path: "/client/:client_id?",
    component: _7f597fca,
    name: "client-client_id"
  }, {
    path: "/editclient/:client_id?",
    component: _83e3d2b6,
    name: "editclient-client_id"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
