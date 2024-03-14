const vscode = require("vscode");
const {ExtensionCommandError, wrapExtensionCommand} = require("./util");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const openCmd = vscode.commands.registerCommand("git-exclude.openExcludeFile", async () => {
		await wrapExtensionCommand(async () => {
			const git = vscode.extensions.getExtension("vscode.git");
			if (!git) {throw new ExtensionCommandError("Git extension not found");}
			const gitApi = git.exports.getAPI(1);
			// TODO: implement
			throw new Error("NYI");
		});
	});

	const excludeCmd = vscode.commands.registerCommand("git-exclude.exclude", () => {
		// TODO: implement
		throw new Error("NYI");
	});

	context.subscriptions.push(openCmd, excludeCmd);
}

module.exports = {activate};
