import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FaCloud, FaUpload, FaFile, FaDownload, FaTrash, FaEye, FaTicketAlt, FaIdCard, FaReceipt, FaImage, FaEdit, FaTag } from 'react-icons/fa';
import './PersonalDrive.css';



const PersonalDrive = () => {
  // Convex queries and mutations
  const documents = useQuery(api.documents.getDocuments) || [];
  const addDocumentMutation = useMutation(api.documents.addDocument);
  const updateDocumentMutation = useMutation(api.documents.updateDocument);
  const deleteDocumentMutation = useMutation(api.documents.deleteDocument);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [showFileViewer, setShowFileViewer] = useState(false);

  const categories = ['All', 'Transport', 'Accommodation', 'Food', 'Activities', 'Personal', 'Other'];

  const getFileIcon = (type) => {
    switch (type) {
      case 'ticket': return <FaTicketAlt />;
      case 'id': return <FaIdCard />;
      case 'receipt': return <FaReceipt />;
      case 'image': return <FaImage />;
      case 'pdf': return <FaFile />;
      default: return <FaFile />;
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case 'ticket': return '#0f4761';
      case 'id': return '#d35400';
      case 'receipt': return '#27ae60';
      case 'image': return '#8e44ad';
      case 'pdf': return '#e74c3c';
      default: return '#467886';
    }
  };

  const onDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      // Convert file to base64 for persistent storage
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        const fileUrl = base64Data;
        const previewUrl = file.type.startsWith('image/') ? base64Data : null;
        
        await addDocumentMutation({
          name: file.name,
          type: file.type === 'application/pdf' ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'document',
          size: `${(file.size / 1024).toFixed(1)} KB`,
          category: 'Other',
          tags: [],
          fileUrl: fileUrl,
          previewUrl: previewUrl,
          uploadDate: new Date().toISOString().split('T')[0]
        });
      };
      
      reader.readAsDataURL(file);
    }
    setShowUpload(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const deleteDocument = async (id) => {
    await deleteDocumentMutation({ id });
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  };

  const editDocument = (document) => {
    setEditingDocument({
      _id: document._id,
      name: document.name,
      category: document.category,
      tags: document.tags || []
    });
  };

  const saveDocumentEdit = async () => {
    if (editingDocument) {
      await updateDocumentMutation({
        id: editingDocument._id,
        name: editingDocument.name,
        category: editingDocument.category,
        tags: editingDocument.tags
      });
      setEditingDocument(null);
    }
  };

  const addTag = (tag) => {
    if (editingDocument && tag.trim() && !editingDocument.tags.includes(tag.trim())) {
      setEditingDocument(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    if (editingDocument) {
      setEditingDocument(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    }
  };

  const downloadDocument = (doc) => {
    try {
      if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
        // Handle base64 data URLs - use window.open to avoid DOM manipulation
        window.open(doc.fileUrl, '_blank');
      } else if (doc.fileUrl) {
        // Handle external URLs
        window.open(doc.fileUrl, '_blank');
      } else {
        // For demo purposes, create a dummy download
        const blob = new Blob(['This is a demo file for ' + doc.name], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Use window.open to avoid DOM manipulation
        window.open(url, '_blank');
        
        // Cleanup URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const viewDocument = (document) => {
    try {
      setSelectedDocument(document);
      setShowFileViewer(true);
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Failed to open document. Please try again.');
    }
  };

  const filteredDocuments = selectedCategory === 'All' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <div className="page-container">
      <div className="container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaCloud /> Personal Drive
        </motion.h1>

        <div className="drive-overview">
          <motion.div
            className="storage-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-card">
              <h3>Total Documents</h3>
              <p className="stat-number">{documents.length}</p>
            </div>
            <div className="stat-card">
              <h3>Storage Used</h3>
              <p className="stat-number">2.5 MB</p>
            </div>
            <div className="stat-card">
              <h3>Categories</h3>
              <p className="stat-number">{categories.length - 1}</p>
            </div>
          </motion.div>

          <motion.button
            className="btn upload-btn"
            onClick={() => setShowUpload(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUpload /> Upload Documents
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
              <h2>Upload Documents</h2>
              <div {...getRootProps()} className={`upload-area ${isDragActive ? 'drag-active' : ''}`}>
                <input {...getInputProps()} />
                                  <div className="upload-placeholder">
                    <FaUpload />
                    <p>{isDragActive ? 'Drop files here' : 'Click or drag to upload documents'}</p>
                    <small>Supports: PDFs, Images, Text files</small>
                  </div>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
            </div>
          </motion.div>
        )}

        <motion.div
          className="drive-controls"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="category-filter">
            <label>Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </motion.div>

        <motion.div
          className={`documents-container ${viewMode}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
                      {filteredDocuments.map((doc) => (
                          <motion.div
                key={doc._id}
                className="document-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedDocument(doc)}
              >
                              <div className="document-preview">
                  {doc.previewUrl ? (
                    <img src={doc.previewUrl} alt={doc.name} />
                  ) : (
                    <div 
                      className="document-icon"
                      style={{ backgroundColor: getFileColor(doc.type) }}
                    >
                      {getFileIcon(doc.type)}
                    </div>
                  )}
                                  <div className="document-overlay">
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDocument(doc);
                      }}
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadDocument(doc);
                      }}
                    >
                      <FaDownload />
                    </button>
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        editDocument(doc);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc._id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
              </div>
              
              <div className="document-info">
                <h3>{doc.name}</h3>
                <p className="document-category">{doc.category}</p>
                <p className="document-size">{doc.size}</p>
                <p className="document-date">{doc.uploadDate}</p>
                {doc.tags && doc.tags.length > 0 && (
                  <div className="document-tags">
                    {doc.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tag-small">{tag}</span>
                    ))}
                    {doc.tags.length > 2 && (
                      <span className="tag-small">+{doc.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {selectedDocument && (
          <motion.div
            className="document-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedDocument.name}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedDocument(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="document-details">
                <div className="document-preview-large">
                  {selectedDocument.preview ? (
                    <img src={selectedDocument.preview} alt={selectedDocument.name} />
                  ) : (
                    <div 
                      className="document-icon-large"
                      style={{ backgroundColor: getFileColor(selectedDocument.type) }}
                    >
                      {getFileIcon(selectedDocument.type)}
                    </div>
                  )}
                </div>
                
                <div className="document-meta">
                  <div className="meta-item">
                    <strong>Type:</strong> {selectedDocument.type}
                  </div>
                  <div className="meta-item">
                    <strong>Category:</strong> {selectedDocument.category}
                  </div>
                  <div className="meta-item">
                    <strong>Size:</strong> {selectedDocument.size}
                  </div>
                  <div className="meta-item">
                    <strong>Upload Date:</strong> {selectedDocument.uploadDate}
                  </div>
                </div>
                
                <div className="document-actions">
                  <button className="btn" onClick={() => downloadDocument(selectedDocument)}>
                    <FaDownload /> Download
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedDocument(null);
                      viewDocument(selectedDocument);
                    }}
                  >
                    <FaEye /> View Full
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedDocument(null);
                      editDocument(selectedDocument);
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      deleteDocument(selectedDocument.id);
                      setSelectedDocument(null);
                    }}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Document Modal */}
        {editingDocument && (
          <motion.div
            className="edit-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Document</h2>
                <button 
                  className="close-btn"
                  onClick={() => setEditingDocument(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="edit-form">
                <div className="form-group">
                  <label>Document Name</label>
                  <input
                    type="text"
                    value={editingDocument.name}
                    onChange={(e) => setEditingDocument(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editingDocument.category}
                    onChange={(e) => setEditingDocument(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-container">
                    {editingDocument.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                        <button 
                          className="remove-tag"
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="add-tag">
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      className="btn-small"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        addTag(input.value);
                        input.value = '';
                      }}
                    >
                      <FaTag />
                    </button>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="btn" onClick={saveDocumentEdit}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => setEditingDocument(null)}>Cancel</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

                {/* File Viewer Modal */}
        {showFileViewer && selectedDocument && (
          <motion.div
            className="file-viewer-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedDocument.name}</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowFileViewer(false);
                    setSelectedDocument(null);
                  }}
                >
                  ×
                </button>
              </div>
              
              <div className="file-viewer">
                {selectedDocument.previewUrl ? (
                  <img src={selectedDocument.previewUrl} alt={selectedDocument.name} />
                ) : selectedDocument.type === 'pdf' ? (
                  <div className="pdf-preview">
                    {selectedDocument.fileUrl ? (
                      <iframe
                        src={`${selectedDocument.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                        title={selectedDocument.name}
                        width="100%"
                        height="500px"
                        style={{ border: 'none', borderRadius: '10px' }}
                        onLoad={() => console.log('PDF loaded successfully')}
                        onError={() => {
                          console.error('Failed to load PDF');
                          alert('Failed to load PDF. Please try downloading the file instead.');
                        }}
                      />
                    ) : (
                      <div className="pdf-error">
                        <p>PDF file not available for preview.</p>
                        <p>Please download the file to view it.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="file-preview">
                    <div 
                      className="document-icon-large"
                      style={{ backgroundColor: getFileColor(selectedDocument.type) }}
                    >
                      {getFileIcon(selectedDocument.type)}
                    </div>
                    <p>Preview not available for this file type</p>
                    <p>Please download the file to view it.</p>
                  </div>
                )}
                
                <div className="file-info">
                  <p><strong>Type:</strong> {selectedDocument.type}</p>
                  <p><strong>Category:</strong> {selectedDocument.category}</p>
                  <p><strong>Size:</strong> {selectedDocument.size}</p>
                  <p><strong>Upload Date:</strong> {selectedDocument.uploadDate}</p>
                  {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                    <div className="file-tags">
                      <strong>Tags:</strong>
                      {selectedDocument.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="file-actions">
                  <button className="btn" onClick={() => downloadDocument(selectedDocument)}>
                    <FaDownload /> Download
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowFileViewer(false);
                      setSelectedDocument(null);
                      editDocument(selectedDocument);
                    }}
                  >
                    <FaEdit /> Edit
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

export default PersonalDrive;
