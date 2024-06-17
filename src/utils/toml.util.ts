import * as vscode from 'vscode'
import * as toml from '@iarna/toml'
import * as fs from 'fs'
import * as path from 'path'

export async function getTomlFiles() {
	const workspaceFolders = vscode.workspace.workspaceFolders
	if (!workspaceFolders) return []

	const rootPath = workspaceFolders[0].uri.fsPath
	const files = await vscode.workspace.findFiles('**/*.toml')

	const tomlFiles = await Promise.all(
		files.map(async (file) => {
			const content = await vscode.workspace.fs.readFile(file)
			const parsedContent = toml.parse(content.toString())
			const relativePath = path.relative(rootPath, file.fsPath)
			return { path: file.fsPath, relativePath, content: parsedContent }
		})
	)

	tomlFiles.sort((a, b) => {
		const nameA = a.path.split('/').pop()?.toLowerCase() || ''
		const nameB = b.path.split('/').pop()?.toLowerCase() || ''
		return nameA.localeCompare(nameB)
	})

	return tomlFiles
}

export const handleDeleteFile = async (
	filePath: string,
	webview: vscode.Webview
) => {
	try {
		vscode.window
			.showWarningMessage(
				`Deleted file: ${filePath}`,
				{ modal: true, detail: 'This action cannot be undone' },
				'Yes'
			)
			.then(async (selection) => {
				if (selection === 'Yes') {
					fs.unlinkSync(filePath)
					vscode.window.showInformationMessage('File deleted')
					const tomlFiles = await getTomlFiles()
					webview.postMessage({ command: 'updateFiles', files: tomlFiles })
				}
			})
	} catch (err) {
		vscode.window.showErrorMessage(`Failed to delete file: ${filePath}`)
	}
}

export const handleOpenFile = (filePath: string) => {
	const openPath = vscode.Uri.file(filePath)
	vscode.workspace.openTextDocument(openPath).then((doc) => {
		vscode.window.showTextDocument(doc)
	})
}

export const handleSaveChanges = async (filePath: string, content: any) => {
	try {
		const newContent = toml.stringify(content.content)
		fs.writeFileSync(filePath, newContent)
	} catch (err) {
		vscode.window.showErrorMessage(`Failed to save file: ${filePath}`)
	}
}

const defaultContent = `debug_level = "info"
metrics_server_url = "http://cardamon.rootandbranch.io"

[[processes]]
type = "bare_metal"
name = "process_1"
command = ""

[[scenarios]]
name = "scenario_1"
desc = "Scenario description"
command = ""

[[observations]]
name = "observation_1"
processes = ["process_1"]
scenarios = ["scenario_1"]
iterations = 1
`

export const createTomlFile = async (webview: vscode.Webview) => {
	try {
		const workspaceFolders = vscode.workspace.workspaceFolders
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder found')
			return
		}

		const rootPath = workspaceFolders[0].uri.fsPath
		const filePath = path.join(
			rootPath,
			`new-cardamon-file-${Date.now()}.toml`
		)

		fs.writeFileSync(filePath, defaultContent)
		vscode.window.showInformationMessage(`Created new TOML file: ${filePath}`)
	} catch (err) {
		vscode.window.showErrorMessage(`Failed to create new TOML file`)
	} finally {
		const tomlFiles = await getTomlFiles()
		webview.postMessage({ command: 'updateFiles', files: tomlFiles })
	}
}

export const handleDeleteItem = async (message: string, index: number, webview: vscode.Webview) => {
	try {
		vscode.window.showWarningMessage(message, { modal: true, detail: 'This action cannot be undone' }, 'Yes').then((selection) => {
			if (selection === 'Yes') {
				webview.postMessage({ command: 'deleteItem', index })
			}
		})
	} catch (error) {
		vscode.window.showErrorMessage('Failed to delete item')
	}
}
