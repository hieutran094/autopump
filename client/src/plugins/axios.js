import axios from 'axios'
if (import.meta.env.VITE_NODE_ENV?.toString() === 'development') {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL?.toString()
}

export default axios.create()
