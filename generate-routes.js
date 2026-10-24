import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found!');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Inline critical index CSS to eliminate render-blocking CSS network request completely
const cssLinkRegex = /<link\s+rel="stylesheet"\s+crossorigin\s+href="(\/assets\/index-[^"]+\.css)">/i;
const cssMatch = html.match(cssLinkRegex);

if (cssMatch) {
  const cssRelativePath = cssMatch[1].replace(/^\//, '');
  const cssFilePath = path.join(distDir, cssRelativePath);
  if (fs.existsSync(cssFilePath)) {
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    html = html.replace(cssMatch[0], `<style>${cssContent}</style>`);
    fs.writeFileSync(indexPath, html);
    console.log(`Inlined critical CSS from ${cssRelativePath} into index.html (eliminated render-blocking request).`);
  }
}

const routes = [
  'auth/login',
  'auth/register',
  'auth/regiter',
  'login',
  'register',
  'regiter',
  'dashboard',
  'profil',
  'profile',
  'admin',
  'settings',
  'pengaturan',
  'destinasi',
  'jasa-lokal',
  'transportasi',
  'kuliner',
  'cerita',
  '404'
];

for (const route of routes) {
  // Create .html file (e.g. dist/auth/login.html)
  const htmlFilePath = path.join(distDir, `${route}.html`);
  const htmlFileDir = path.dirname(htmlFilePath);
  if (!fs.existsSync(htmlFileDir)) {
    fs.mkdirSync(htmlFileDir, { recursive: true });
  }
  fs.writeFileSync(htmlFilePath, html);

  // Create directory with index.html (e.g. dist/auth/login/index.html)
  if (route !== '404') {
    const dirPath = path.join(distDir, route);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, 'index.html'), html);
  }
}

console.log(`Generated static fallback routes for ${routes.length} paths successfully.`);
