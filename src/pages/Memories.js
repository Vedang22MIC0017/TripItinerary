import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FaCamera, FaHeart, FaShare, FaDownload, FaTrash, FaGoogleDrive } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import './Memories.css';

const Memories = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Convex queries and mutations
  const memories = useQuery(api.memories.getMemories) || [];
  const addMemory = useMutation(api.memories.addMemory);
  const deleteMemory = useMutation(api.memories.deleteMemory);
  const updateMemory = useMutation(api.memories.updateMemory);

  // Compress image function
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', 0.7); // 70% quality
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Upload to Google Drive (simulated)
  const uploadToGoogleDrive = async (file) => {
    // TODO: Replace this with your actual Google Drive folder ID
    // To get your Google Drive folder ID:
    // 1. Create a folder in Google Drive
    // 2. Open the folder and copy the ID from the URL
    // 3. Replace 'YOUR_FOLDER_ID_HERE' below with your actual folder ID
    
    const GOOGLE_DRIVE_FOLDER_ID = 'YOUR_FOLDER_ID_HERE'; // Replace with your folder ID
    
    // For now, we'll simulate it with a placeholder
    // In a real implementation, you would:
    // 1. Use Google Drive API to upload the file
    // 2. Get the actual file ID from the response
    // 3. Return the real Google Drive URL
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is a placeholder - replace with actual Google Drive API implementation
        if (GOOGLE_DRIVE_FOLDER_ID === 'YOUR_FOLDER_ID_HERE') {
          // Fallback to base64 storage if no Google Drive setup
          resolve(null);
        } else {
          // Real Google Drive URL would be: https://drive.google.com/file/d/{FILE_ID}/view
          resolve(`https://drive.google.com/file/d/${Math.random().toString(36).substr(2, 9)}/view`);
        }
      }, 1000);
    });
  };

  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        // Compress image
        const compressedBlob = await compressImage(file);
        
        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Data = e.target.result;
          
          // Upload to Google Drive (simulated)
          const driveUrl = await uploadToGoogleDrive(file);
          
          await addMemory({
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: '',
            imageUrl: base64Data,
            driveUrl: driveUrl,
            originalSize: file.size,
            compressedSize: compressedBlob.size,
            uploadDate: new Date().toISOString(),
            likes: 0,
            tags: []
          });
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
    
    setUploading(false);
    setShowUpload(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: true
  });

  const likeMemory = async (memoryId, currentLikes) => {
    await updateMemory({
      id: memoryId,
      likes: currentLikes + 1
    });
  };

  const deleteMemoryHandler = async (memoryId) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      await deleteMemory({ id: memoryId });
    }
  };

  const downloadMemory = (memory) => {
    if (memory.driveUrl && memory.driveUrl !== 'null') {
      // Check if it's a real Google Drive URL
      if (memory.driveUrl.includes('drive.google.com')) {
        window.open(memory.driveUrl, '_blank');
      } else {
        // Fallback to base64 image
        window.open(memory.imageUrl, '_blank');
      }
    } else if (memory.imageUrl) {
      // Use base64 image directly
      window.open(memory.imageUrl, '_blank');
    } else {
      alert('No file available for download');
    }
  };

  const shareMemory = (memory) => {
    if (navigator.share) {
      navigator.share({
        title: memory.title,
        text: memory.description,
        url: memory.driveUrl || memory.imageUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(memory.driveUrl || memory.imageUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaCamera /> Trip Memories
        </motion.h1>

        <div className="memories-overview">
          <motion.div
            className="memories-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-card">
              <h3>Total Photos</h3>
              <p className="stat-number">{memories.length}</p>
            </div>
            <div className="stat-card">
              <h3>Storage Used</h3>
              <p className="stat-number">
                {memories.reduce((total, memory) => total + (memory.compressedSize || 0), 0) / (1024 * 1024) < 1 
                  ? `${(memories.reduce((total, memory) => total + (memory.compressedSize || 0), 0) / 1024).toFixed(1)} KB`
                  : `${(memories.reduce((total, memory) => total + (memory.compressedSize || 0), 0) / (1024 * 1024)).toFixed(1)} MB`
                }
              </p>
            </div>
            <div className="stat-card">
              <h3>Total Likes</h3>
              <p className="stat-number">{memories.reduce((total, memory) => total + (memory.likes || 0), 0)}</p>
            </div>
          </motion.div>

          <motion.button
            className="btn upload-btn"
            onClick={() => setShowUpload(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCamera /> Add Memories
          </motion.button>
        </div>

        {showUpload && (
          <motion.div
            className="upload-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <h2>Upload Trip Memories</h2>
              <p className="upload-info">
                Images will be automatically compressed and stored in Google Drive (2TB limit)
              </p>
              <div {...getRootProps()} className={`upload-area ${isDragActive ? 'drag-active' : ''}`}>
                <input {...getInputProps()} />
                <div className="upload-placeholder">
                  <FaCamera />
                  <p>{isDragActive ? 'Drop images here' : 'Click or drag to upload photos'}</p>
                  <small>Supports: JPEG, PNG, GIF (Max 10MB each)</small>
                </div>
              </div>
              {uploading && (
                <div className="uploading">
                  <div className="loading-spinner"></div>
                  <p>Uploading and compressing images...</p>
                </div>
              )}
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowUpload(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="memories-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {memories.map((memory) => (
            <motion.div
              key={memory._id}
              className="memory-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(memory)}
            >
              <div className="memory-image">
                <img src={memory.imageUrl} alt={memory.title} />
                <div className="memory-overlay">
                  <div className="memory-actions">
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        likeMemory(memory._id, memory.likes || 0);
                      }}
                    >
                      <FaHeart /> {memory.likes || 0}
                    </button>
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareMemory(memory);
                      }}
                    >
                      <FaShare />
                    </button>
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadMemory(memory);
                      }}
                    >
                      <FaDownload />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMemoryHandler(memory._id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
              <div className="memory-info">
                <h3>{memory.title}</h3>
                <p className="memory-date">{new Date(memory.uploadDate).toLocaleDateString()}</p>
                {memory.driveUrl && (
                  <div className="drive-link">
                    <FaGoogleDrive /> Stored in Drive
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Image Viewer Modal */}
        {selectedImage && (
          <motion.div
            className="image-viewer-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedImage.title}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </button>
              </div>
              <div className="image-viewer">
                <img src={selectedImage.imageUrl} alt={selectedImage.title} />
                <div className="image-info">
                  <p><strong>Upload Date:</strong> {new Date(selectedImage.uploadDate).toLocaleDateString()}</p>
                  <p><strong>Original Size:</strong> {(selectedImage.originalSize / 1024).toFixed(1)} KB</p>
                  <p><strong>Compressed Size:</strong> {(selectedImage.compressedSize / 1024).toFixed(1)} KB</p>
                  <p><strong>Compression:</strong> {Math.round(((selectedImage.originalSize - selectedImage.compressedSize) / selectedImage.originalSize) * 100)}% smaller</p>
                  {selectedImage.driveUrl && (
                    <p><strong>Drive Link:</strong> <a href={selectedImage.driveUrl} target="_blank" rel="noopener noreferrer">View in Google Drive</a></p>
                  )}
                </div>
                <div className="image-actions">
                  <button className="btn" onClick={() => likeMemory(selectedImage._id, selectedImage.likes || 0)}>
                    <FaHeart /> Like ({selectedImage.likes || 0})
                  </button>
                  <button className="btn" onClick={() => shareMemory(selectedImage)}>
                    <FaShare /> Share
                  </button>
                  <button className="btn" onClick={() => downloadMemory(selectedImage)}>
                    <FaDownload /> Download
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Memories;
