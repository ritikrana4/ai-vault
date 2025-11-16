import { Router, Request, Response } from 'express';
import multer from 'multer';
import { upload } from './config';
import * as services from './services';

const router = Router();


router.post('/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folderId = req.body.folderId ? String(req.body.folderId) : null;
    const document = await services.uploadDocument(req.file, folderId);

    res.json({ success: true, document });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
});

router.get('/documents', async (req: Request, res: Response) => {
  try {
    const folderParam = req.query.folderId;
    const folderId = folderParam === undefined ? null : (folderParam === 'null' ? null : String(folderParam));

    const result = await services.getAllDocuments(folderId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.get('/documents/:id', async (req: Request, res: Response) => {
  try {
    const document = await services.getDocumentById(req.params.id);
    res.json(document);
  } catch (error: any) {
    const status = error.message === 'Document not found' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
});


router.get('/folders', async (_req: Request, res: Response) => {
  try {
    const folders = await services.getAllFolders();
    res.json(folders);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

router.post('/folders', async (req: Request, res: Response) => {
  try {
    const { name, parent } = req.body;
    const folder = await services.createFolder(name, parent);

    res.status(201).json({ success: true, folder });
  } catch (error: any) {
    const status = error.message === 'Parent folder not found' ? 404 :
                   error.message === 'Folder already exists' ? 409 : 400;
    res.status(status).json({ error: error.message });
  }
});

router.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 50MB)' : err.message });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

router.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default router;

