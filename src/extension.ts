import * as vscode from "vscode";
import * as vscodeGit from "./git";
import {ExtensionCommandError, wrapExtensionCommand} from "./util";

const GIT_EXTENSION_ID = "vscode.git";
const EXCLUDE_PATH = [".git", "info", "exclude"];

export function activate(context: vscode.ExtensionContext): void {
	const openCmd = vscode.commands.registerCommand("git-exclude.openExcludeFile", openCmdFunc);
	const excludeCmd = vscode.commands.registerCommand("git-exclude.exclude", excludeCmdFunc);
	context.subscriptions.push(openCmd, excludeCmd);
}

const openCmdFunc = wrapExtensionCommand(async (): Promise<void> => {
	const gitApi = await getGitAPI();
	const repos = gitApi.repositories;
	if (repos.length == 0) {throw new ExtensionCommandError("No git repository open");}
	let repo;
	if (repos.length > 1) {
		repo = await pickRepo(repos);
		if (!repo) {return;}
	} else {
		repo = repos[0];
	}
	const repoUri = repo.rootUri;
	const excludeFullPath = vscode.Uri.joinPath(repoUri, ...EXCLUDE_PATH);
	await vscode.window.showTextDocument(excludeFullPath);
});

const excludeCmdFunc = wrapExtensionCommand(async (): Promise<void> => {
	// TODO: implement
	throw new ExtensionCommandError("NYI");
});

async function getGitAPI(): Promise<vscodeGit.API> {
	const git = vscode.extensions.getExtension<vscodeGit.GitExtension>(GIT_EXTENSION_ID);
	if (!git) {throw new ExtensionCommandError("Git extension not found");}
	return (await git.activate()).getAPI(1);
}

function pickRepo(repos: vscodeGit.Repository[]): Promise<vscodeGit.Repository | null> {
	return new Promise<vscodeGit.Repository | null>((resolve) => {
		const quickPick = vscode.window.createQuickPick<RepoQuickPickItem>();
		quickPick.placeholder = "Choose a repository";
		quickPick.items = repos.map((repo): RepoQuickPickItem => {
			const pathTerms = repo.rootUri.path.split("/");
			return {
				label: pathTerms[pathTerms.length - 1],
				description: repo.state.HEAD?.name,
				repo: repo
			};
		});
		let didAccept = false;
		quickPick.onDidAccept(() => {
			if (didAccept) {return;}
			didAccept = true;
			const chosenRepo = quickPick.selectedItems[0].repo;
			quickPick.hide();
			resolve(chosenRepo);
		});
		quickPick.onDidHide(() => {
			quickPick.dispose();
			if (!didAccept) {resolve(null);}
		});
		quickPick.show();
	});
}

interface RepoQuickPickItem extends vscode.QuickPickItem {
	repo: vscodeGit.Repository;
}
