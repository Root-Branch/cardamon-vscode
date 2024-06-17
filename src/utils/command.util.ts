import * as vscode from 'vscode'

// export const handleRunAllObservations = (filePath: string) => {
// 	//TODO: Implement run all observations
// 	const terminal = vscode.window.createTerminal({
// 		name: `Run ${filePath.split('/').pop()}`,
// 		cwd: filePath.substring(0, filePath.lastIndexOf('/')),
// 	})
// 	terminal.sendText(`cd ${filePath.substring(0, filePath.lastIndexOf('/'))}`)
// 	terminal.sendText('cardamon run --name="test"')
// 	terminal.show()
// }

export const handleRunObservation = (filePath: string, observationName: string) => {
	const terminal = vscode.window.createTerminal({
		name: `Run ${filePath.split('/').pop()}`,
		cwd: filePath.substring(0, filePath.lastIndexOf('/')),
	})
	terminal.sendText(`cd ${filePath.substring(0, filePath.lastIndexOf('/'))}`)
	terminal.sendText(`cardamon run ${observationName}`)
	terminal.show()
}

export const handleRunScenario = (filePath: string, scenarioName: string) => {
	const terminal = vscode.window.createTerminal({
		name: `Run ${filePath.split('/').pop()}`,
		cwd: filePath.substring(0, filePath.lastIndexOf('/')),
	})
	terminal.sendText(`cd ${filePath.substring(0, filePath.lastIndexOf('/'))}`)
	terminal.sendText(`cardamon run ${scenarioName}`)
	terminal.show()
}
