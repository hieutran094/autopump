<template>
  <div class="w-full bg-white border-t-4 rounded-md px-5 py-5 pb-5 pt-3 border-t-gray-500">
    <h2 class="font-semibold text-xl text-gray-600 pb-6">Setting</h2>
    <div class="w-full">
      <form @submit.prevent="submit">
        <div class="grid grid-cols-1 mt-4">
          <label for="toggleB" class="flex items-center cursor-pointer mb-6">
            <div class="relative">
              <input type="checkbox" id="toggleB" class="sr-only" v-model="setting.timerOn" />
              <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
            </div>
            <div class="ml-3 text-gray-700">Timer</div>
          </label>
          <div>
            <label class="text-gray-700" for="threshold_temperature">Start At</label>
            <br />
            <!-- eslint-disable-next-line -->
            <date-picker class="mt-2 w-full" v-model:value="setting.startTime" type="time" value-type="HH:mm" format="HH:mm" :show-second="false" />
          </div>
          <div class="mt-3">
            <label class="text-gray-700" for="measurement_error">Pumping Time (minutes)</label>
            <input
              v-model="setting.time"
              name="measurement_error"
              type="text"
              autocomplete="off"
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" />
          </div>
          <div class="flex justify-end pt-5">
            <button
              type="submit"
              class="
                inline-flex
                items-center
                py-2
                px-4
                text-sm
                font-medium
                text-gray-900
                bg-transparent
                rounded-lg
                border border-gray-900
                hover:bg-gray-900 hover:text-white
                focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white
                dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700
              "
              @click="search()">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L13 8.586V5h3a2 2 0 012 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2h3v3.586L9.707 7.293zM11 3a1 1 0 112 0v2h-2V3z"></path>
                <path d="M4 9a2 2 0 00-2 2v5a2 2 0 002 2h8a2 2 0 002-2H4V9z"></path>
              </svg>
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import SettingService from '../services/SettingService.js'
export default defineComponent({
  name: 'setting-box',
  components: { DatePicker },
  data() {
    return {
      setting: { timerOn: true, startTime: null, time: 20 },
    }
  },
  async created() {
    this.$store.dispatch('startLoading')
    try {
      const { data } = await SettingService.getSetting(this.$axios)
      this.setting = data
    } catch (e) {
      const message = typeof e === 'string' ? e : e.response.data
      this.$store.dispatch('handleNotifications', { message })
    } finally {
      this.$store.dispatch('stopLoading')
    }
  },
  methods: {
    async submit() {
      this.$store.dispatch('startLoading')
      try {
        if (!this.setting.startTime || (Number.isInteger(this.setting.time) && this.setting.time <= 0)) {
          throw 'StarAt/Time is invalid.'
        }
        const formData = { ...this.setting }
        const res = await SettingService.updateSetting(this.$axios, formData)
        if (res.success) {
          this.$store.dispatch('handleNotifications', { message: res.message, success: true })
        }
      } catch (e) {
        const message = typeof e === 'string' ? e : e.response.data
        this.$store.dispatch('handleNotifications', { message })
      } finally {
        this.$store.dispatch('stopLoading')
      }
    },
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n)
    },
  },
  watch: {
    'setting.startTime': async function () {},
  },
})
</script>
<style scoped>
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>