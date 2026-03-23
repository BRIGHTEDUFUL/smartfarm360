# Product Image Upload - Testing Guide

## ✅ Feature Status: READY FOR TESTING

All code has been implemented and both backend and frontend build successfully.

## Supported Image Formats

✅ **JPEG** (.jpg, .jpeg)
✅ **PNG** (.png)
✅ **GIF** (.gif)
✅ **WebP** (.webp)

## Size Limits

- **Maximum file size**: 5MB (5,242,880 bytes)
- **Minimum dimensions**: 100x100 pixels
- **Recommended dimensions**: 500x500 pixels or larger

## Validation Features

### Frontend Validation (Immediate Feedback)
1. File type validation - Only image formats allowed
2. File size validation - Max 5MB with detailed error message
3. Minimum dimension check - At least 100x100 pixels
4. Image preview generation
5. File info display (name and size)

### Backend Validation (Server-side Security)
1. MIME type validation via multer
2. File size limit enforcement
3. Unique filename generation
4. Secure file storage

## Testing Steps

### 1. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 2. Test as Farmer

#### Login
- URL: http://localhost:3001/login
- Email: farmer@smartfarming.com
- Password: farmer123

#### Add Product with Image

1. Click "Add New Product" button
2. Fill in product details:
   - Name: Test Product with Image
   - Description: Testing image upload feature
   - Category: Vegetables
   - Unit: kg
   - Price: 25.00
   - Stock: 100

3. Click "Click to upload image" area
4. Select an image file

**Expected Results:**
- ✅ Image preview appears immediately
- ✅ File name and size displayed below preview
- ✅ Remove button (X) appears on preview

5. Click "Add Product" button

**Expected Results:**
- ✅ Success toast: "Product created successfully! Awaiting admin approval."
- ✅ Modal closes
- ✅ Product appears in "My Products" with image
- ✅ Product status shows "Pending"

### 3. Test Image Validation

#### Test 1: Invalid File Type
1. Try to upload a PDF, TXT, or other non-image file

**Expected Result:**
- ❌ Error toast: "Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed."
- ❌ File input resets
- ❌ No preview shown

#### Test 2: File Too Large
1. Try to upload an image larger than 5MB

**Expected Result:**
- ❌ Error toast: "Image size (X.XX MB) exceeds the 5MB limit. Please choose a smaller image."
- ❌ File input resets
- ❌ No preview shown

#### Test 3: Image Too Small
1. Try to upload an image smaller than 100x100 pixels

**Expected Result:**
- ❌ Error toast: "Image dimensions must be at least 100x100 pixels."
- ❌ File input resets
- ❌ No preview shown

#### Test 4: Valid Image Formats
Test each supported format:
- ✅ JPEG (.jpg)
- ✅ JPEG (.jpeg)
- ✅ PNG (.png)
- ✅ GIF (.gif)
- ✅ WebP (.webp)

**Expected Result for Each:**
- ✅ Preview appears
- ✅ File info displayed
- ✅ Can submit successfully

### 4. Test as Admin

#### Login
- URL: http://localhost:3001/login
- Email: admin@smartfarming.com
- Password: admin123

#### Approve Product

1. Navigate to Admin Dashboard
2. Click "Products" tab
3. Find the test product (status: Pending)
4. Click approve button (✓)

**Expected Results:**
- ✅ Success toast: "Product approved successfully"
- ✅ Product status changes to "Active"

### 5. Verify in Shop

1. Navigate to Shop page
2. Find the approved product

**Expected Results:**
- ✅ Product appears in shop
- ✅ Product image displays correctly
- ✅ Image has hover effect (zoom on hover)
- ✅ Clicking product shows details

### 6. Test Product Update

1. Login as farmer
2. Go to Farmer Dashboard
3. Click "Edit" on an existing product
4. Change the image
5. Click "Update Product"

**Expected Results:**
- ✅ New image preview appears
- ✅ Product updates successfully
- ✅ New image displays in product card
- ✅ Old image is replaced

### 7. Test Without Image

1. Create a new product WITHOUT uploading an image
2. Submit the form

**Expected Results:**
- ✅ Product creates successfully
- ✅ No image shown in product card
- ✅ Product displays with default styling
- ✅ In shop, fallback image appears

## Error Scenarios to Test

### Backend Errors

#### Test 1: Server File Size Limit
If frontend validation is bypassed, backend should catch it:
- Upload file > 5MB via API directly
- **Expected**: 400 error with code "FILE_TOO_LARGE"

#### Test 2: Invalid MIME Type
If frontend validation is bypassed:
- Upload non-image file via API directly
- **Expected**: 400 error with code "INVALID_FILE_TYPE"

### Network Errors

#### Test 1: Upload During Network Failure
1. Start upload
2. Disconnect network
3. **Expected**: Error toast with retry option

#### Test 2: Slow Network
1. Throttle network to slow 3G
2. Upload large image (close to 5MB)
3. **Expected**: Upload completes successfully (may take time)

## Visual Verification Checklist

### Farmer Dashboard
- [ ] Upload button styled correctly (yellow-gold gradient)
- [ ] Upload area has dashed border
- [ ] Hover effect on upload area (border changes to gold)
- [ ] Preview image displays at 250px height
- [ ] Remove button (X) is red and circular
- [ ] File info shows name and size
- [ ] Product cards show images at 200px height
- [ ] Image hover effect (scale 1.05)

### Shop Page
- [ ] Product images display correctly
- [ ] Images maintain aspect ratio (object-fit: cover)
- [ ] Hover effect works (scale 1.05)
- [ ] Fallback image works for products without uploads
- [ ] Images load without errors

### Responsive Design
- [ ] Upload UI works on mobile (< 768px)
- [ ] Product cards stack properly on mobile
- [ ] Images scale correctly on all screen sizes

## Performance Testing

### Image Loading
1. Create 10 products with images
2. Navigate to shop page
3. **Expected**: All images load smoothly without lag

### Upload Speed
1. Upload 4.5MB image
2. **Expected**: Upload completes in < 5 seconds on normal connection

## Security Testing

### File Upload Security
- [ ] Only authenticated farmers can upload
- [ ] File type validation prevents script uploads
- [ ] File size limit prevents DoS attacks
- [ ] Unique filenames prevent overwrites
- [ ] Files stored outside web root (in uploads/)

## Known Limitations

1. **Single image per product** - Only one image can be uploaded per product
2. **No image compression** - Images are stored as-is (consider optimization for production)
3. **Local storage** - Images stored on server disk (consider cloud storage for production)
4. **No image editing** - No crop, resize, or filter options

## Troubleshooting

### Issue: Image not displaying
**Solution**: 
- Check browser console for 404 errors
- Verify uploads/products directory exists
- Check file permissions on uploads directory
- Verify API_URL environment variable

### Issue: Upload fails silently
**Solution**:
- Check browser console for errors
- Check backend logs for multer errors
- Verify file size and type
- Check network tab for failed requests

### Issue: Preview not showing
**Solution**:
- Check browser console for FileReader errors
- Verify file is valid image
- Try different image format
- Clear browser cache

## Success Criteria

✅ All supported formats upload successfully
✅ File size validation works on frontend and backend
✅ Images display correctly in all views
✅ Error messages are clear and helpful
✅ No console errors during upload
✅ Images persist after page refresh
✅ Responsive design works on all devices

## Next Steps After Testing

If all tests pass:
1. ✅ Feature is production-ready
2. Consider adding image optimization
3. Consider cloud storage integration
4. Consider multiple image support
5. Document any issues found

If issues found:
1. Document the issue with steps to reproduce
2. Check browser console and backend logs
3. Report to development team
