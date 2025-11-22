# Videos Directory

This directory contains video files used in the application.

## Background Video

The hero/banner background video should be placed here:

- **File name**: `house-interior.mp4`
- **Source**: https://www.pexels.com/video/video-of-a-house-interior-7578552/

## How to Add the Video

1. Visit the Pexels video page: https://www.pexels.com/video/video-of-a-house-interior-7578552/
2. Click the **Download** button
3. Choose the **HD** or **4K** quality (recommended: HD for web)
4. Save the video file as `house-interior.mp4` in this directory (`public/videos/`)

## Video Requirements

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD) or higher
- **File size**: Optimize for web (recommended: under 10MB)
- **Length**: Short looping video works best for background

## Alternative: Using Direct URL

If you prefer to use a direct URL instead of hosting locally, you can update the video source in:
- `src/components/Index/Banner.js` (line 143)

Replace the source path with your video URL.

