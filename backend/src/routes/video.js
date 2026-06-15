import { promises as fs } from 'fs';
import crypto from 'crypto';
import { dirname, join, resolve } from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import YTDlpWrapModule from 'yt-dlp-wrap';
import ffmpegPath from 'ffmpeg-static';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const cacheDir = resolve(__dirname, '..', '..', '.cache', 'yt-dlp');
const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const binaryPath = join(cacheDir, binaryName);
const YTDlpWrap = YTDlpWrapModule.default || YTDlpWrapModule;
const ytDlpWrap = new YTDlpWrap(binaryPath);
const jobs = new Map();
const cleanupTimers = new Map();
let binaryDownloadPromise = null;

const platformPresets = {
  youtube: {
    label: 'YouTube',
    description: 'Best quality with merged audio and video.',
    format: 'bv*+ba/b',
    mergeOutputFormat: 'mp4'
  },
  tiktok: {
    label: 'TikTok',
    description: 'Optimized for short-form MP4 clips.',
    format: 'best[ext=mp4]/best',
    mergeOutputFormat: 'mp4'
  },
  instagram: {
    label: 'Instagram',
    description: 'Keeps reels and posts in a shareable MP4 flow.',
    format: 'best[ext=mp4]/best',
    mergeOutputFormat: 'mp4'
  },
  facebook: {
    label: 'Facebook',
    description: 'General-purpose MP4 preset for public video links.',
    format: 'bv*+ba/b',
    mergeOutputFormat: 'mp4'
  },
  x: {
    label: 'X',
    description: 'Balanced preset for public X video posts.',
    format: 'bv*+ba/b',
    mergeOutputFormat: 'mp4'
  },
  linkedin: {
    label: 'LinkedIn',
    description: 'Balanced MP4 preset for public LinkedIn videos.',
    format: 'bv*+ba/b',
    mergeOutputFormat: 'mp4'
  }
};

function sanitizeSegment(value, fallback = 'video') {
  return String(value || fallback)
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || fallback;
}

function parseUrl(value) {
  try {
    const parsed = new URL(String(value || ''));

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function getPlatformPreset(platform) {
  return platformPresets[platform] || platformPresets.youtube;
}

function serializeJob(job) {
  if (!job) {
    return null;
  }

  return {
    id: job.id,
    platform: job.platform,
    preset: {
      label: job.preset.label,
      description: job.preset.description
    },
    url: job.url,
    title: job.title,
    filename: job.filename,
    status: job.status,
    progress: job.progress,
    totalSize: job.totalSize,
    currentSpeed: job.currentSpeed,
    eta: job.eta,
    error: job.error,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    downloadUrl: job.status === 'done' ? `/api/video/jobs/${job.id}/file` : null
  };
}

function writeJob(job, patch) {
  Object.assign(job, patch, {
    updatedAt: new Date().toISOString()
  });
  return job;
}

function scheduleCleanup(jobId, delayMs = 30 * 60 * 1000) {
  const existing = cleanupTimers.get(jobId);

  if (existing) {
    clearTimeout(existing);
  }

  cleanupTimers.set(
    jobId,
    setTimeout(async () => {
      const job = jobs.get(jobId);

      try {
        if (job?.tempDir) {
          await fs.rm(job.tempDir, { recursive: true, force: true });
        }
      } finally {
        jobs.delete(jobId);
        cleanupTimers.delete(jobId);
      }
    }, delayMs)
  );
}

async function ensureYtDlpBinary() {
  try {
    await fs.access(binaryPath);
    return binaryPath;
  } catch {
    // Download the binary once and reuse it until the cache is removed.
  }

  if (!binaryDownloadPromise) {
    binaryDownloadPromise = fs.mkdir(cacheDir, { recursive: true }).then(() =>
      YTDlpWrap.downloadFromGithub(binaryPath, undefined, process.platform)
    );
  }

  await binaryDownloadPromise;
  return binaryPath;
}

async function startJob(job) {
  try {
    writeJob(job, { status: 'initializing', error: null });
    await ensureYtDlpBinary();

    const info = await ytDlpWrap.getVideoInfo(job.url);
    const title = sanitizeSegment(info?.title, job.preset.label.toLowerCase());
    const id = sanitizeSegment(info?.id, job.id);
    const outputTemplate = join(job.tempDir, `${title}-${id}.%(ext)s`);
    const ytDlpArguments = [
      job.url,
      '--no-playlist',
      '-f',
      job.preset.format,
      '--merge-output-format',
      job.preset.mergeOutputFormat,
      '--restrict-filenames',
      '-o',
      outputTemplate
    ];

    if (ffmpegPath) {
      ytDlpArguments.push('--ffmpeg-location', ffmpegPath);
    }

    writeJob(job, {
      title: info?.title || job.preset.label,
      status: 'downloading',
      progress: 0,
      totalSize: '',
      currentSpeed: '',
      eta: ''
    });

    const emitter = ytDlpWrap.exec(
      ytDlpArguments,
      {
        maxBuffer: 10 * 1024 * 1024
      },
      job.abortController.signal
    );

    emitter.on('progress', (progress) => {
      writeJob(job, {
        status: 'downloading',
        progress: Math.max(job.progress || 0, Math.round(progress.percent || 0)),
        totalSize: progress.totalSize || '',
        currentSpeed: progress.currentSpeed || '',
        eta: progress.eta || ''
      });
    });

    await new Promise((resolve, reject) => {
      let settled = false;

      emitter.on('close', (code) => {
        if (settled) {
          return;
        }

        settled = true;

        if (code === 0) {
          resolve();
          return;
        }

        reject(new Error(`yt-dlp exited with code ${code ?? 'unknown'}.`));
      });

      emitter.on('error', (error) => {
        if (settled) {
          return;
        }

        settled = true;
        reject(error);
      });
    });

    writeJob(job, { status: 'packaging' });

    const entries = await fs.readdir(job.tempDir, { withFileTypes: true });
    const outputEntry = entries.find((entry) => entry.isFile() && !entry.name.endsWith('.part'));

    if (!outputEntry) {
      throw new Error('The downloader finished without producing a file.');
    }

    writeJob(job, {
      status: 'done',
      progress: 100,
      filename: outputEntry.name,
      outputPath: join(job.tempDir, outputEntry.name)
    });

    scheduleCleanup(job.id);
  } catch (error) {
    if (error?.name === 'AbortError') {
      writeJob(job, { status: 'cancelled', error: 'Download cancelled.' });
    } else {
      writeJob(job, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Video download failed.'
      });
    }

    scheduleCleanup(job.id, 15 * 60 * 1000);
  }
}

router.post('/:platform/download', async (req, res) => {
  const platform = String(req.params.platform || '').toLowerCase();
  const videoUrl = parseUrl(req.body?.url);

  if (!platformPresets[platform]) {
    return res.status(400).json({ message: 'Unsupported video platform.' });
  }

  if (!videoUrl) {
    return res.status(400).json({ message: 'A valid video URL is required.' });
  }

  const job = {
    id: crypto.randomUUID(),
    platform,
    preset: getPlatformPreset(platform),
    url: videoUrl,
    title: null,
    filename: null,
    status: 'queued',
    progress: 0,
    totalSize: '',
    currentSpeed: '',
    eta: '',
    error: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tempDir: await fs.mkdtemp(join(os.tmpdir(), 'suduq-video-')),
    outputPath: null,
    abortController: new AbortController()
  };

  jobs.set(job.id, job);
  void startJob(job);

  return res.status(202).json(serializeJob(job));
});

router.get('/jobs/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ message: 'Video job not found.' });
  }

  return res.json(serializeJob(job));
});

router.get('/jobs/:jobId/file', async (req, res, next) => {
  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ message: 'Video job not found.' });
  }

  if (job.status !== 'done' || !job.outputPath || !job.filename) {
    return res.status(409).json({ message: 'The download is not ready yet.' });
  }

  try {
    return res.download(job.outputPath, job.filename);
  } catch (error) {
    return next(error);
  }
});

router.delete('/jobs/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ message: 'Video job not found.' });
  }

  if (job.status === 'queued' || job.status === 'initializing' || job.status === 'downloading' || job.status === 'packaging') {
    job.abortController.abort();
  }

  return res.json(serializeJob(job));
});

export default router;
