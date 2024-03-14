const vscode = require("vscode");

class ExtensionCommandError extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = this.constructor.name;
	}
}

async function wrapExtensionCommand(f) {
	try {
		return await f();
	} catch (ex) {
		if (ex instanceof ExtensionCommandError) {
			vscode.window.showErrorMessage(ex.message);
		} else {
			throw ex;
		}
	}
}

module.exports = {
	ExtensionCommandError,
	wrapExtensionCommand
};
