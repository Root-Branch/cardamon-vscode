import * as vscode from 'vscode'
import {
	createTomlFile,
	getTomlFiles,
	handleDeleteFile,
	handleDeleteItem,
	handleOpenFile,
	handleSaveChanges,
} from './utils/toml.util'
import { handleRunObservation, handleRunScenario } from './utils/command.util'
import { openWebview } from './utils/webview.util'

export const handleMessages = (webview: vscode.Webview) => {
	receiveMessages(webview)
	sendMessages(webview)
}

const receiveMessages = (webview: vscode.Webview) => {
	webview.onDidReceiveMessage(async (message) => {
		switch (message.command) {
		case 'fetchTomlFiles':
			const tomlFiles = await getTomlFiles()
			webview.postMessage({ command: 'updateFiles', files: tomlFiles })
			return
		case 'deleteFile':
			await handleDeleteFile(message.filePath, webview)
			break
		case 'openFile':
			handleOpenFile(message.filePath)
			break
		// case 'runAllObservations':
		// 	handleRunAllObservations(message.filePath)
		// 	break
		case 'runObservation':
			handleRunObservation(message.filePath, message.observationName)
			break
		case 'runScenario':
			handleRunScenario(message.filePath, message.scenarioName)
			break
		case 'saveChanges':
			await handleSaveChanges(message.filePath, message.content)
			break
		case 'createTomlFile':
			await createTomlFile(webview)
			break
		case 'openWebview':
			openWebview()
			break
		case 'deleteItem':
			await handleDeleteItem(message.message, message.index, webview)
			break
		case 'refreshFiles':
			vscode.window.showInformationMessage('Cardamon TOML files list refreshed')
			break
		case 'showError':
			vscode.window.showErrorMessage(message.message)
			break
		}
	})
}

const sendMessages = (webview: vscode.Webview) => {
	return
}
