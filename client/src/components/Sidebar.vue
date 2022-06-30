<template>
  <div class="flex">
    <div :class="isOpen ? 'block' : 'hidden'" @click="closeSidebar" class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>
    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0">
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <img src="/favicon.png" alt="Iot project" width="30" height="30" />
          <span class="mx-2 text-2xl font-semibold text-white">TempLock</span>
        </div>
      </div>

      <nav class="mt-10">
        <router-link
          @click="closeSidebar"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
          </svg>
          <span class="mx-4">Dashboard</span>
        </router-link>

        <router-link
          @click="closeSidebar"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4 cursor-pointer"
          :class="[$route.name === 'Setting' ? activeClass : inactiveClass]"
          to="/setting">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd"></path>
          </svg>
          <span class="mx-4">Setting</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  data: () => {
    return {
      activeClass: 'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',
      inactiveClass: 'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
    }
  },
  computed: {
    isOpen() {
      return this.$store.state.isOpenSidebar
    },
  },
  methods: {
    closeSidebar() {
      this.$store.dispatch('closeSidebar')
    },
  },
})
</script>

