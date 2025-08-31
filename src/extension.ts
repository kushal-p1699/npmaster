import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getNodeDependencies } from "./packageService";
import { PackageTreeProvider } from "./packageTree";

/**
 * This method is called when your extension is activated
 *
 * @param context - The extension context
 */
export async function activate(context: vscode.ExtensionContext) {
  const treeProvider = new PackageTreeProvider();
  vscode.window.registerTreeDataProvider(
    "npmaster.installedPackages",
    treeProvider
  );

  const updateContext = async () => {
    vscode.commands.executeCommand(
      "setContext",
      "npmaster.hasNodeProject",
      undefined
    );

    const folders = vscode.workspace.workspaceFolders;
    let hasNodeProject = false;
    let deps = null;

    if (folders && folders.length > 0) {
      for (const folder of folders) {
        const packageJsonPath = path.join(folder.uri.fsPath, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          hasNodeProject = true;
          deps = await getNodeDependencies(folder.uri.fsPath);
          break;
        }
      }
    }

    setTimeout(() => {
      vscode.commands.executeCommand(
        "setContext",
        "npmaster.hasNodeProject",
        hasNodeProject
      );
      if (deps) {
        treeProvider.setDeps(deps);
      }
    }, 500);
  };

  updateContext();

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(updateContext)
  );
}

export function deactivate() {}
