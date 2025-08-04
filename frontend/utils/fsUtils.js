const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Convert callback-based fs functions to Promise-based
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

/**
 * Ensure a directory exists, create it if it doesn't
 * @param {string} dirPath - Directory path
 * @returns {Promise<void>}
 */
async function ensureDir(dirPath) {
  try {
    await stat(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
}

/**
 * Save a file to disk
 * @param {Object} file - Express file upload object
 * @param {string} targetPath - Path to save the file
 * @returns {Promise<string>} - Path where the file was saved
 */
async function saveFile(file, targetPath) {
  // Ensure directory exists
  const dir = path.dirname(targetPath);
  await ensureDir(dir);
  
  // Move file
  await file.mv(targetPath);
  return targetPath;
}

/**
 * Delete a file if it exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if file was deleted, false if it didn't exist
 */
async function deleteFileIfExists(filePath) {
  try {
    await stat(filePath);
    await unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

/**
 * Get file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human-readable file size
 */
function getHumanReadableSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} - File extension
 */
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

module.exports = {
  ensureDir,
  saveFile,
  deleteFileIfExists,
  getHumanReadableSize,
  getFileExtension,
  readdir,
  stat,
  writeFile,
  readFile
};