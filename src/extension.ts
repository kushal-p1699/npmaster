import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

/**
 * This method is called when your extension is activated
 *
 * @param context - The extension context
 */
export function activate(context: vscode.ExtensionContext) {
  const updateContext = () => {
    vscode.commands.executeCommand("setContext", "npmaster.state", "loading");

    const folders = vscode.workspace.workspaceFolders;
    let hasNodeProject = false;

    if (folders && folders.length > 0) {
      for (const folder of folders) {
        const packageJsonPath = path.join(folder.uri.fsPath, "package.json");
        // Simulate async detection (replace with fs.promises if you want real async)
        if (fs.existsSync(packageJsonPath)) {
          hasNodeProject = true;
          break;
        }
      }
    }

    setTimeout(() => {
      vscode.commands.executeCommand(
        "setContext",
        "npmaster.state",
        hasNodeProject ? "detected" : "notDetected"
      );
    }, 500);
  };

  // run once on activation
  updateContext();

  // Update if workspace changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(updateContext)
  );
}

export function deactivate() {}
