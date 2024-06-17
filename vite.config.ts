import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
	lib: {
		entry: './src/view/index.ts',
		formats: ['es', 'cjs'],
		fileName: (format) => `index.${format}.js`
	},
	emptyOutDir: false,
	outDir: 'dist/compiled'
},
});
