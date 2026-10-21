const fs = require('fs');
const path = require('path');

const handlerPath = path.resolve(__dirname, '../.open-next/server-functions/default/handler.mjs');

if (!fs.existsSync(handlerPath)) {
  console.log('[patch-opennext] handler.mjs not found at:', handlerPath);
  process.exit(0);
}

let content = fs.readFileSync(handlerPath, 'utf8');
let patched = 0;

// 1. Patch findDir
if (content.includes('function findDir($dir, $name) {') && !content.includes('/* patch:findDir */')) {
  content = content.replace(
    'function findDir($dir, $name) {',
    'function findDir($dir, $name) {\n            /* patch:findDir */ $dir = typeof $dir === "string" ? $dir.replace(/\\\\/g, "/") : $dir;'
  );
  patched++;
  console.log('[patch-opennext] Patched findDir');
}

// 2. Patch loadManifest
if (content.includes('function loadManifest(path2, shouldCache = true, cache = sharedCache) {') && !content.includes('/* patch:loadManifest */')) {
  content = content.replace(
    'function loadManifest(path2, shouldCache = true, cache = sharedCache) {',
    'function loadManifest(path2, shouldCache = true, cache = sharedCache) {\n            /* patch:loadManifest */ path2 = typeof path2 === "string" ? path2.replace(/\\\\/g, "/") : path2;'
  );
  patched++;
  console.log('[patch-opennext] Patched loadManifest');
}

// 3. Patch evalManifest
if (content.includes('function evalManifest(path2, shouldCache = true, cache = sharedCache) {') && !content.includes('/* patch:evalManifest */')) {
  content = content.replace(
    'function evalManifest(path2, shouldCache = true, cache = sharedCache) {',
    'function evalManifest(path2, shouldCache = true, cache = sharedCache) {\n            /* patch:evalManifest */ path2 = typeof path2 === "string" ? path2.replace(/\\\\/g, "/") : path2;'
  );
  patched++;
  console.log('[patch-opennext] Patched evalManifest');
}

// 4. Patch requirePage getPagePath
if (content.includes('const pagePath = getPagePath(page, distDir, void 0, isAppPath);') && !content.includes('/* patch:pagePath */')) {
  content = content.replace(
    'const pagePath = getPagePath(page, distDir, void 0, isAppPath);',
    '/* patch:pagePath */ let pagePath = getPagePath(page, distDir, void 0, isAppPath);\n            if (typeof pagePath === "string") pagePath = pagePath.replace(/\\\\/g, "/");'
  );
  patched++;
  console.log('[patch-opennext] Patched requirePage getPagePath');
}

// 5. Safely wrap setNextjsServerWorkingDirectory
if (content.includes('function setNextjsServerWorkingDirectory() {\n    process.chdir("");\n}')) {
  content = content.replace(
    'function setNextjsServerWorkingDirectory() {\n    process.chdir("");\n}',
    'function setNextjsServerWorkingDirectory() {\n    try { process.chdir(""); } catch (e) {}\n}'
  );
  patched++;
  console.log('[patch-opennext] Safely wrapped setNextjsServerWorkingDirectory');
}

fs.writeFileSync(handlerPath, content, 'utf8');
console.log(`[patch-opennext] Applied ${patched} new patches. Total normalized.`);
