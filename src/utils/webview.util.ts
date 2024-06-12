import * as vscode from 'vscode'

export const openWebview = () => {
	try {
		vscode.window
			.showWarningMessage(
				'Open Cardamon Dashboard?',
				{
					modal: true,
					detail:
            'This will open the Cardamon Dashboard in your default browser',
				},
				'Yes'
			)
			.then((selection) => {
				if (selection === 'Yes') {
					const url = vscode.Uri.parse('http://localhost:5173/')
					vscode.env.openExternal(url)
				}
			})
	} catch (err) {
		vscode.window.showErrorMessage(`Failed to open Cardamon Dashboard`)
	}
}
