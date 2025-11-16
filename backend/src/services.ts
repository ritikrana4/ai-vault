import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import { supabase, summaryModel, markdownModel } from './config';
import type { DbDocument, Document, DbFolder } from './types';

async function loadDocument(filePath: string, mimetype: string): Promise<string> {
  let loader;
  let docs;

  switch (mimetype) {
    case 'application/pdf':
      loader = new PDFLoader(filePath);
      docs = await loader.load();
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      loader = new DocxLoader(filePath);
      docs = await loader.load();
      break;
    case 'text/plain':
    case 'text/markdown':
      loader = new TextLoader(filePath);
      docs = await loader.load();
      break;
    case 'application/msword':
      const content = await fs.readFile(filePath, 'utf-8');
      const cleaned = content.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleaned.length < 50) throw new Error('Unable to extract text from .DOC file');
      docs = [{ pageContent: cleaned, metadata: {} }];
      break;
    default:
      throw new Error(`Unsupported file type: ${mimetype}`);
  }

  return docs.map(doc => doc.pageContent).join('\n\n');
}

async function processWithAI(text: string, originalName: string) {
  const truncatedText = text.substring(0, 100000);

  const summaryPrompt = PromptTemplate.fromTemplate(
    `Create a concise summary in ONE PARAGRAPH (4-5 sentences) for: {documentName}\n\n{documentText}`
  );

  const markdownPrompt = PromptTemplate.fromTemplate(
    `Convert this document into clean markdown format. Return ONLY the markdown content without wrapping it in code blocks or backticks.\n\nDocument: {documentName}\nContent: {documentText}`
  );

  const summaryChain = summaryPrompt.pipe(summaryModel).pipe(new StringOutputParser());
  const markdownChain = markdownPrompt.pipe(markdownModel).pipe(new StringOutputParser());

  const [summary, markdown] = await Promise.all([
    summaryChain.invoke({ documentName: originalName, documentText: truncatedText }),
    markdownChain.invoke({ documentName: originalName, documentText: truncatedText }),
  ]);

  let normalizedMarkdown = markdown
    .replace(/\\n/g, '\n')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\r/g, '\n');

  // Remove markdown code block wrapping if present
  const codeBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/;
  const match = normalizedMarkdown.trim().match(codeBlockRegex);
  if (match) {
    normalizedMarkdown = match[1];
  }

  return { summary, markdown: normalizedMarkdown };
}

function transformDocument(dbDoc: DbDocument | null): Document | null {
  if (!dbDoc) return null;
  return {
    id: dbDoc.id,
    originalName: dbDoc.original_name,
    fileName: dbDoc.file_name,
    mimetype: dbDoc.mimetype,
    size: dbDoc.size,
    uploadDate: dbDoc.upload_date,
    summary: dbDoc.summary,
    markdown: dbDoc.markdown,
    folderId: dbDoc.folder_id ?? null,
  };
}

export async function uploadDocument(file: Express.Multer.File, folderId: string | null) {
  const fileId = uuidv4();

  try {
    if (folderId) {
      const { data: folder } = await supabase.from('folders').select('id').eq('id', folderId).single();
      if (!folder) throw new Error('Folder not found');
    }

    const text = await loadDocument(file.path, file.mimetype);
    const { summary, markdown } = await processWithAI(text, file.originalname);

    const fileBuffer = await fs.readFile(file.path);
    const storagePath = `${fileId}/${file.originalname}`;

    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(storagePath, fileBuffer, { contentType: file.mimetype });

    if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`);

    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        id: fileId,
        original_name: file.originalname,
        file_name: file.filename,
        storage_path: storagePath,
        mimetype: file.mimetype,
        size: file.size,
        folder_id: folderId,
        summary,
        markdown,
      })
      .select()
      .single();

    if (dbError) {
      await supabase.storage.from('documents').remove([storagePath]);
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    await fs.remove(file.path);
    return transformDocument(document);
  } catch (error: any) {
    await fs.remove(file.path).catch(() => {});
    throw error;
  }
}

export async function getAllDocuments(folderId: string | null) {
  let documentQuery = supabase.from('documents').select('*').order('upload_date', { ascending: false });

  if (folderId !== null) {
    documentQuery = documentQuery.eq('folder_id', folderId);
  }

  const { data: documents, error: docError } = await documentQuery;
  if (docError) throw docError;

  let folderQuery = supabase.from('folders').select('id, name, parent_id').order('name', { ascending: true });

  folderQuery = folderId === null
    ? folderQuery.is('parent_id', null)
    : folderQuery.eq('parent_id', folderId);

  const { data: folders, error: folderError } = await folderQuery;
  if (folderError) throw folderError;

  return {
    documents: (documents || []).map(transformDocument).filter((d): d is Document => d !== null),
    folders: folders || [],
  };
}

export async function getDocumentById(id: string) {
  const { data: document, error } = await supabase.from('documents').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') throw new Error('Document not found');
    throw error;
  }

  return transformDocument(document);
}



export async function getAllFolders(): Promise<DbFolder[]> {
  const { data: folders, error } = await supabase
    .from('folders')
    .select('id, name, parent_id')
    .order('name', { ascending: true });

  if (error) throw error;
  return folders || [];
}

export async function createFolder(name: string, parentId: string | null): Promise<DbFolder> {
  if (!name || name.trim().length === 0) {
    throw new Error('Folder name is required');
  }

  if (!/^[a-zA-Z0-9-_ ]+$/.test(name.trim())) {
    throw new Error('Folder name can only contain letters, numbers, spaces, hyphens, and underscores');
  }

  if (parentId && parentId !== 'root') {
    const { data: parent } = await supabase.from('folders').select('id').eq('id', parentId).single();
    if (!parent) throw new Error('Parent folder not found');
  } else if (parentId === 'root') {
    parentId = null;
  }

  const { data, error } = await supabase
    .from('folders')
    .insert([{ name: name.trim(), parent_id: parentId }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('Folder already exists');
    throw error;
  }

  return data;
}

