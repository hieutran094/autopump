<template>
  <div class="items-center px-5 pt-3 bg-white rounded-md shadow-sm overflow-x-auto w-full max-h-full">
    <h2 class="font-semibold text-xl text-gray-600 pb-6">Status</h2>

    <div class="container pt-6 pb-6 overflow-x-auto w-full h-full">
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/3 px-2">
          <div class="border-2 border-gray-100 rounded-lg shadow-sm mb-4">
            <div class="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
              <div class="px-3 pt-8 pb-10 text-center relative z-10">
                <h4 class="text-sm uppercase text-gray-500 leading-tight">Air Humidity</h4>
                <h3 class="text-3xl text-gray-700 font-semibold leading-tight my-3">{{ Math.round(data.airHumidity * 100) / 100 }}</h3>
                <p class="text-xs text-green-500 leading-tight">%</p>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/3 px-2">
          <div class="border-2 border-gray-100 rounded-lg shadow-sm mb-4">
            <div class="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
              <div class="px-3 pt-8 pb-10 text-center relative z-10">
                <h4 class="text-sm uppercase text-gray-500 leading-tight">Soil Misture</h4>
                <h3 class="text-3xl text-gray-700 font-semibold leading-tight my-3">{{ Math.round(data.soilMoisture * 100) / 100 }}</h3>
                <p class="text-xs text-red-500 leading-tight">%</p>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/3 px-2">
          <div class="border-2 border-gray-100 rounded-lg shadow-sm mb-4">
            <div class="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
              <div class="px-3 pt-8 pb-10 text-center relative z-10">
                <h4 class="text-sm uppercase text-gray-500 leading-tight">Temperature</h4>
                <h3 class="text-3xl text-gray-700 font-semibold leading-tight my-3">
                  {{ Math.round(data.temperature * 100) / 100 }}
                </h3>
                <p class="text-xs text-green-500 leading-tight">°C</p>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/3 px-2">
          <div class="border-2 border-gray-100 rounded-lg shadow-sm mb-4">
            <div class="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
              <div class="px-3 pt-8 pb-10 text-center relative z-10">
                <h4 class="text-sm uppercase text-gray-500 leading-tight">Pump</h4>
                <div class="w-full grid content-center justify-items-center mt-3">
                  <div
                    class="p-4 shadow-sm w-16 h-16 rounded-full text-xl font-semibold uppercase text-white"
                    :class="[{ 'bg-green-500': data.pumpState }, { 'bg-gray-500': !data.pumpState }]">
                    {{ data.pumpState ? 'ON' : 'OFF' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'status-box',
  components: {},
  data() {
    return {
      data: {
        temperature: null,
        airHumidity: null,
        soilMoisture: null,
        pumpState: false,
      },
    }
  },
  created() {
    this.$socket.on('sync-data', (data) => {
      this.data = data
    })
  },
  beforeUnmount() {
    this.$socket.off('sync-data')
  },
  methods: {},
})
</script>
<style >
.mx-datepicker {
  border-color: #519fc5;
  max-width: 100% !important;
}

.mx-input {
  --tw-border-opacity: 1;
  border-color: rgba(229, 231, 235, var(--tw-border-opacity)) !important;
  border-radius: 0.375rem !important;
  padding-top: 0.5rem !important;
  padding-right: 0.75rem !important;
  padding-bottom: 0.5rem !important;
  padding-left: 0.75rem !important;
  font-size: 1rem !important;
  line-height: 1.5rem !important;
  height: auto;
}

.mx-input:focus {
  --tw-ring-opacity: 0.4 !important;
  --tw-ring-color: rgba(99, 102, 241, var(--tw-ring-opacity)) !important;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important;
  --tw-border-opacity: 1 !important;
  border-color: rgba(79, 70, 229, var(--tw-border-opacity)) !important;
}

.mx-date-row .active {
  background-color: rgba(79, 70, 229, 1) !important;
}

.mx-date-row .in-range {
  background-color: rgba(99, 102, 241, 0.1) !important;
}
</style>