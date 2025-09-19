import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type TreeItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Converts a flat record of file paths to a nested tree structure
export function convertFilesToTreeItems(
  files: Record<string, string>
): TreeItem[] {
  const tree: Record<string, any> = {};

  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    const fileName = parts[parts.length - 1];
    current[fileName] = null; // null indicates a file
  }

  function convertNode(node: Record<string, any>, name?: string): TreeItem {
    const entries = Object.entries(node);
    if (entries.length === 0) {
      return name || "";
    }

    const children: TreeItem[] = [];
    for (const [key, value] of entries) {
      if (value === null) {
        children.push(key);
      } else {
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree) && typeof subTree[0] === "string") {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }
    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}