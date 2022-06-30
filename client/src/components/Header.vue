<template>
  <header class="grid grid-cols-5 justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
    <div class="flex items-center col-span-2">
      <button @click="openSidebar" class="text-gray-500 focus:outline-none lg:hidden">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div class="flex items-center justify-self-center">
      <h3 class="text-2xl font-medium text-gray-700 text-center">{{ routerName }}</h3>
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  data: () => {
    return {
      dropdownOpen: false,
    }
  },
  computed: {
    title() {
      return this.$store.state.title
    },
    routerName() {
      const { currentRoute } = useRouter()
      console.log(currentRoute.value.name)
      return currentRoute.value.name || 'Dashboard'
    },
  },
  methods: {
    openSidebar() {
      this.$store.dispatch('openSidebar')
    },
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    },
  },
})
</script>