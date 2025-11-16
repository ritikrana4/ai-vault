
import type { Folder } from '../types/index';

export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
}

export function buildFolderTree(folders: Folder[]): FolderTreeNode[] {
  const folderMap = new Map<string, FolderTreeNode>();
  const rootFolders: FolderTreeNode[] = [];

  folders.forEach(folder => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  folders.forEach(folder => {
    const node = folderMap.get(folder.id)!;
    
    if (!folder.parentId) {
      rootFolders.push(node);
    } else {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        rootFolders.push(node);
      }
    }
  });

  const sortFolders = (folders: FolderTreeNode[]) => {
    folders.sort((a, b) => a.name.localeCompare(b.name));
    folders.forEach(folder => {
      if (folder.children.length > 0) {
        sortFolders(folder.children);
      }
    });
  };

  sortFolders(rootFolders);

  return rootFolders;
}

