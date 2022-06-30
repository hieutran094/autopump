export default {
  async getSetting(axios) {
    const res = await axios.get(`/setting`)
    return res.data
  },
  async updateSetting(axios, data) {
    const res = await axios.put(`/setting`, data)
    return res.data
  },
}
