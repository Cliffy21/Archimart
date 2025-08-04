
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, ChevronRight, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { ref, getDownloadURL } from 'firebase/storage';
//import { storage } from '../config/firebase'; // Import storage from your config file

const PaymentSuccessPage = ({ 
  orderDetails = {
    orderId: "ORD-12345",
    date: "March 6, 2025",
    amount: "$149.99",
    product: "3D Model Package - Modern Kitchen",
    customerName: "Alex Johnson"
  },
  files = {
    renderImages: { name: "Render Images", size: "15.2 MB" },
    cadFiles: { name: "CAD Files", size: "8.7 MB" },
    pdfFiles: { name: "PDF Documentation", size: "3.4 MB" }
  }
}) => {
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadComplete, setDownloadComplete] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(orderDetails);
  const [fileData, setFileData] = useState(files);
  const [filesReady, setFilesReady] = useState(false);

  // Helper function to format file size - moved outside of useEffect
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Function to handle file downloads
  const initiateDownload = async (fileType) => {
    if (downloadProgress[fileType] && downloadProgress[fileType] < 100 && downloadProgress[fileType] > 0) {
      // Download already in progress
      return;
    }

    try {
      // Reset any previous errors
      setError(null);

      // Initialize progress
      setDownloadProgress(prev => ({
        ...prev,
        [fileType]: 0
      }));

      // Get the file path from your file data
      const filePath = fileData[fileType].path || `orders/${orderData.orderId}/${fileType}`;
      
      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, filePath);
      
      // Get the download URL
      const url = await getDownloadURL(fileRef);
      
      // Create XMLHttpRequest to track download progress
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      
      // Track download progress
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setDownloadProgress(prev => ({
            ...prev,
            [fileType]: progress
          }));
        }
      };
      
      // Handle download completion
      xhr.onload = () => {
        if (xhr.status === 200) {
          // Create a download link and trigger it
          const blob = xhr.response;
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = fileData[fileType].name || `${fileType}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Mark as complete
          setDownloadComplete(prev => ({
            ...prev,
            [fileType]: true
          }));
          
         // Show success notification
         toast.success('File downloaded!');
         toast.success(`${fileData[fileType].name} downloaded successfully!`);
          
          // Clean up
          URL.revokeObjectURL(downloadUrl);
        } else {
          throw new Error(`Download failed with status ${xhr.status}`);
        }
      };
      
      // Handle errors
      xhr.onerror = () => {
        setDownloadProgress(prev => ({
          ...prev,
          [fileType]: 0
        }));
        setError(`Failed to download ${fileData[fileType].name}. Please try again.`);
        toast.error(`Failed to download ${fileData[fileType].name}. Please try again.`);
      };
      
      // Start the download
      xhr.open('GET', url);
      xhr.send();
      
    } catch (error) {
      console.error(`Error downloading ${fileType}:`, error);
      setDownloadProgress(prev => ({
        ...prev,
        [fileType]: 0
      }));
      setError(`Failed to download ${fileData[fileType].name}. ${error.message}`);
      toast.error(`Failed to download ${fileData[fileType].name}. Please try again.`);
    }
  };

  // Function to navigate to other pages
  const navigateTo = (path) => {
    window.location.href = path;
  };

  // Fetch order details from the backend
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setError(null);
        const orderId = new URLSearchParams(window.location.search).get('orderId');
        if (!orderId) {
          setError("Order ID not found in URL. Please check your confirmation email for the correct link.");
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(`/api/orders/${orderId}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Update order details with real data
          setOrderData({
            orderId: data.orderId || orderId,
            date: new Date(data.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            amount: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(data.amount / 100), // Assuming amount is in cents
            product: data.productName || "3D Model Package",
            customerName: data.customerName || "Customer"
          });
          
          // Check if files are ready
          setFilesReady(data.filesReady || false);
          
          // Then fetch files information
          fetchOrderFiles(orderId);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch order details");
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(`Failed to load order details: ${error.message}`);
        toast.error(`Failed to load order details: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
  
    const fetchOrderFiles = async (orderId) => {
      try {
        const response = await fetch(`/api/orders/${orderId}/files`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Transform the files data to match our expected format
          const formattedFiles = {};
          
          data.files.forEach(file => {
            formattedFiles[file.type] = {
              name: file.name,
              size: formatFileSize(file.size),
              path: file.path,
              type: file.type
            };
          });
          
          // Update files state if we have any files
          if (Object.keys(formattedFiles).length > 0) {
            setFileData(formattedFiles);
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch files");
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        setError(`Failed to load file information: ${error.message}`);
        toast.error(`Failed to load file information: ${error.message}`);
      }
    };
    
    fetchOrderDetails();
  }, []);
  
  // Check file status periodically
  useEffect(() => {
    // Only check file status if we're not already showing files as ready
    if (filesReady) return;
    
    const checkFilesStatus = async () => {
      const orderId = new URLSearchParams(window.location.search).get('orderId');
      if (!orderId) return;
      
      try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.filesReady) {
            setFilesReady(true);
            // Now it's safe to initiate downloads
            Object.keys(fileData).forEach(fileType => {
              initiateDownload(fileType);
            });
          } else {
            // Check again in a few seconds
            setTimeout(checkFilesStatus, 5000);
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to check file status");
        }
      } catch (error) {
        console.error('Error checking files status:', error);
        setError(`Failed to check if files are ready: ${error.message}`);
        // Don't show toast here to avoid spamming the user with errors
      }
    };
    
    const timer = setTimeout(checkFilesStatus, 2000);
    return () => clearTimeout(timer);
  }, [filesReady, fileData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-500 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
          <p className="text-green-100 mt-2">Your order has been processed and is ready for download</p>
        </div>
        
        {/* Error Message (if any) */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <p className="text-sm text-red-600 mt-2">
              If the problem persists, please contact our support team.
            </p>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order details...</p>
          </div>
        ) : (
          <>
            {/* Order Summary */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{orderData.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{orderData.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">{orderData.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-medium">{orderData.product}</p>
                </div>
              </div>
            </div>
            
            {/* Download Section */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Files</h2>
              {!filesReady ? (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="animate-pulse flex space-x-4 items-center justify-center mb-2">
                    <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                    <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                    <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                  </div>
                  <p className="text-blue-700">Your files are being prepared. This may take a few moments...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">Click to download or wait for automatic download to begin</p>
                  
                  <div className="space-y-4">
                    {Object.entries(fileData).map(([fileType, fileInfo]) => (
                      <div key={fileType} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-3 sm:mb-0">
                          <p className="font-medium">{fileInfo.name}</p>
                          <p className="text-sm text-gray-500">{fileInfo.size}</p>
                        </div>
                        
                        <div className="w-full sm:w-auto flex items-center">
                          {downloadComplete[fileType] ? (
                            <button 
                              className="flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium w-full sm:w-auto"
                              onClick={() => initiateDownload(fileType)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Downloaded
                            </button>
                          ) : downloadProgress[fileType] !== undefined && downloadProgress[fileType] > 0 ? (
                            <div className="w-full sm:w-48">
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 transition-all duration-300"
                                  style={{ width: `${downloadProgress[fileType]}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 text-center">{downloadProgress[fileType]}% Complete</p>
                            </div>
                          ) : (
                            <button 
                              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition w-full sm:w-auto"
                              onClick={() => initiateDownload(fileType)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Next Steps */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">What's Next?</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div 
                  className="flex-1 border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigateTo('/orders')}
                >
                  <h3 className="font-medium flex items-center">
                    View All Orders
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">Check status and download files from previous orders</p>
                </div>
                <div 
                  className="flex-1 border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigateTo('/products')}
                >
                  <h3 className="font-medium flex items-center">
                    Browse More Products
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">Explore our catalog for more designs and models</p>
                </div>
              </div>
              
              {/* Support Section */}
              <div className="mt-8 bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800">Need Help?</h3>
                <p className="text-sm text-blue-600 mt-1">Our support team is ready to assist you</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  <button 
                    className="flex items-center justify-center bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-lg font-medium hover:shadow-sm transition"
                    onClick={() => window.location.href = 'mailto:support@example.com?subject=Order Support: ' + orderData.orderId}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </button>
                  <button 
                    className="flex items-center justify-center bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-lg font-medium hover:shadow-sm transition"
                    onClick={() => window.location.href = '/support/chat'}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
          Thank you for your purchase. A confirmation email has been sent to your registered email address.
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;