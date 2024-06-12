<template>
  <div>
    <div class="mb-2">
      <label class="block mb-2">Name <span class="text-white">*</span></label>
      <input
        v-model="item.name"
        class="border p-1 w-full text-gray-600"
      >
    </div>
    <div class="mb-2">
      <label class="block mb-2">Desc</label>
      <input
        v-model="item.desc"
        class="border p-1 w-full text-gray-600"
      >
    </div>
    <div class="mb-2">
      <label class="block mb-2">Command <span class="text-white">*</span></label>
      <input
        v-model="item.command"
        class="border p-1 w-full text-gray-600"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
	item: Object
})
</script>

<style scoped>
</style>