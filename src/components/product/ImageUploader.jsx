import React, { useState } from 'react';
import { HiPlus, HiTrash, HiPhotograph } from 'react-icons/hi';
import { productApi } from '../../api/productApi';
import toast from 'react-hot-toast';

export default function ImageUploader({ product, onUploadSuccess, onDeleteSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const images = product?.images || [];
  const productId = product?._id;

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    // Total count validation
    if (images.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 images per product.');
      return;
    }

    // Format validation
    const validExtensions = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    for (let i = 0; i < files.length; i++) {
      if (!validExtensions.includes(files[i].type)) {
        toast.error('Only image files (JPEG, PNG, WEBP) are supported.');
        return;
      }
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setIsUploading(true);
    const loadId = toast.loading('Uploading images...');
    
    try {
      const updatedProduct = await productApi.uploadImages(productId, formData);
      toast.success('Images uploaded successfully!', { id: loadId });
      if (onUploadSuccess) onUploadSuccess(updatedProduct);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload images.', { id: loadId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    handleFileUpload(e.target.files);
  };

  const handleDeleteImage = async (imageId) => {
    // Rule: Cannot delete the last remaining image
    if (images.length <= 1) {
      toast.error('Products must have at least 1 image. Upload a new one before removing this.');
      return;
    }

    if (!confirm('Are you sure you want to delete this image?')) return;

    const loadId = toast.loading('Deleting image...');
    try {
      const updatedProduct = await productApi.deleteImage(productId, imageId);
      toast.success('Image deleted.', { id: loadId });
      if (onDeleteSuccess) onDeleteSuccess(updatedProduct);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete image.', { id: loadId });
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-semibold text-walnut-brown tracking-wide block">
        Product Images ({images.length} / 5)
      </label>

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {images.map((img) => (
          <div key={img._id || img.publicId} className="relative aspect-square rounded-xl overflow-hidden bg-walnut-brown/5 group border border-walnut-brown/10">
            <img src={img.url} alt="product" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleDeleteImage(img._id || img.publicId)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer duration-150"
              title="Delete Image"
            >
              <HiTrash size={22} className="hover:scale-110 hover:text-red-500 transition-all" />
            </button>
          </div>
        ))}

        {/* Upload box */}
        {images.length < 5 && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-walnut-brown bg-walnut-brown/5 text-walnut-brown'
                : 'border-walnut-brown/20 hover:border-walnut-brown/50 text-walnut-brown/65 bg-white'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-soft-sage border-t-walnut-brown rounded-full animate-spin" />
            ) : (
              <>
                <HiPlus size={24} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Upload Image</span>
                <span className="text-[9px] text-charcoal-text/50 mt-0.5">Drag & Drop</span>
              </>
            )}
          </div>
        )}
      </div>
      
      {images.length === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/50 text-amber-800 text-xs font-medium">
          <HiPhotograph size={16} className="flex-shrink-0" />
          <span>Upload at least 1 image. Drafts with no photos will show fallbacks.</span>
        </div>
      )}
    </div>
  );
}
