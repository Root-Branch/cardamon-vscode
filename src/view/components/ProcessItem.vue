<template>
  <div>
    <div class="mb-2">
      <h2 class="block mb-1">
        Type <span class="text-white">*</span>
      </h2>
      <select
        v-model="item.type"
        class="border p-1 w-full text-gray-600"
      >
        <option value="bare_metal">
          bare_metal
        </option>
        <option value="docker">
          docker
        </option>
        <option value="kubernetes">
          kubernetes
        </option>
      </select>
    </div>
    <div class="mb-2">
      <h2 class="block mb-1">
        Name <span class="text-white">*</span>
      </h2>
      <input
        v-model="item.name"
        class="border p-1 w-full text-gray-600"
      >
    </div>
    <div
      v-if="item.type === 'docker' || item.type === 'kubernetes'"
      class="mb-2"
    >
      <h2 class="block mb-1">
        Containers <span class="text-white">*</span> <span class="text-xs">(Separate with
          commas)</span>
      </h2>
      <input
        v-model="containersString"
        class="border p-1 w-full text-gray-600"
      >
    </div>
    <div class="mb-2">
      <h2 class="block mb-1">
        Command <span class="text-white">*</span>
      </h2>
      <input
        v-model="item.command"
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

const containersString = ref(props.item.containers ? props.item.containers.join(', ') : '')

watch(containersString, (newVal) => {
	if (props.item.type !== 'bare_metal') {
		props.item.containers = newVal.split(',').map(str => str.trim())
	}
})

watch(() => props.item.type, (newType) => {
	if (newType === 'bare_metal') {
		delete props.item.containers
		containersString.value = ''
	}
})
</script>

<style scoped>
</style>
