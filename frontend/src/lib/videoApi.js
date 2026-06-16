import { apiUrl } from './api-base';

function parseResponseError(message) {
  let errorMessage = message || 'Video download failed';

  try {
    const parsed = JSON.parse(message);
    errorMessage = parsed?.message || errorMessage;
  } catch {
    // Keep the raw text body when the server does not send JSON.
  }

  return errorMessage;
}

async function readError(response) {
  const message = await response.text();
  return parseResponseError(message);
}

async function requestJson(url, options) {
  const response = await fetch(apiUrl(url), options);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function startVideoDownload(platform, url) {
  return requestJson(`/api/video/${encodeURIComponent(platform)}/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });
}

export async function getVideoJob(jobId) {
  return requestJson(`/api/video/jobs/${encodeURIComponent(jobId)}`);
}

export async function cancelVideoJob(jobId) {
  return requestJson(`/api/video/jobs/${encodeURIComponent(jobId)}`, {
    method: 'DELETE'
  });
}

export async function downloadVideoFile(jobId) {
  const response = await fetch(apiUrl(`/api/video/jobs/${encodeURIComponent(jobId)}/file`));

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition') || '';
  const match = contentDisposition.match(/filename="?([^"]+)"?/i);

  return {
    blob,
    filename: match?.[1] || 'video.mp4'
  };
}

export async function waitForVideoJob(jobId, onUpdate, pollInterval = 1000) {
  while (true) {
    const job = await getVideoJob(jobId);

    if (typeof onUpdate === 'function') {
      onUpdate(job);
    }

    if (['done', 'failed', 'cancelled'].includes(job.status)) {
      return job;
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, pollInterval);
    });
  }
}
