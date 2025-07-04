import { IncomingForm, File } from 'formidable';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method not allowed');
  }

  const uploadDir = path.join(process.cwd(), '/public/uploads');

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }

    // 'image' sesuai dengan nama field upload di form
    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Kalau multiple files, ambil yang pertama
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    // Path file yang sudah diupload
    const filename = path.basename(uploadedFile.filepath || uploadedFile.filepath);

    return res.status(200).json({ url: `/uploads/${filename}` });
  });
}
