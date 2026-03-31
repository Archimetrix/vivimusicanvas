const fs = require('fs');
const path = require('path');

const CANVAS_FILE = 'canvas.json';
const SONG_DIR = 'Song';
const ALBUM_DIR = 'Album';

function validate() {
  console.log('--- Starting canvas.json validation ---');

  if (!fs.existsSync(CANVAS_FILE)) {
    console.error(`Error: ${CANVAS_FILE} not found!`);
    process.exit(1);
  }

  let data;
  try {
    const content = fs.readFileSync(CANVAS_FILE, 'utf8');
    data = JSON.parse(content);
  } catch (err) {
    console.error(`Error Parsing JSON: ${err.message}`);
    process.exit(1);
  }

  if (!data.items || !Array.isArray(data.items)) {
    console.error(`Error: 'items' array missing or invalid in ${CANVAS_FILE}`);
    process.exit(1);
  }

  const items = data.items;
  const errors = [];
  const seen = new Set();

  items.forEach((item, index) => {
    const { song, artist, url } = item;

    // 1. Missing fields
    if (!song || !artist || !url) {
      errors.push(`[Item ${index}] Missing required fields: ${JSON.stringify(item)}`);
      return;
    }

    // 2. Duplicates
    const key = `${song.toLowerCase()}|${artist.toLowerCase()}`;
    if (seen.has(key)) {
      errors.push(`[Item ${index}] Duplicate entry found for '${song}' by '${artist}'`);
    } else {
      seen.add(key);
    }

    // 3. Extension check
    const urlLower = url.toLowerCase();
    if (!urlLower.endsWith('.m3u8') && !urlLower.endsWith('.mp4')) {
        errors.push(`[Item ${index}] URL must end with .m3u8 or .mp4: '${url}'`);
    }

    // 4. Local file existence check
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname; // e.g. /Song/1.mp4 or /Song/23.m3u8
      
      // We expect the path to contain /Song/ or /Album/ followed by the filename
      const match = pathname.match(/\/(Song|Album)\/(.+)$/i);
      if (match) {
        const directory = match[1]; // Song or Album
        const filename = match[2];  // 1.mp4
        
        const localPath = path.join(directory, filename);
        if (!fs.existsSync(localPath)) {
          errors.push(`[Item ${index}] Referenced file does not exist locally: '${localPath}'`);
        }
      } else {
        // If it doesn't match our repo structure, we should warn
        errors.push(`[Item ${index}] URL path does not follow repo structure (/Song/ or /Album/): '${url}'`);
      }
    } catch (err) {
      errors.push(`[Item ${index}] Invalid URL format: '${url}'`);
    }
  });

  if (errors.length > 0) {
    console.error('\n--- Validation FAILED! ---');
    errors.forEach(err => console.error(`- ${err}`));
    process.exit(1);
  } else {
    console.log('\n--- Validation PASSED! ---');
    console.log(`${items.length} items verified successfully.`);
  }
}

validate();
