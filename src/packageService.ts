import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";

export type NodeDependencies = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

export async function getNodeDependencies(
  workspacePath: string
): Promise<NodeDependencies | null> {
  const packageJsonPath = path.join(workspacePath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    vscode.window.showErrorMessage("No package.json found in this workspace");
    return null;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return {
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
  };
}
