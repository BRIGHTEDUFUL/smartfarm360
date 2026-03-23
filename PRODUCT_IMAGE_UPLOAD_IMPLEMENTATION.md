# Product Image Upload Feature - Implementation Guide

## Overview
This document provides a complete implementation guide for adding product image upload functionality to the Smart Farming 360 platform.

## ✅ Completed Steps

### 1. Database Migration
- Created `backend/migrations/004_add_product_image_url.sql`
- Adds `image_url` column to products table
- The `product_images` table already exists in the schema for multiple images

### 2. Upload Middleware
- Created `backend/src/middleware/upload.middleware.ts`
- Configured multer for file uploads
- File validation (JPEG, PNG, GIF, WebP only)
- 5MB file size limit
- Automatic unique filename generation

## 🔄 Remaining Implementation Steps

### Backend Changes

#### 3. Update Product Service
Add image handling to `backend/src/services/product.service.ts`:

```typescript
// Add to createProduct method
static async createProduct(data: any) {
  const { image_url, ...productData } = data;
  
  // Create product with image_url
  const product = await query(
    `INSERT INTO products (farmer_id, name, description, category, price, unit, stock_quantity, image_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
    [data.farmer_id, data.name, data.description, data.category, data.price, data.unit, data.stock_quantity, image_url || null]
  );
  
  return product;
}
```

#### 4. Update Product Controller
Modify `backend/src/controllers/product.controller.ts`:

```typescript
import { uploadSingle } from '../middleware/upload.middleware';

// Update create method to handle file upload
static async create(req: Request, res: Response): Promise<void> {
  try {
    // File is available at req.file if uploaded
    const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;
    
    const product = await ProductService.createProduct({
      farmer_id: req.user!.id,
      ...req.body,
      image_url
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create product' },
    });
  }
}
```

#### 5. Update Product Routes
Modify `backend/src/routes/product.routes.ts`:

```typescript
import { uploadSingle } from '../middleware/upload.middleware';

// Update create route to use upload middleware
router.post(
  '/',
  authMiddleware,
  uploadSingle, // Add this middleware before validation
  ProductController.createValidation,
  ProductController.create
);

// Update update route similarly
router.put(
  '/:id',
  authMiddleware,
  uploadSingle,
  ProductController.update
);
```

#### 6. Serve Static Files
Update `backend/src/server.ts`:

```typescript
// Add static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

### Frontend Changes

#### 7. Update FarmerDashboard Component
Modify `frontend/src/pages/FarmerDashboard.tsx`:

```typescript
// Add image state
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);

// Add image handler
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, GIF and WebP images are allowed');
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

// Update handleSubmit to send FormData
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('unit', formData.unit);
    formDataToSend.append('stock_quantity', formData.stock_quantity);
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    if (editingProduct) {
      await productsAPI.update(editingProduct.id, formDataToSend);
      toast.success('Product updated successfully');
    } else {
      await productsAPI.create(formDataToSend);
      toast.success('Product created successfully! Awaiting admin approval.');
    }

    setShowAddModal(false);
    setEditingProduct(null);
    resetForm();
    setImageFile(null);
    setImagePreview(null);
    loadMyProducts();
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Failed to save product');
  }
};
```

#### 8. Add Image Upload UI to Modal
Add to the product form in `FarmerDashboard.tsx`:

```tsx
{/* Add after description field */}
<div className="form-group">
  <label>Product Image</label>
  <div className="image-upload-container">
    <input
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
      onChange={handleImageChange}
      className="image-input"
      id="product-image"
    />
    <label htmlFor="product-image" className="image-upload-label">
      {imagePreview ? (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setImageFile(null);
              setImagePreview(null);
            }}
            className="remove-image-btn"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ) : (
        <div className="upload-placeholder">
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Click to upload image</p>
          <span>JPEG, PNG, GIF or WebP (Max 5MB)</span>
        </div>
      )}
    </label>
  </div>
</div>
```

#### 9. Add Image Upload Styles
Add to `frontend/src/pages/FarmerDashboard.css`:

```css
/* Image Upload Styles */
.image-upload-container {
  margin-top: 8px;
}

.image-input {
  display: none;
}

.image-upload-label {
  display: block;
  cursor: pointer;
  border: 2px dashed #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  background: #F9FAFB;
}

.image-upload-label:hover {
  border-color: #FBBF24;
  background: #FFFBEB;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-placeholder i {
  font-size: 48px;
  color: #F59E0B;
}

.upload-placeholder p {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a !important;
  margin: 0;
}

.upload-placeholder span {
  font-size: 12px;
  color: #6B7280 !important;
}

.image-preview {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.image-preview img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
}

.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: #DC2626;
  transform: scale(1.1);
}
```

#### 10. Update Product Display
Update product cards to show images:

```tsx
<div className="product-item">
  {product.image_url && (
    <div className="product-image">
      <img 
        src={`${API_BASE_URL}${product.image_url}`} 
        alt={product.name}
        onError={(e) => {
          e.currentTarget.src = '/images/placeholder-product.jpg';
        }}
      />
    </div>
  )}
  <div className="product-header">
    <h3>{product.name}</h3>
    {/* rest of the card */}
  </div>
</div>
```

Add styles:

```css
.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  margin-bottom: 16px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-item:hover .product-image img {
  transform: scale(1.05);
}
```

#### 11. Update API Service
Modify `frontend/src/services/api.ts`:

```typescript
export const productsAPI = {
  create: (data: FormData) => api.post('/products', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id: number, data: FormData) => api.put(`/products/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  // ... rest of methods
};
```

## Testing Steps

1. **Run Migration**:
   ```bash
   cd backend
   npm run migrate
   ```

2. **Start Backend**:
   ```bash
   npm run dev
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test Upload**:
   - Login as farmer
   - Click "Add New Product"
   - Fill form and upload image
   - Verify image preview shows
   - Submit and check product is created with image

## Security Considerations

- ✅ File type validation (images only)
- ✅ File size limit (5MB)
- ✅ Unique filename generation
- ✅ Authentication required
- ⚠️ Consider adding virus scanning for production
- ⚠️ Consider using cloud storage (Cloudinary, AWS S3) for production

## Future Enhancements

1. Multiple image upload per product
2. Image cropping/resizing
3. Cloud storage integration
4. Image optimization
5. Drag-and-drop upload
6. Bulk product upload with CSV

## Notes

- Images are stored in `backend/uploads/products/`
- Served via `/uploads` static route
- Database stores relative path: `/uploads/products/filename.jpg`
- Frontend constructs full URL: `${API_BASE_URL}/uploads/products/filename.jpg`
