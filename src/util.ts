import * as vscode from "vscode";

export class ExtensionCommandError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options);
		this.name = this.constructor.name;
	}
}

export function wrapExtensionCommand(func: () => Promise<void>): () => Promise<void> {
	return async () => {
		try {
			await func();
		} catch (ex) {
			if (ex instanceof ExtensionCommandError) {
				vscode.window.showErrorMessage(ex.message);
			} else {
				throw ex;
			}
		}
	}
}
