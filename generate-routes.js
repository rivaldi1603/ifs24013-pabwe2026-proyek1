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
const cssLinkRegex = /<link\s+rel="stylesheet"\s+crossorigin\s+href="(\/assets\/[^"]+\.css)">/i;
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
  'login',
  'register',
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

const assetsDir = path.join(distDir, 'assets');
const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];

const routeChunkMap = {
  'admin': 'AdminView',
  'dashboard': 'DashboardView',
  'profil': 'ProfileView',
  'profile': 'ProfileView',
  'settings': 'ProfileView',
  'pengaturan': 'ProfileView',
  'destinasi': 'DestinationsView',
  'jasa-lokal': 'ServicesView',
  'transportasi': 'TransportView',
  'kuliner': 'CulinaryView',
  'cerita': 'ArticlesView',
  'auth/login': 'LoginView',
  'auth/register': 'LoginView',
  'login': 'LoginView',
  'register': 'LoginView'
};

for (const route of routes) {
  let routeHtml = html;
  const chunkPrefix = routeChunkMap[route];

  if (chunkPrefix && assetFiles.length > 0) {
    const jsChunk = assetFiles.find(f => f.startsWith(`${chunkPrefix}-`) && f.endsWith('.js'));
    const cssChunk = assetFiles.find(f => f.startsWith(`${chunkPrefix}-`) && f.endsWith('.css'));
    const apiChunk = assetFiles.find(f => f.startsWith('api-') && f.endsWith('.js'));

    let preloadTags = '';
    if (apiChunk) {
      preloadTags += `<link rel="modulepreload" crossorigin href="/assets/${apiChunk}">`;
    }
    if (jsChunk) {
      preloadTags += `<link rel="modulepreload" crossorigin href="/assets/${jsChunk}">`;
    }
    if (cssChunk) {
      const cssPath = path.join(assetsDir, cssChunk);
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        preloadTags += `<style>${cssContent}</style>`;
      }
    }
    routeHtml = routeHtml.replace('</head>', `${preloadTags}</head>`);
  }

  if (route === '404') {
    fs.writeFileSync(path.join(distDir, '404.html'), routeHtml);
  } else {
    const dirPath = path.join(distDir, route);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, 'index.html'), routeHtml);
  }
}

console.log(`Generated route-optimized static fallback routes for ${routes.length} paths successfully.`);
