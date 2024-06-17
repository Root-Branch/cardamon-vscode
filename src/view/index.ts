import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {
	FontAwesomeIcon,
	FontAwesomeLayers,
} from '@fortawesome/vue-fontawesome'

library.add(fas)
const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('FontAwesomeLayers', FontAwesomeLayers)

app.mount('#app')
