export default {
  async getSetting(axios) {
    const res = await axios.get(`/api/v1/setting`)
    return res.data
  },
  async updateSetting(axios, data) {
    const res = await axios.put(`/api/v1/setting`, data)
    return res.data
  },
}
