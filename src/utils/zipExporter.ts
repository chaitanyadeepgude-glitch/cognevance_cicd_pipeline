import JSZip from 'jszip';
import { REPOSITORY_FILES } from '../data/repoFiles';

/**
 * Downloads the full project as a GitHub-ready ZIP archive.
 * Packages all app files, tests, workflows, docker configs, and documentation.
 */
export async function downloadProjectZip(onProgress?: (percent: number, status: string) => void): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('cognevance_cicd_pipeline');

  if (!rootFolder) {
    throw new Error('Could not create root zip directory');
  }

  // Attempt to fetch fresh files from backend API, fallback to embedded manifest
  let filesToZip: Array<{ path: string; content: string }> = [];

  try {
    const res = await fetch('/api/project-files');
    if (res.ok) {
      const data = await res.json();
      if (data.files && Array.isArray(data.files) && data.files.length > 0) {
        filesToZip = data.files.map((f: any) => ({
          path: f.relativePath,
          content: f.content,
        }));
      }
    }
  } catch (err) {
    console.warn('Backend /api/project-files unreachable, using embedded file manifest:', err);
  }

  // Fallback to embedded manifest if API was empty
  if (filesToZip.length === 0) {
    filesToZip = REPOSITORY_FILES.map((f) => ({
      path: f.path,
      content: f.content,
    }));
  }

  const total = filesToZip.length;
  filesToZip.forEach((file, index) => {
    rootFolder.file(file.path, file.content);
    if (onProgress) {
      const pct = Math.round(((index + 1) / total) * 60);
      onProgress(pct, `Packaging ${file.path}...`);
    }
  });

  if (onProgress) {
    onProgress(75, 'Compressing ZIP archive...');
  }

  const blob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    },
    (metadata) => {
      if (onProgress) {
        const pct = 75 + Math.round(metadata.percent * 0.25);
        onProgress(pct, `Compressing: ${Math.round(metadata.percent)}%`);
      }
    }
  );

  // Trigger browser download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cognevance_cicd_pipeline.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  if (onProgress) {
    onProgress(100, 'Download complete!');
  }
}
