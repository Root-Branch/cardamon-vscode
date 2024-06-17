<template>
  <div>
    <div class="flex justify-between mb-4">
      <h1 class="mb-1">
        Cardamon TOML files
      </h1>
      <div class="flex items-center">
        <font-awesome-icon
          class="cursor-pointer hover:bg-gray-600 p-2 rounded"
          icon="plus"
          @click="createTomlFile"
        />
        <font-awesome-icon
          class="cursor-pointer hover:bg-gray-600 p-2 rounded"
          icon="globe"
          @click="openWebview"
        />
        <font-awesome-icon
          class="cursor-pointer hover:bg-gray-600 p-2 rounded"
          icon="refresh"
          @click="refreshFiles"
        />
      </div>
    </div>
    <div
      v-for="(file, index) in filteredFiles"
      :key="index"
      class="mb-2"
    >
      <FileManager
        :file="file"
        :index="index"
        :is-collapsed="isCollapsed[index]"
        @toggle-collapse="toggleCollapse(index)"
        @delete-file="deleteFile"
        @open-file="openFile"
        @run-all-observations="runAllObservations"
        @save-changes="saveChanges"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import FileManager from './components/FileManager.vue'

const files = ref([])
const isCollapsed = ref([])

window.addEventListener('message', event => {
	const message = event.data
	switch (message.command) {
	case 'updateFiles':
		files.value = message.files
		isCollapsed.value = message.files.map(() => true)
		break
	}
})

const refreshFiles = () => {
	vscode.postMessage({ command: 'refreshFiles' })
	fetchTomlFiles()
}

const fetchTomlFiles = () => {
	vscode.postMessage({ command: 'fetchTomlFiles' })
}

const createTomlFile = () => {
	vscode.postMessage({ command: 'createTomlFile' })
}

const openWebview = () => {
	vscode.postMessage({ command: 'openWebview' })
}

const toggleCollapse = (index) => {
	isCollapsed.value[index] = !isCollapsed.value[index]
}

const filteredFiles = computed(() => {
	return files.value.filter(file => {
		const content = file.content
		return content.processes || content.scenarios || content.observations || content.debug_level || content.metrics_server_url
	})
})

const deleteFile = (filePath) => {
	vscode.postMessage({
		command: 'deleteFile',
		filePath
	})
}

const openFile = (filePath) => {
	vscode.postMessage({
		command: 'openFile',
		filePath
	})
}

const runAllObservations = (filePath) => {
	vscode.postMessage({
		command: 'runAllObservations',
		filePath
	})
}

const saveChanges = (file) => {
	const updatedFiles = JSON.parse(JSON.stringify(file))
	vscode.postMessage({
		command: 'saveChanges',
		filePath: file.path,
		content: updatedFiles
	})
}

onMounted(() => {
	fetchTomlFiles()
})
</script>

<style scoped>
/* Add any scoped styles if necessary */
</style>
