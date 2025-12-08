# Image Optimization Guide

This document outlines the image optimization strategies implemented in the AmberHomes project to reduce website load times and improve performance.

## ✅ Implemented Optimizations

### 1. **Next.js Image Optimization (Enabled)**
- **Status**: ✅ Enabled
- **Location**: `next.config.js`
- **Features**:
  - Automatic image format conversion (AVIF, WebP)
  - Responsive image sizes
  - Lazy loading
  - Image caching (60s minimum TTL)

### 2. **Client-Side Image Compression**
- **Status**: ✅ Implemented
- **Library**: `browser-image-compression`
- **Location**: 
  - `src/components/FormHelpers/MultiImageUpload.js` (Listing images)
  - `src/components/FormHelpers/ImageUpload.js` (Profile images)
- **Settings**:
  - **Listing images**: Max 1MB, Max 1920px width/height, 85% quality
  - **Profile images**: Max 0.5MB, Max 1200px width/height, 85% quality

### 3. **Server-Side Image Compression**
- **Status**: ✅ Implemented
- **Library**: `sharp`
- **Location**: `src/app/api/upload/route.js`
- **Features**:
  - Automatic resizing and compression
  - Converts all images to JPEG format
  - Progressive JPEG encoding
  - Server-side optimization as backup to client-side compression

## 📊 Expected Performance Improvements

- **File Size Reduction**: 60-80% smaller images
- **Page Load Time**: 30-50% faster initial page load
- **Bandwidth Savings**: Significant reduction in data transfer
- **Better User Experience**: Faster image loading, especially on mobile devices

## 🔧 How It Works

### Upload Flow:
1. **User selects image** → Client-side compression begins
2. **Compression** → Image is resized and compressed in the browser
3. **Upload** → Compressed image is sent to server
4. **Server-side optimization** → Additional optimization using Sharp (backup)
5. **Storage** → Optimized image is stored in Vercel Blob Storage
6. **Delivery** → Next.js Image component serves optimized images automatically

### Serving Images:
- Next.js automatically serves WebP/AVIF to supported browsers
- Responsive image sizes based on device
- Lazy loading for images below the fold
- CDN caching for fast delivery

## 📝 Best Practices

### For Developers:
1. **Always use Next.js Image component**:
   ```jsx
   import Image from "next/image";
   
   <Image 
     src="/path/to/image.jpg" 
     alt="Description"
     width={800}
     height={600}
     loading="lazy"
   />
   ```

2. **Provide width and height** to prevent layout shift

3. **Use `priority` prop** for above-the-fold images:
   ```jsx
   <Image 
     src="/hero.jpg" 
     alt="Hero"
     priority
   />
   ```

4. **Use `fill` prop** for responsive images in containers:
   ```jsx
   <div style={{ position: "relative", width: "100%", height: "400px" }}>
     <Image 
       src="/image.jpg" 
       alt="Description"
       fill
       style={{ objectFit: "cover" }}
     />
   </div>
   ```

### For Users:
- Images are automatically optimized when uploaded
- Large images (>10MB) are rejected
- Images are compressed to maintain quality while reducing file size
- No action needed - optimization happens automatically

## 🔍 Monitoring

To monitor image optimization effectiveness:

1. **Check browser DevTools**:
   - Network tab: View actual file sizes
   - Lighthouse: Check performance scores
   - Coverage tab: See unused bytes

2. **Console logs**:
   - Client-side compression logs: `Image compressed: X MB → Y MB`
   - Server-side optimization logs: `Image optimized: X MB → Y MB`

## 🚀 Future Improvements

Potential future optimizations:
- [ ] WebP/AVIF conversion on upload (currently JPEG only)
- [ ] Image CDN integration for global distribution
- [ ] Progressive image loading with blur placeholder
- [ ] Automatic image format detection and selection
- [ ] Batch image optimization for existing images

## 📚 Resources

- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)

