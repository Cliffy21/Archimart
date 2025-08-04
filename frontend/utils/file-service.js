const fs = require('fs');
const path = require('path');
const os = require('os');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const { bucket } = require('../config/firebase-config');
const { FileModel } = require('../Models/file-model');
const { OrderModel } = require('../Models/order-model');

// Create a zip archive of files in a directory
const createZipArchive = (sourceDir, outputZipPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => resolve(archive.pointer()));
    archive.on('error', reject);
    
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
};

// Generate files for an order and upload to Firebase Storage
const generateOrderFiles = async (orderId) => {
  let workDir = null;
  
  try {
    console.log(`Starting file generation for order: ${orderId}`);
    
    const order = await OrderModel.findById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    
    // Create temporary working directory
    workDir = path.join(os.tmpdir(), `order-${orderId}-${uuidv4()}`);
    fs.mkdirSync(workDir, { recursive: true });
    
    const renderDir = path.join(workDir, 'renders');
    const cadDir = path.join(workDir, 'cad');
    const pdfDir = path.join(workDir, 'pdf');
    
    // Create subdirectories
    fs.mkdirSync(renderDir, { recursive: true });
    fs.mkdirSync(cadDir, { recursive: true });
    fs.mkdirSync(pdfDir, { recursive: true });
    
    console.log(`Created working directories for order: ${orderId}`);
    
    // Generate files based on product and customizations
    await Promise.all([
      generateRenderImages(order, renderDir),
      generateCADFiles(order, cadDir),
      generatePDFDocumentation(order, pdfDir)
    ]);
    
    console.log(`Generated content files for order: ${orderId}`);
    
    // Create zip files
    const renderZipPath = path.join(workDir, 'renders.zip');
    const cadZipPath = path.join(workDir, 'cad.zip');
    const pdfZipPath = path.join(workDir, 'pdf.zip');
    
    const [renderSize, cadSize, pdfSize] = await Promise.all([
      createZipArchive(renderDir, renderZipPath),
      createZipArchive(cadDir, cadZipPath),
      createZipArchive(pdfDir, pdfZipPath)
    ]);
    
    console.log(`Created zip archives for order: ${orderId}`);
    console.log(`Render zip size: ${renderSize} bytes`);
    console.log(`CAD zip size: ${cadSize} bytes`);
    console.log(`PDF zip size: ${pdfSize} bytes`);
    
    // Upload zip files to Firebase Storage
    const fileTypes = {
      renderImages: {
        path: renderZipPath,
        name: 'Render Images',
        size: renderSize
      },
      cadFiles: {
        path: cadZipPath,
        name: 'CAD Files',
        size: cadSize
      },
      pdfFiles: {
        path: pdfZipPath,
        name: 'PDF Documentation',
        size: pdfSize
      }
    };
    
    const uploadPromises = Object.entries(fileTypes).map(async ([fileType, fileInfo]) => {
      const zipPath = fileInfo.path;
      const fileName = `${fileType}.zip`;
      const storagePath = `orders/${orderId}/${fileName}`;
      
      console.log(`Uploading ${fileType} to Firebase Storage: ${storagePath}`);
      
      try {
        // Upload file to Firebase
        await bucket.upload(zipPath, {
          destination: storagePath,
          metadata: {
            contentType: 'application/zip',
            metadata: {
              orderId,
              fileType
            }
          }
        });
        
        console.log(`Successfully uploaded ${fileType} to Firebase Storage`);
        
        // Get file size
        const stats = fs.statSync(zipPath);
        
        // Store file metadata in Firestore
        await FileModel.create({
          orderId,
          fileType,
          fileName: fileInfo.name,
          storagePath,
          size: stats.size,
          path: storagePath, // Add path for client-side download
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // 7 days
        });
        
        console.log(`Stored ${fileType} metadata in Firestore`);
      } catch (error) {
        console.error(`Error uploading ${fileType} for order ${orderId}:`, error);
        throw error;
      }
    });
    
    await Promise.all(uploadPromises);
    
    // Update order status to indicate files are ready
    await OrderModel.updateStatus(orderId, 'files_ready');
    
    console.log(`All files generated and uploaded for order: ${orderId}`);
    
    return true;
  } catch (error) {
    console.error(`Error generating order files for ${orderId}:`, error);
    
    // Update order status to indicate error
    try {
      await OrderModel.updateStatus(orderId, 'file_generation_failed');
    } catch (statusError) {
      console.error(`Failed to update order status for ${orderId}:`, statusError);
    }
    
    throw error;
  } finally {
    // Clean up temporary files
    if (workDir && fs.existsSync(workDir)) {
      try {
        fs.rmSync(workDir, { recursive: true, force: true });
        console.log(`Cleaned up temporary directory for order: ${orderId}`);
      } catch (cleanupError) {
        console.error(`Error cleaning up temporary directory for order ${orderId}:`, cleanupError);
      }
    }
  }
};

// Generate render images based on order details
const generateRenderImages = async (order, outputDir) => {
  console.log(`Generating render images for order: ${order.id}`);
  
  // This is a placeholder implementation
  // In a real application, you would use a rendering engine or service
  
  // For demonstration, we'll create some sample image files
  const viewAngles = ['front', 'side', 'top', 'perspective'];
  const productType = order.productType || 'default';
  
  for (const angle of viewAngles) {
    // Create a placeholder image file
    const imagePath = path.join(outputDir, `${productType}_${angle}.jpg`);
    
    // Write a simple placeholder file
    // In a real app, you would generate actual rendered images
    fs.writeFileSync(imagePath, `Placeholder for ${productType} ${angle} view`);
  }
  
  console.log(`Generated ${viewAngles.length} render images for order: ${order.id}`);
  return true;
};

// Generate CAD files based on order details
const generateCADFiles = async (order, outputDir) => {
  console.log(`Generating CAD files for order: ${order.id}`);
  
  // This is a placeholder implementation
  // In a real application, you would use CAD software or APIs
  
  const fileFormats = ['dxf', 'dwg', 'step', 'stl'];
  const productType = order.productType || 'default';
  
  for (const format of fileFormats) {
    // Create a placeholder CAD file
    const filePath = path.join(outputDir, `${productType}.${format}`);
    
    // Write a simple placeholder file
    // In a real app, you would generate actual CAD files
    fs.writeFileSync(filePath, `Placeholder for ${productType} in ${format} format`);
  }
  
  // Add a README file
  const readmePath = path.join(outputDir, 'README.txt');
  fs.writeFileSync(readmePath, `
CAD Files for Order: ${order.id}
Product: ${order.product || 'Unknown Product'}
Date: ${new Date().toISOString().split('T')[0]}

File Formats Included:
- DXF: 2D drawing exchange format
- DWG: AutoCAD drawing format
- STEP: 3D model standard exchange format
- STL: 3D model stereolithography format

For support, contact support@example.com
  `);
  
  console.log(`Generated ${fileFormats.length} CAD files for order: ${order.id}`);
  return true;
};

// Generate PDF documentation based on order details
const generatePDFDocumentation = async (order, outputDir) => {
  console.log(`Generating PDF documentation for order: ${order.id}`);
  
  // This is a placeholder implementation
  // In a real application, you would use a PDF generation library
  
  const documentTypes = ['specifications', 'assembly_guide', 'materials_list', 'warranty'];
  const productType = order.productType || 'default';
  
  for (const docType of documentTypes) {
    // Create a placeholder PDF file
    const filePath = path.join(outputDir, `${productType}_${docType}.pdf`);
    
    // Write a simple placeholder file
    // In a real app, you would generate actual PDF documents
    fs.writeFileSync(filePath, `Placeholder for ${productType} ${docType} document`);
  }
  
  console.log(`Generated ${documentTypes.length} PDF documents for order: ${order.id}`);
  return true;
};

// Check if files are ready for an order
const checkOrderFilesStatus = async (orderId) => {
  try {
    // Check if files exist in Firestore
    const files = await FileModel.findByOrderId(orderId);
    
    // If we have at least one file of each type, consider files ready
    const fileTypes = files.map(file => file.fileType);
    const requiredTypes = ['renderImages', 'cadFiles', 'pdfFiles'];
    
    const allTypesPresent = requiredTypes.every(type => fileTypes.includes(type));
    
    return {
      filesReady: allTypesPresent,
      fileCount: files.length,
      files: files
    };
  } catch (error) {
    console.error(`Error checking file status for order ${orderId}:`, error);
    throw error;
  }
};

// Get download URL for a file
const getFileDownloadUrl = async (fileId) => {
  try {
    const file = await FileModel.findById(fileId);
    if (!file) throw new Error(`File ${fileId} not found`);
    
    // Generate a signed URL that expires in 1 hour
    const [url] = await bucket.file(file.storagePath).getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000 // 1 hour
    });
    
    return url;
  } catch (error) {
    console.error(`Error getting download URL for file ${fileId}:`, error);
    throw error;
  }
};

module.exports = {
  generateOrderFiles,
  createZipArchive,
  checkOrderFilesStatus,
  getFileDownloadUrl
};
