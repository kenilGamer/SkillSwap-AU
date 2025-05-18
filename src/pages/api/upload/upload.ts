import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

// ✅ Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Async function to handle file parsing
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false, // Allow single file only (change to `true` for multiple)
    });

    // ✅ Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

// ✅ API Route Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔄 Parsing form...');
    const { files } = await parseForm(req);
    console.log('📂 Files received:', files);

    const file = files.avatar as File | File[];

    if (!file) {
      console.log('⚠️ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // ✅ Handle single or multiple file cases
    const uploadedFile = Array.isArray(file) ? file[0] : file;
    console.log('✅ Uploaded file:', uploadedFile);

    // ✅ Ensure correct filename handling
    const filePath = `/uploads/${uploadedFile.newFilename}`;
    console.log('📁 File saved at:', filePath);

    return res.status(200).json({ message: 'Upload successful', filePath });
  } catch (error) {
    console.error('❌ File upload error:', error);
    return res.status(500).json({ error: 'File upload error' });
  }
}
