<template>
  <div class="mb-2">
    <div
      class="flex items-center justify-between cursor-pointer mb-2 hover:bg-gray-800 rounded pl-1"
      @click="toggleSectionCollapse()"
    >
      <div class="flex items-center flex-row">
        <font-awesome-icon
          class="mr-2"
          :icon="isSectionCollapsed ? 'chevron-down' : 'chevron-right'"
        />
        <h2>{{ sectionType }}</h2>
      </div>
      <div class="flex items-center">
        <!-- <font-awesome-icon
          v-if="sectionType === 'observations'"
          icon="play"
          class="cursor-pointer hover:bg-gray-600 rounded p-1 mr-2"
          @click.stop="runObservations()"
        /> -->
        <font-awesome-icon
          icon="plus"
          class="cursor-pointer hover:bg-gray-600 rounded p-1"
          @click.stop="addItem()"
        />
      </div>
    </div>

    <div
      v-if="isSectionCollapsed"
      class="ml-4"
    >
      <div
        v-for="(item, index) in editableSection"
        :key="index"
        class="mb-2"
      >
        <div
          class="flex items-center justify-between cursor-pointer mb-2 hover:bg-gray-800 rounded pl-1"
          @click="toggleItemCollapse(index)"
        >
          <div class="flex items-center flex-row">
            <font-awesome-icon
              class="mr-2"
              :icon="isItemCollapsed[index] ? 'chevron-down' : 'chevron-right'"
            />
            <h2>{{ getItemName(sectionType, index) }}</h2>
          </div>
          <div class="flex items-center">
            <font-awesome-icon
              v-if="sectionType === 'observations'"
              icon="play"
              class="cursor-pointer hover:bg-gray-600 rounded p-1 mr-2"
              @click.stop="runObservation(index)"
            />
            <font-awesome-icon
              v-if="sectionType === 'scenarios'"
              icon="play"
              class="cursor-pointer hover:bg-gray-600 rounded p-1 mr-2"
              @click.stop="runScenario(index)"
            />
            <font-awesome-icon
              icon="trash"
              class="cursor-pointer hover:bg-gray-600 rounded p-1"
              @click.stop="deleteItem(index)"
            />
          </div>
        </div>

        <div
          v-if="isItemCollapsed[index]"
          class="ml-4"
        >
          <ProcessItem
            v-if="sectionType === 'processes'"
            :item="item"
            @update="updateItem(index, $event)"
          />
          <ScenarioItem
            v-if="sectionType === 'scenarios'"
            :item="item"
            @update="updateItem(index, $event)"
          />
          <ObservationItem
            v-if="sectionType === 'observations'"
            :item="item"
            @update="updateItem(index, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import ProcessItem from './ProcessItem.vue'
import ScenarioItem from './ScenarioItem.vue'
import ObservationItem from './ObservationItem.vue'

const props = defineProps({
	section: Array,
	filePath: String
})

const sectionType = props.section[0]
const emit = defineEmits(['update-section'])

const editableSection = ref([...props.section[1]])
const isSectionCollapsed = ref(false)
const isItemCollapsed = ref(editableSection.value.map(() => false))

watch(editableSection, (newVal) => {
	emit('update-section', newVal)
}, { deep: true })

const toggleSectionCollapse = () => {
	isSectionCollapsed.value = !isSectionCollapsed.value
}

const toggleItemCollapse = (index: number) => {
	isItemCollapsed.value[index] = !isItemCollapsed.value[index]
}

const getItemName = (sectionName: string, index: number) => {
	return editableSection.value[index].name || `${sectionName.slice(0, -1)} ${index + 1}`
}

const addItem = () => {
	let newItem = {}
	switch (sectionType) {
	case 'processes':
		newItem = {
			type: 'bare_metal',
			name: `process_${editableSection.value.length + 1}`,
			containers: [],
			command: ''
		}
		break
	case 'scenarios':
		newItem = {
			name: `scenario_${editableSection.value.length + 1}`,
			desc: '',
			command: ''
		}
		break
	case 'observations':
		newItem = {
			name: `observation_${editableSection.value.length + 1}`,
			processes: [],
			scenarios: [],
			iterations: 1
		}
		break
	}

	editableSection.value.push(newItem)
	isItemCollapsed.value.push(false)
}

const deleteItem = (index: number) => {
	if (editableSection.value.length === 1) {
		vscode.postMessage({
			command: 'showError',
			message: `${sectionType} must have at least one item.`
		})
	} else {
		vscode.postMessage({
			command: 'deleteItem',
			message: 'Are you sure you want to delete this item?',
			index
		})
	}
}

const confirmDeleteItem = (index: number) => {
	editableSection.value.splice(index, 1)
	isItemCollapsed.value.splice(index, 1)
}

const updateItem = (index: number, updatedItem: any) => {
	editableSection.value[index] = updatedItem
}

// const runObservations = () => {
// 	vscode.postMessage({
// 		command: 'runAllObservations',
// 		filePath: props.filePath
// 	})
// }

const runObservation = (index: number) => {
	vscode.postMessage({
		command: 'runObservation',
		filePath: props.filePath,
		observationName: editableSection.value[index].name
	})
}

const runScenario = (index: number) => {
	vscode.postMessage({
		command: 'runScenario',
		filePath: props.filePath,
		scenarioName: editableSection.value[index].name
	})
}

window.addEventListener('message', event => {
	const message = event.data
	switch (message.command) {
	case 'deleteItem':
		confirmDeleteItem(message.index)
		break
	}
})
</script>

<style scoped>
</style>
