const fs = require('fs');
const path = require('path');
const { FileModel } = require('../Models/file-model');

/**
 * Process a file upload and save file information to MongoDB
 * @param {Object} file - The uploaded file object from multer
 * @param {string} entityId - The ID of the related entity (plan, order, etc.)
 * @param {string} fileType - The type of file (cad, pdf, render, etc.)
 * @param {Object} additionalData - Any additional data to save with the file
 * @returns {Promise<Object>} The saved file information
 */
async function processFileUpload(file, entityId, fileType, additionalData = {}) {
  if (!file) return null;
  
  try {
    // Create a unique filename
    const fileExt = path.extname(file.originalname);
    const uniqueFilename = `${file.fieldname}-${Date.now()}${fileExt}`;
    
    // Create a path relative to your uploads directory
    const relativePath = `uploads/${entityId}/${fileType}/${uniqueFilename}`;
    const absolutePath = path.join(__dirname, '..', relativePath);
    
    // Ensure directory exists
    const directory = path.dirname(absolutePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // Copy the file from temp location to permanent location
    fs.copyFileSync(file.path, absolutePath);
    
    // Delete temp file
    fs.unlinkSync(file.path);
    
    // Prepare file data
    const fileData = {
      fileName: file.originalname,
      filePath: relativePath,
      // In a real app, this would be a CDN or S3 URL
      downloadURL: `/api/${relativePath}`,
      size: file.size,
      type: file.mimetype,
      fileType,
      uploadedAt: new Date(),
      ...additionalData
    };
    
    // If entityId is a plan ID, add it to the file data
    if (additionalData.isPlan) {
      fileData.planId = entityId;
    } 
    // If entityId is an order ID, add it to the file data
    else if (additionalData.isOrder) {
      fileData.orderId = entityId;
    }
    
    // Save file information to MongoDB
    const savedFile = await FileModel.create(fileData);
    
    return savedFile;
  } catch (error) {
    console.error('Error processing file upload:', error);
    // Make sure to clean up the temp file even if upload fails
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
}

/**
 * Process multiple file uploads
 * @param {Array} files - Array of uploaded file objects
 * @param {string} entityId - The ID of the related entity
 * @param {string} fileType - The type of files
 * @param {Object} additionalData - Any additional data to save with the files
 * @returns {Promise<Array>} Array of saved file information
 */
async function processMultipleFileUploads(files, entityId, fileType, additionalData = {}) {
  if (!files || !files.length) return [];
  
  const results = await Promise.all(
    files.map(file => processFileUpload(file, entityId, fileType, additionalData))
  );
  
  return results.filter(result => result !== null);
}

module.exports = {
  processFileUpload,
  processMultipleFileUploads
};