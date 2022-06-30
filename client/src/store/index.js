import { createStore } from 'vuex'
export default createStore({
  state: {
    isOpenSidebar: false,
    isLoading: false,
    notification: null,
    page: 1,
    limit: 5,
    socketConnected: false,
  },
  mutations: {
    setSidebar: (state, isOpenSidebar) => (state.isOpenSidebar = isOpenSidebar),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
    setPage: (state, page) => (state.page = page),
    setLimit: (state, limit) => (state.limit = limit),
    setNotification: (state, notification) => (state.notification = notification),
    setSocketState: (state, socketConnected) => (state.socketConnected = socketConnected),
  },
  actions: {
    setSocket({ commit }, socket) {
      commit('setSocket', socket)
    },
    openSidebar({ commit }) {
      commit('setSidebar', true)
    },
    closeSidebar({ commit }) {
      commit('setSidebar', false)
    },
    startLoading({ commit }) {
      commit('setLoading', true)
    },
    stopLoading({ commit }) {
      commit('setLoading', false)
    },
    handleNotifications({ commit }, data) {
      let notification = ''
      if (typeof data.message === 'string') {
        notification = data.message
      }
      commit('setNotification', { text: notification, type: data.success ? 'success' : 'error' })
    },
  },
  modules: {},
})
