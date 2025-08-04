// utils/scheduledJobs.js
const Plan = require('../Models/Plan');
const cron = require('node-cron');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

/**
 * Schedule background jobs for the application
 */
function scheduleJobs() {
  // Get MongoDB connection
  let db;
  let filesCollection;
  let usersCollection;
  
  // Connect to MongoDB
  async function connectToMongoDB() {
    try {
      const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      await client.connect();
      console.log('Connected to MongoDB for scheduled jobs');
      
      db = client.db(process.env.MONGO_DB_NAME || 'admin_panel');
      filesCollection = db.collection('files');
      usersCollection = db.collection('users');
      
      return true;
    } catch (error) {
      console.error('MongoDB connection error for scheduled jobs:', error);
      return false;
    }
  }

  // Clean up temporary files (runs daily at midnight)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily cleanup job');
    
    try {
      // Connect to MongoDB if not already connected
      if (!db) {
        const connected = await connectToMongoDB();
        if (!connected) return;
      }
      
      // Find soft-deleted files older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const filesToDelete = await filesCollection.find({
        isActive: false,
        deletedAt: { $lt: thirtyDaysAgo }
      }).toArray();
      
      console.log(`Found ${filesToDelete.length} old deleted files to clean up`);
      
      // Delete files from filesystem and database
      const uploadsDir = path.join(__dirname, '../uploads');
      
      for (const file of filesToDelete) {
        const filePath = path.join(uploadsDir, file.fileName);
        
        // Delete from filesystem if exists
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${file.fileName}`);
        }
        
        // Delete from database
        await filesCollection.deleteOne({ fileId: file.fileId });
      }
      
      console.log('Cleanup job completed');
    } catch (error) {
      console.error('Error in cleanup job:', error);
    }
  });
  
  // Update user statistics (runs weekly on Sunday at 1am)
  cron.schedule('0 1 * * 0', async () => {
    console.log('Running weekly user statistics job');
    
    try {
      // Connect to MongoDB if not already connected
      if (!db) {
        const connected = await connectToMongoDB();
        if (!connected) return;
      }
      
      // Calculate statistics
      const totalUsers = await usersCollection.countDocuments();
      const activeUsers = await usersCollection.countDocuments({ isActive: true });
      const adminUsers = await usersCollection.countDocuments({ role: 'admin' });
      
      // Find users who haven't logged in for 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const inactiveUsers = await usersCollection.countDocuments({
        lastLogin: { $lt: ninetyDaysAgo }
      });
      
      // Store statistics in database or log them
      console.log(`User Statistics:
        - Total Users: ${totalUsers}
        - Active Users: ${activeUsers}
        - Admin Users: ${adminUsers}
        - Inactive Users (90+ days): ${inactiveUsers}
      `);
      
      console.log('User statistics job completed');
    } catch (error) {
      console.error('Error in user statistics job:', error);
    }
  });
  
  console.log('Scheduled jobs initialized');
}

module.exports = scheduleJobs;