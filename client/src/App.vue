<template>
  <component :is="layout">
    <!-- eslint-disable-next-line -->
    <loading v-model:active="isLoading" :is-full-page="true" :opacity="0.9" color="#6366F1" loader="bars" :height="60" />
    <notifications group="admin" position="top right" />
    <router-view />
  </component>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

const defaultLayout = 'default'
export default defineComponent({
  components: { Loading },
  data: () => {
    return {
      isLoad: true,
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    layout() {
      const { currentRoute } = useRouter()
      return `${currentRoute.value.meta.layout || defaultLayout}-layout`
    },
    notification() {
      return this.$store.state.notification
    },
  },
  watch: {
    notification() {
      if (this.notification) {
        this.$notify({
          group: 'admin',
          type: this.notification.type || 'info',
          text: this.notification.text || '',
          duration: 5000,
        })
      }
    },
  },
})
</script>
