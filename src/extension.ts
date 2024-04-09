import * as vscode from "vscode";
import {ExtensionCommandError, wrapExtensionCommand} from "./util";

const EXCLUDE_PATH = [".git", "info", "exclude"];

export function activate(context: vscode.ExtensionContext): void {
	const openCmd = vscode.commands.registerCommand("git-exclude.openExcludeFile", openCmdFunc);
	const excludeCmd = vscode.commands.registerCommand("git-exclude.exclude", excludeCmdFunc);
	context.subscriptions.push(openCmd, excludeCmd);
}

async function getGitAPI(): Promise<any> {
	const git = vscode.extensions.getExtension("vscode.git");
	if (!git) {throw new ExtensionCommandError("Git extension not found");}
	return (await git.activate()).getAPI(1);
}

async function getExcludeFullPath(gitApi: any): Promise<vscode.Uri> {
	const repos = gitApi.repositories;
	if (repos.length == 0) {throw new ExtensionCommandError("No git repository open");}
	let repo;
	if (repos.length > 1) {
		throw new ExtensionCommandError("NYI: multiple git repositories open"); // TODO: implement
	} else {
		repo = repos[0];
	}
	const repoUri = repo.rootUri;
	return vscode.Uri.joinPath(repoUri, ...EXCLUDE_PATH);
}

const openCmdFunc = wrapExtensionCommand(async (): Promise<void> => {
	const gitApi = await getGitAPI();
	await vscode.window.showTextDocument(await getExcludeFullPath(gitApi));
});

const excludeCmdFunc = wrapExtensionCommand(async (): Promise<void> => {
	// TODO: implement
	throw new ExtensionCommandError("NYI");
});
