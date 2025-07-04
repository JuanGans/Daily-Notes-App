// src/routes/notes/upload.ts
import { Router } from 'express';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

const router = Router();

const uploadDir = path.join(process.cwd(), 'public/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

router.post('/upload', (req, res) => {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    filename: (_name, _ext, part) => {
      const timestamp = Date.now();
      return `${timestamp}-${part.originalFilename}`;
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('❌ Upload error:', err);
      return res.status(500).json({ message: 'File upload failed' });
    }

    const file = files.image;
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    if (!uploadedFile?.filepath) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filename = path.basename(uploadedFile.filepath);
    const imageUrl = `http://localhost:5002/uploads/${filename}`;
    console.log('✅ File uploaded to:', uploadedFile.filepath);
    return res.status(200).json({ url: imageUrl });
  });
});

export default router;
