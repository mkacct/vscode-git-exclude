import * as vscode from "vscode";
import * as vscodeGit from "./git";
import {ExtensionCommandError, wrapExtensionCommand} from "./util";

const GIT_EXTENSION_ID = "vscode.git";
const EXCLUDE_PATH = [".git", "info", "exclude"];

export function activate(context: vscode.ExtensionContext): void {
	const openCmd = vscode.commands.registerCommand("git-exclude-commands.openExcludeFile", openCmdFunc);
	// const excludeCmd = vscode.commands.registerCommand("git-exclude-commands.exclude", excludeCmdFunc);
	context.subscriptions.push(openCmd);
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
	await vscode.window.showTextDocument(getExcludeFullPath(repo));
});

// const excludeCmdFunc = wrapExtensionCommand(async (): Promise<void> => {
// 	throw new ExtensionCommandError("NYI");
// });

async function getGitAPI(): Promise<vscodeGit.API> {
	const git = vscode.extensions.getExtension<vscodeGit.GitExtension>(GIT_EXTENSION_ID);
	if (!git) {throw new ExtensionCommandError("Git extension not found");}
	return (await git.activate()).getAPI(1);
}

function getExcludeFullPath(repo: vscodeGit.Repository): vscode.Uri {
	return vscode.Uri.joinPath(repo.rootUri, ...EXCLUDE_PATH);
}

function pickRepo(repos: vscodeGit.Repository[]): Promise<vscodeGit.Repository | null> {
	return new Promise<vscodeGit.Repository | null>((resolve): void => {
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
