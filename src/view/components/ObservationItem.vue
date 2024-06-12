<template>
  <div>
    <div class="mb-1">
      <label class="block mb-1 text-sm">Name <span class="text-white">*</span></label>
      <input
        v-model="item.name"
        class="border p-1 w-full text-gray-600"
      >
    </div>
    <div class="mb-1">
      <label class="block mb-1 text-sm">Processes <span class="text-white">*</span> <span
        class="text-xs"
      >(Separate with commas)</span></label>
      <input
        v-model="processesString"
        class="border p-1 w-full text-gray-600"
      >
    </div>
    <div class="mb-1">
      <label class="block mb-1 text-sm">Scenarios <span class="text-white">*</span> <span
        class="text-xs"
      >(Separate with commas)</span></label>
      <input
        v-model="scenariosString"
        class="border p-1 w-full text-gray-600"
      >
    </div>
    <div class="mb-1">
      <label class="block mb-1 text-sm">Iterations</label>
      <input
        v-model="item.iterations"
        class="border p-1 w-full text-gray-600"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'

const props = defineProps({
	item: Object
})

const processesString = ref(props.item.processes.join(', '))
const scenariosString = ref(props.item.scenarios.join(', '))

watch(processesString, (newVal) => {
	props.item.processes = newVal.split(',').map(str => str.trim())
})

watch(scenariosString, (newVal) => {
	props.item.scenarios = newVal.split(',').map(str => str.trim())
})
</script>

<style scoped>
</style>