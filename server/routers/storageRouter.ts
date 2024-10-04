import { Router } from 'express';
import multer from 'multer';
import { createBlob, deleteBlob } from '../storage/client';
import { type UploadResponse, type DeleteResponse } from '@packages/types';

const router = Router();
let upload = multer();

router.post('/storage/upload', upload.single('file'), async (req, res) => {
  try {
    const blob = new Blob([req.file.buffer]);
    const url = await createBlob({ blob: blob, blobName: req.file.originalname });

    if (url == null) {
      res
        .status(500)
        .json({
          success: false,
          message: `Failed to upload ${req.file.originalname}`,
        } satisfies UploadResponse);
    }

    res.status(201).json({ success: true, url: url });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' } satisfies UploadResponse);
  }
});

router.post('/storage/delete', async (req, res) => {
  try {
    const filename = req.body.name;

    if (filename == null) {
      res
        .status(400)
        .json({ success: false, message: 'Missing name property' } satisfies DeleteResponse);
    }

    const del = await deleteBlob(filename);

    if (del == null) {
      res
        .status(500)
        .json({ success: false, message: `Failed to delete ${filename}` } satisfies DeleteResponse);
    }

    if (del.errorCode != null) {
      res
        .status(500)
        .json({
          success: false,
          message: `Failed to delete ${filename}`,
          response: del,
        } satisfies DeleteResponse);
    }

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
