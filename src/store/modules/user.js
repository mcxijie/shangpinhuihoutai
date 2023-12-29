import {getInfo, login, logout} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import router, {anyRoutes, asyncRoutes, constantRoutes, resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    roles: [],
    button: [],
    resultAsyncRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.button = userInfo.button;
    state.roles = userInfo.roles;
  },
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes;
    state.resultAllRputes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    router.addRoutes(state.resultAsyncRoutes);
  }
}

const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) !== -1) {
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // user login
  async login({commit}, userInfo) {
    const {username, password} = userInfo
    let result = await login({username: username.trim(), password: password});
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response;
        commit('SET_USERINFO', data);
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes));
        resolve(data);
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

