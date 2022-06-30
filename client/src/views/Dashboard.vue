<template>
  <div>
    <div class="">
      <div class="flex flex-wrap sm:-mx-6 xl:mx-0">
        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3">
          <setting-box></setting-box>
        </div>
        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-2/3">
          <status-box></status-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import StatusBox from '../components/StatusBox.vue'
import SettingBox from '../components/SettingBox.vue'

export default defineComponent({
  name: 'Dashboard',
  components: { StatusBox, SettingBox },
  data: () => {
    return {
      device: {
        isOnline: false,
      },
      isConnected: null,
      chartData: null,
    }
  },
  async created() {
    this.$store.dispatch('startLoading')
    try {
      this.$socket.on('update-noti', (data) => {
        this.$store.dispatch('handleNotifications', data)
      })
    } catch (e) {
      this.isConnected = false
      this.$store.dispatch('handleNotifications', { message: 'Cannot connect to server.' })
    }
    this.$store.dispatch('stopLoading')
  },
  methods: {
    async toggle(id, state) {
      if (!this.isConnected) return
      this.$socket.emit('esp-execute-state', { id, state })
    },
    async request(nodeid, switchid) {
      if (!this.isConnected) return
      this.$socket.emit('esp-require-sensor', {
        nodeid,
        switchid,
        state: true,
      })
    },
  },
  watch: {
    'device.isOnline': async function (value) {
      const msg = value ? 'Device is online' : 'Device is offline'
      const success = value
      this.$store.dispatch('handleNotifications', { message: msg, success })
    },
  },
})
</script>