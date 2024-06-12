import * as vscode from 'vscode'
import { handleMessages } from './messenger'
export class BaseViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'cardamon-sidebar'

	public _view?: vscode.WebviewView

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		this._view = webviewView

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'dist')],
		}

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, 'dist', 'compiled', 'index.es.js')
		)
		const styleMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, 'dist', 'output.css')
		)

		handleMessages(webview)

		return `
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="${styleMainUri}" rel="stylesheet">
              <title>Base View Extension</title>
          </head>
          <body>
              <div id="app">Loading...</div>
              <h1 id="title"></h1>
              <script>
                  const vscode = acquireVsCodeApi();
              </script>
              <script type="module" src="${scriptUri}"></script>
          </body>
      </html>`
	}
}
