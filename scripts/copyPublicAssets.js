const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcPublic = path.join(repoRoot, 'public');
const destPublic = path.join(repoRoot, 'client', 'public');

function ensureDir(dir){
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest){
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
}

function copyDir(srcDir, destDir){
  ensureDir(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for(const entry of entries){
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if(entry.isDirectory()){
      copyDir(srcPath, destPath);
    } else if(entry.isFile()){
      copyFile(srcPath, destPath);
    }
  }
}

try{
  if(!fs.existsSync(srcPublic)){
    console.error('Source public folder not found:', srcPublic);
    process.exit(1);
  }
  ensureDir(destPublic);

  // copy styles.css if exists
  const styleSrc = path.join(srcPublic, 'styles.css');
  if(fs.existsSync(styleSrc)){
    copyFile(styleSrc, path.join(destPublic, 'styles.css'));
  } else {
    console.warn('styles.css not found in public/');
  }

  // copy other public assets (images folder)
  const imagesSrc = path.join(srcPublic, 'images');
  if(fs.existsSync(imagesSrc)){
    copyDir(imagesSrc, path.join(destPublic, 'images'));
  } else {
    console.warn('images folder not found in public/');
  }

  console.log('Asset copy complete.');
} catch(err){
  console.error('Error copying assets:', err);
  process.exit(1);
}
