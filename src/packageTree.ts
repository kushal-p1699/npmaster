import * as vscode from "vscode";
import { NodeDependencies } from "./packageService";

export class PackageTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);
  }
}

export class PackageTreeProvider
  implements vscode.TreeDataProvider<PackageTreeItem>
{
  private _deps: NodeDependencies | null = null;
  private _onDidChangeTreeData = new vscode.EventEmitter<
    PackageTreeItem | undefined | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  setDeps(deps: NodeDependencies | null) {
    this._deps = deps;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: PackageTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: PackageTreeItem): PackageTreeItem[] {
    if (!this._deps) {
      return [];
    }

    if (!element) {
      return [
        new PackageTreeItem(
          "Dependencies",
          vscode.TreeItemCollapsibleState.Collapsed
        ),
        new PackageTreeItem(
          "Dev Dependencies",
          vscode.TreeItemCollapsibleState.Collapsed
        ),
      ];
    }

    if (element.label === "Dependencies") {
      return Object.entries(this._deps.dependencies).map(
        ([name, version]) => new PackageTreeItem(`${name}: ${version}`)
      );
    }

    if (element.label === "Dev Dependencies") {
      return Object.entries(this._deps.devDependencies).map(
        ([name, version]) => new PackageTreeItem(`${name}: ${version}`)
      );
    }

    return [];
  }
}
