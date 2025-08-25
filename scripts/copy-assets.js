const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content', 'blog');
const publicDir = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Asset extensions to copy
const assetExtensions = ['.mp4', '.webm', '.ogg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

function copyAssets() {
  console.log('Copying blog assets to public directory...');
  
  // Create assets directory in public
  const assetsDir = path.join(publicDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Get all blog post directories
  const postDirs = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  postDirs.forEach(postSlug => {
    const postDir = path.join(contentDir, postSlug);
    const targetDir = path.join(assetsDir, postSlug);

    // Create target directory for this post
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Get all files in the post directory
    const files = fs.readdirSync(postDir);
    
    files.forEach(file => {
      const filePath = path.join(postDir, file);
      const fileExt = path.extname(file).toLowerCase();
      
      // Skip index.md and copy only asset files
      if (file !== 'index.md' && assetExtensions.includes(fileExt)) {
        const targetPath = path.join(targetDir, file);
        
        try {
          fs.copyFileSync(filePath, targetPath);
          console.log(`Copied: ${postSlug}/${file}`);
        } catch (error) {
          console.error(`Error copying ${filePath}:`, error.message);
        }
      }
    });
  });

  console.log('Asset copying completed!');
}

// Run the script
copyAssets();
