const vscode = require("vscode");
const {ExtensionCommandError, wrapExtensionCommand} = require("./util");

const EXCLUDE_PATH = [".git", "info", "exclude"];

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const openCmd = vscode.commands.registerCommand("git-exclude.openExcludeFile", openCmdFunc);
	const excludeCmd = vscode.commands.registerCommand("git-exclude.exclude", excludeCmdFunc);
	context.subscriptions.push(openCmd, excludeCmd);
}

async function getGitAPI() {
	const git = vscode.extensions.getExtension("vscode.git");
	if (!git) {throw new ExtensionCommandError("Git extension not found");}
	return (await git.activate()).getAPI(1);
}

async function getExcludeFullPath(gitApi) {
	const repos = gitApi.repositories;
	if (repos.length == 0) {throw new ExtensionCommandError("No git repository open");}
	let repo;
	if (repos.length > 1) {
		throw new ExtensionCommandError("Multiple repositories is not supported");
	} else {
		repo = repos[0];
	}
	const repoUri = repo.rootUri;
	return vscode.Uri.joinPath(repoUri, ...EXCLUDE_PATH);
}

const openCmdFunc = wrapExtensionCommand(async () => {
	const gitApi = await getGitAPI();
	await vscode.window.showTextDocument(await getExcludeFullPath(gitApi));
});

const excludeCmdFunc = wrapExtensionCommand(async () => {
	// TODO: implement
	throw new ExtensionCommandError("NYI");
});

module.exports = {activate};
