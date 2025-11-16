export interface Document {
  id: string;
  originalName: string;
  fileName: string;
  mimetype: string;
  size: number;
  uploadDate: string;
  summary: string;
  markdown: string;
  folderId: string | null;
}

export interface DbDocument {
  id: string;
  original_name: string;
  file_name: string;
  storage_path: string;
  mimetype: string;
  size: number;
  upload_date: string;
  summary: string;
  markdown: string;
  folder_id: string | null;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface DbFolder {
  id: string;
  name: string;
  parent_id: string | null;
}

