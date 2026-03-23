# Product Image Upload - Technical Specifications

## 📸 Supported Image Formats

| Format | Extension | MIME Type | Status |
|--------|-----------|-----------|--------|
| JPEG | .jpg, .jpeg | image/jpeg, image/jpg | ✅ Supported |
| PNG | .png | image/png | ✅ Supported |
| GIF | .gif | image/gif | ✅ Supported |
| WebP | .webp | image/webp | ✅ Supported |
| BMP | .bmp | image/bmp | ❌ Not Supported |
| TIFF | .tif, .tiff | image/tiff | ❌ Not Supported |
| SVG | .svg | image/svg+xml | ❌ Not Supported |

## 📏 Size Requirements

### File Size
- **Maximum**: 5 MB (5,242,880 bytes)
- **Recommended**: 500 KB - 2 MB for optimal performance
- **Minimum**: No minimum file size

### Image Dimensions
- **Minimum**: 100 x 100 pixels
- **Recommended**: 500 x 500 pixels or larger
- **Maximum**: No maximum (limited by file size)
- **Aspect Ratio**: Any (images will be cropped to fit display areas)

## 🎨 Display Specifications

### Farmer Dashboard - Product Cards
- **Display Size**: 200px height, full width
- **Object Fit**: Cover (maintains aspect ratio, crops if needed)
- **Border Radius**: 16px (top corners only)

### Shop Page - Product Cards
- **Display Size**: 200px height, full width
- **Object Fit**: Cover
- **Hover Effect**: Scale 1.05 (5% zoom)

### Product Form - Preview
- **Display Size**: 250px height, max 400px width
- **Object Fit**: Cover
- **Border Radius**: 12px

## 🔒 Security Features

### Frontend Validation
1. **File Type Check**: Validates MIME type before upload
2. **Size Check**: Validates file size before upload
3. **Dimension Check**: Validates minimum dimensions
4. **Preview Generation**: Uses FileReader for safe preview

### Backend Validation
1. **Multer File Filter**: Server-side MIME type validation
2. **Size Limit**: 5MB enforced by multer
3. **Unique Filenames**: Timestamp + random string prevents conflicts
4. **Secure Storage**: Files stored in dedicated uploads directory

### File Naming Convention
```
Format: {original-name}-{timestamp}-{random-number}.{extension}
Example: tomato-1234567890-987654321.jpg
```

## 📁 Storage Structure

```
backend/
└── uploads/
    └── products/
        ├── tomato-1234567890-987654321.jpg
        ├── banana-1234567891-123456789.png
        └── ...
```

### Database Storage
- **Column**: `image_url` (TEXT, nullable)
- **Format**: Relative path from API root
- **Example**: `/uploads/products/tomato-1234567890-987654321.jpg`

### URL Construction
```
Frontend: ${API_URL}${image_url}
Example: http://localhost:3000/uploads/products/tomato-1234567890-987654321.jpg
```

## ⚡ Performance Considerations

### Upload Speed (Estimated)
| File Size | 4G Connection | 3G Connection | Slow 3G |
|-----------|---------------|---------------|---------|
| 500 KB | < 1 second | 2-3 seconds | 5-8 seconds |
| 1 MB | 1-2 seconds | 4-6 seconds | 10-15 seconds |
| 2 MB | 2-3 seconds | 8-12 seconds | 20-30 seconds |
| 5 MB | 4-6 seconds | 20-30 seconds | 50-75 seconds |

### Optimization Recommendations
1. **Compress images** before upload (use tools like TinyPNG)
2. **Resize large images** to recommended dimensions
3. **Use WebP format** for better compression (when supported)
4. **Consider lazy loading** for product grids

## 🔄 API Endpoints

### Create Product with Image
```http
POST /api/products
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body (FormData):
- name: string
- description: string
- category: string
- price: number
- unit: string
- stock_quantity: number
- image: File (optional)
```

### Update Product with Image
```http
PUT /api/products/:id
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body (FormData):
- name: string (optional)
- description: string (optional)
- category: string (optional)
- price: number (optional)
- unit: string (optional)
- stock_quantity: number (optional)
- image: File (optional)
```

### Get Product (includes image_url)
```http
GET /api/products/:id

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Fresh Tomatoes",
    "image_url": "/uploads/products/tomato-1234567890-987654321.jpg",
    ...
  }
}
```

## 🚨 Error Codes

| Code | Message | HTTP Status | Cause |
|------|---------|-------------|-------|
| FILE_TOO_LARGE | Image size must be less than 5MB | 400 | File exceeds 5MB limit |
| INVALID_FILE_TYPE | Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed | 400 | Unsupported file format |
| INVALID_FILE_FIELD | Unexpected file field | 400 | Wrong form field name |
| UPLOAD_ERROR | {multer error message} | 400 | Other multer errors |

## 🎯 Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+ (Full support)
- ✅ Firefox 88+ (Full support)
- ✅ Safari 14+ (Full support)
- ✅ Edge 90+ (Full support)
- ⚠️ IE 11 (Not supported - FileReader issues)

### Required Browser Features
- FileReader API (for preview)
- FormData API (for upload)
- Fetch/Axios (for HTTP requests)
- Image constructor (for dimension validation)

## 📱 Mobile Support

### iOS Safari
- ✅ Image upload from camera
- ✅ Image upload from photo library
- ✅ Preview generation
- ⚠️ Large images may cause memory issues

### Android Chrome
- ✅ Image upload from camera
- ✅ Image upload from gallery
- ✅ Preview generation
- ✅ Better memory management than iOS

## 🔧 Configuration

### Backend Configuration
```typescript
// backend/src/middleware/upload.middleware.ts
const upload = multer({
  storage: diskStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});
```

### Frontend Configuration
```typescript
// frontend/src/pages/FarmerDashboard.tsx
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB
const minDimensions = { width: 100, height: 100 };
```

## 🎓 Best Practices

### For Users
1. Use high-quality images (at least 500x500px)
2. Compress images before upload
3. Use descriptive filenames
4. Test image on different devices
5. Use landscape or square images for best results

### For Developers
1. Always validate on both frontend and backend
2. Provide clear error messages
3. Show upload progress for large files
4. Implement retry logic for failed uploads
5. Consider image optimization/compression
6. Use CDN for production
7. Implement image caching
8. Add alt text for accessibility

## 🚀 Future Enhancements

### Planned Features
- [ ] Multiple images per product (gallery)
- [ ] Image cropping tool
- [ ] Image filters and effects
- [ ] Automatic image optimization
- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] Drag-and-drop upload
- [ ] Bulk image upload
- [ ] Image zoom on hover
- [ ] Image lightbox view

### Performance Improvements
- [ ] Lazy loading for product grids
- [ ] Progressive image loading
- [ ] WebP conversion on server
- [ ] Image CDN integration
- [ ] Client-side image compression

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review backend logs
3. Verify file meets specifications
4. Test with different image formats
5. Clear browser cache and retry
