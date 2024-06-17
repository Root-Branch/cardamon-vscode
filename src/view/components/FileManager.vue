<template>
  <div
    class="flex items-center justify-between cursor-pointer mb-2 hover:bg-gray-800 rounded pl-1"
    @click="$emit('toggle-collapse', index)"
  >
    <div class="flex items-center flex-row">
      <font-awesome-icon
        class="mr-2"
        :icon="isCollapsed ? 'chevron-right' : 'chevron-down'"
      />
      <h2>{{ file.relativePath }}</h2>
    </div>
    <div class="flex items-center">
      <!-- <font-awesome-icon
        icon="play"
        class="cursor-pointer hover:bg-gray-600 rounded p-2"
        @click.stop="$emit('run-all-observations', file.path)"
      /> -->
      <font-awesome-icon
        icon="eye"
        class="cursor-pointer hover:bg-gray-600 rounded p-2"
        @click.stop="$emit('open-file', file.path)"
      />
      <font-awesome-icon
        icon="trash"
        class="cursor-pointer hover:bg-gray-600 rounded p-2"
        @click.stop="$emit('delete-file', file.path)"
      />
    </div>
  </div>
  <div
    v-if="!isCollapsed"
    class="ml-4"
  >
    <div class="mb-2">
      <label class="block mb-1">Debug Level</label>
      <div class="flex items-center">
        <input
          v-model="file.content.
            debug_level"

          class="border p-1 w-full text-gray-600"
          @input="$emit('save-changes', file)"
        >
      </div>
    </div>
    <div class="mb-2">
      <label class="block mb-1">Metrics Server URL</label>
      <div class="flex items-center">
        <input
          v-model="file.content.metrics_server_url"
          class="border p-1 w-full text-gray-600"
          @input="$emit('save-changes', file)"
        >
      </div>
    </div>
    <SectionManager
      v-for="(section, sectionIndex) in getSections(file.content)"
      :key="sectionIndex"
      :section="section"
      :file-path="file.path"
      @update-section="updateSection(file, section[0], $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import SectionManager from './SectionManager.vue'

const props = defineProps({
	file: Object,
	index: Number,
	isCollapsed: Boolean
})

const getFileName = (path) => {
	return path.split('/').pop()
}

const getSections = (content) => {
	const sections = ['processes', 'scenarios', 'observations']
	sections.forEach(section => {
		if (!content[section]) {
			content[section] = []
		}
	})
	return Object.entries(content).filter(([key]) => sections.includes(key))
}

const updateSection = (file, sectionName, updatedSection) => {
	if (updatedSection.length === 0) {
		delete file.content[sectionName]
	} else {
		file.content[sectionName] = updatedSection
	}
	saveChanges(file)
}

const saveChanges = (file) => {
	const updatedFiles = JSON.parse(JSON.stringify(file))
	vscode.postMessage({
		command: 'saveChanges',
		filePath: file.path,
		content: updatedFiles
	})
}
</script>

<style scoped>
</style>