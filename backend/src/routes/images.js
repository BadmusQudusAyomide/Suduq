import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const mimeMap = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif'
};

const extMap = {
  jpeg: 'jpg',
  jpg: 'jpg',
  png: 'png',
  webp: 'webp',
  avif: 'avif'
};

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function buildOutputName(originalName, extension) {
  const base = originalName.replace(/\.[^.]+$/, '');
  return `${base}-suduq.${extension}`;
}

function ensureFile(req, res, next) {
  if (!req.file) {
    return res.status(400).send('A file is required.');
  }

  return next();
}

async function sendRemoveBgError(response) {
  const text = await response.text();

  try {
    const parsed = JSON.parse(text);
    return parsed?.errors?.[0]?.title || parsed?.errors?.[0]?.detail || parsed?.message || text;
  } catch {
    return text || 'remove.bg request failed';
  }
}

router.post('/compress', upload.single('file'), ensureFile, async (req, res, next) => {
  try {
    const quality = Math.min(100, Math.max(1, toInt(req.body.quality, 80)));
    const format = String(req.body.format || 'webp').toLowerCase();
    const image = sharp(req.file.buffer).rotate();

    let output;
    let mimeType = mimeMap[format] || 'image/webp';
    let extension = extMap[format] || 'webp';

    if (format === 'png') {
      output = await image.png({ compressionLevel: 9 }).toBuffer();
      mimeType = 'image/png';
      extension = 'png';
    } else if (format === 'jpeg' || format === 'jpg') {
      output = await image.jpeg({ quality, mozjpeg: true }).toBuffer();
      mimeType = 'image/jpeg';
      extension = 'jpg';
    } else {
      output = await image.webp({ quality }).toBuffer();
      mimeType = 'image/webp';
      extension = 'webp';
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${buildOutputName(req.file.originalname, extension)}"`);
    return res.send(output);
  } catch (error) {
    return next(error);
  }
});

router.post('/resize', upload.single('file'), ensureFile, async (req, res, next) => {
  try {
    const width = toInt(req.body.width, null);
    const height = toInt(req.body.height, null);
    const format = String(req.body.format || 'png').toLowerCase();
    const fit = String(req.body.fit || 'inside').toLowerCase();
    const quality = Math.min(100, Math.max(1, toInt(req.body.quality, 90)));
    const withoutEnlargement = toBoolean(req.body.withoutEnlargement, true);
    let image = sharp(req.file.buffer).rotate();

    image = image.resize({
      width: width || undefined,
      height: height || undefined,
      fit,
      withoutEnlargement
    });

    let output;
    let mimeType = mimeMap[format] || 'image/png';
    let extension = extMap[format] || 'png';

    if (format === 'jpeg' || format === 'jpg') {
      output = await image
        .flatten({ background: '#ffffff' })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
      mimeType = 'image/jpeg';
      extension = 'jpg';
    } else if (format === 'webp') {
      output = await image.webp({ quality }).toBuffer();
      mimeType = 'image/webp';
      extension = 'webp';
    } else if (format === 'avif') {
      output = await image.avif({ quality }).toBuffer();
      mimeType = 'image/avif';
      extension = 'avif';
    } else {
      output = await image
        .png({ compressionLevel: 9 })
        .toBuffer();
      mimeType = 'image/png';
      extension = 'png';
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${buildOutputName(req.file.originalname, extension)}"`);
    return res.send(output);
  } catch (error) {
    return next(error);
  }
});

router.post('/convert', upload.single('file'), ensureFile, async (req, res, next) => {
  try {
    const format = String(req.body.format || 'png').toLowerCase();
    const image = sharp(req.file.buffer).rotate();
    let output;
    let mimeType = mimeMap[format] || 'image/png';
    let extension = extMap[format] || 'png';

    if (format === 'jpeg' || format === 'jpg') {
      output = await image.jpeg({ quality: 90, mozjpeg: true }).toBuffer();
      mimeType = 'image/jpeg';
      extension = 'jpg';
    } else if (format === 'webp') {
      output = await image.webp({ quality: 90 }).toBuffer();
      mimeType = 'image/webp';
      extension = 'webp';
    } else {
      output = await image.png({ compressionLevel: 9 }).toBuffer();
      mimeType = 'image/png';
      extension = 'png';
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${buildOutputName(req.file.originalname, extension)}"`);
    return res.send(output);
  } catch (error) {
    return next(error);
  }
});

router.post('/remove-bg', upload.single('file'), ensureFile, async (req, res, next) => {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return res.status(500).send('REMOVE_BG_API_KEY is not configured.');
    }

    const formData = new FormData();
    formData.append('size', String(req.body.size || 'auto'));
    formData.append('image_file', new Blob([req.file.buffer], { type: req.file.mimetype || 'application/octet-stream' }), req.file.originalname);

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey
      },
      body: formData
    });

    if (!response.ok) {
      const message = await sendRemoveBgError(response);
      return res.status(response.status).send(message);
    }

    const output = Buffer.from(await response.arrayBuffer());
    const mimeType = response.headers.get('content-type') || 'image/png';
    const extension = mimeType.includes('webp') ? 'webp' : mimeType.includes('jpg') || mimeType.includes('jpeg') ? 'jpg' : 'png';
    const base = req.file.originalname.replace(/\.[^.]+$/, '');

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${base}-suduq-no-bg.${extension}"`);
    return res.send(output);
  } catch (error) {
    return next(error);
  }
});

export default router;
