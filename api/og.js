import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminDb } from './_firebase.js';
import { createOgHandler } from './_og-boundary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveDistIndex() {
  const candidates = [
    path.join(__dirname, '..', 'dist', 'index.html'),
    path.join(__dirname, '..', '..', 'dist', 'index.html'),
    path.join(process.cwd(), 'dist', 'index.html'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return fs.readFileSync(candidate, 'utf8');
    } catch {}
  }
  return null;
}

export default createOgHandler({ db: adminDb, loadHtml: resolveDistIndex });
