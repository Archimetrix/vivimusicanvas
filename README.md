# vivimusicanvas

Implementing a new way to get beautiful custom canvas videos for the ViviMusic app!

This repository acts as the central hub for mapping custom `.m3u8` videos to specific songs or albums within ViviMusic. It is powered by Vercel, meaning any changes you push to this repository are instantly deployed and served via a lightning-fast global CDN. 

## How to add a new Canvas

If you find a cool visualizer or music video and want to display it in the background of ViviMusic whenever a specific song plays, follow these steps:

### 1. Upload your Video
Upload your `.m3u8` file into either the `Song/` or `Album/` directories within this repository. 
*Example: `Song/dracula_visualizer.m3u8`*

### 2. Update `canvas.json`
Open the `canvas.json` file located in the root of the repository. You will add a new block to the `"items"` array mapping the exact song name and artist to your new video URL.

Make sure your URL points to your deployed Vercel domain!

**Example:**
```json
{
  "items": [
    {
      "song": "Song Title",
      "artist": "Artist Name",
      "url": "https://vivimusicanvas.vercel.app/Song/your_video.m3u8"
    }
  ]
}
```

### 3. Commit and Push
Once you have uploaded your video and updated `canvas.json`, simply commit your changes and push them to GitHub.

> [!IMPORTANT]
> When opening a **Pull Request**, please include the **original song/album link** (YouTube Music, Spotify, or similar) in the description. This helps us verify the metadata and ensure the canvas matches the correct track.

**Pull Request Example:**
> **Title:** `feat: added canvas for Blinding Lights by The Weeknd`
> **Description:**
> - Added `Song/20.m3u8`
> - Updated `canvas.json` mapping for "Blinding Lights"
> - **Original Link:** https://music.youtube.com/watch?v=4NRXx6U8ABQ

```bash
git add .
git commit -m "feat: added canvas for Song Title"
git push
```

That's it! Vercel will automatically redeploy your changes. The next time you play that song in ViviMusic, your custom video will automatically be fetched and looped in the background!

## Continuous Integration

To ensure the integrity of the `canvas.json` and prevent broken links, we have an automated **Validation Bot** that checks every Pull Request:

1.  **JSON Syntax**: Ensures the file is correctly formatted.
2.  **Schema Check**: Verifies that `song`, `artist`, and `url` fields are present for every entry.
3.  **Local File Check**: Verifies that the video file referenced in the URL actually exists in the `Song/` or `Album/` directory.
4.  **No Duplicates**: Ensures that no two entries have same (song, artist) combination.
5.  **Format Check**: Ensures URLs end in `.mp4` or `.m3u8`.

You can also run this check locally if you have Node.js installed:
```bash
node scripts/validate_canvas.js
```

## License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for details.
