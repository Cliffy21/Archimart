
import nodemailer from 'nodemailer';



export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const customPlan = req.body;
    
    // Validate required fields
    if (!customPlan.customerEmail || !customPlan.planName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Log the submission details
    console.log('Custom plan submission received:', {
      id: customPlan.id,
      planName: customPlan.planName,
      customerEmail: customPlan.customerEmail,
    });

    // For security and debugging, log if environment variables are available (without showing values)
    console.log('Email environment variables status:', {
      host: !!process.env.EMAIL_HOST,
      port: !!process.env.EMAIL_PORT,
      user: !!process.env.EMAIL_USER, 
      pass: !!process.env.EMAIL_PASS,
      from: !!process.env.EMAIL_FROM
    });

    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not found in environment variables');
      
      // Return success but note that email wasn't sent
      return res.status(200).json({ 
        message: 'Custom plan submitted successfully, but email notification was not sent',
        emailSent: false,
        planId: customPlan.id,
        success: true,
        note: 'Email credentials not configured. Please check server environment variables.'
      });
    }

    // Create a transporter with your domain email credentials
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'mail.privateemail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465', // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your domain email (e.g., support@theplancave.com)
        pass: process.env.EMAIL_PASS  // Your email password
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      },
      debug: true // Enable for debugging, remove in production
    });

    // Verify SMTP connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return res.status(200).json({
        message: 'Custom plan submitted successfully, but email server connection failed',
        emailSent: false,
        planId: customPlan.id,
        success: true,
        emailError: verifyError.message
      });
    }

    // Email content
    let mailOptions = {
      from: process.env.EMAIL_FROM || `"The Plan Cave" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself (support@theplancave.com)
      replyTo: customPlan.customerEmail, // Set reply-to as the customer's email
      subject: `Custom Plan Review Request: ${customPlan.planName}`,
      text: `
        New custom plan submission:
        
        Plan ID: ${customPlan.id}
        Plan Name: ${customPlan.planName}
        Base Plan: ${customPlan.basePlan}
        Bedrooms: ${customPlan.bedrooms}
        Bathrooms: ${customPlan.bathrooms}
        Floors: ${customPlan.floors}
        Area: ${customPlan.area} sq ft
        Total Cost: $${customPlan.totalCost}
        
        Customer Email: ${customPlan.customerEmail}
        Submission Date: ${new Date(customPlan.submissionDate).toLocaleString()}
        
        Additional Requirements:
        ${customPlan.additionalRequirements || "None provided"}
      `,
      html: `
        <h2>New Custom Plan Submission</h2>
        <p><strong>Plan ID:</strong> ${customPlan.id}</p>
        <p><strong>Plan Name:</strong> ${customPlan.planName}</p>
        <p><strong>Base Plan:</strong> ${customPlan.basePlan}</p>
        <p><strong>Bedrooms:</strong> ${customPlan.bedrooms}</p>
        <p><strong>Bathrooms:</strong> ${customPlan.bathrooms}</p>
        <p><strong>Floors:</strong> ${customPlan.floors}</p>
        <p><strong>Area:</strong> ${customPlan.area} sq ft</p>
        <p><strong>Total Cost:</strong> $${customPlan.totalCost}</p>
        <p><strong>Customer Email:</strong> ${customPlan.customerEmail}</p>
        <p><strong>Submission Date:</strong> ${new Date(customPlan.submissionDate).toLocaleString()}</p>
        <p><strong>Additional Requirements:</strong><br/>${customPlan.additionalRequirements || "None provided"}</p>
      `
    };

    try {
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      
      // Also send a confirmation email to the customer
      const customerMailOptions = {
        from: process.env.EMAIL_FROM || `"The Plan Cave" <${process.env.EMAIL_USER}>`,
        to: customPlan.customerEmail,
        subject: `Your Custom Plan Request - ${customPlan.planName}`,
        text: `
          Thank you for submitting your custom plan request to The Plan Cave!
          
          We've received your request for "${customPlan.planName}" and our architects will review it shortly.
          You'll receive your personalized design once it's ready.
          
          Your request details:
          
          Plan Name: ${customPlan.planName}
          Bedrooms: ${customPlan.bedrooms}
          Bathrooms: ${customPlan.bathrooms}
          Floors: ${customPlan.floors}
          Area: ${customPlan.area} sq ft
          Estimated Cost: $${customPlan.totalCost}
          
          If you have any questions, please contact us at ${process.env.EMAIL_USER}.
          
          Thank you for choosing The Plan Cave!
        `,
        html: `
          <h2>Thank You for Your Custom Plan Request!</h2>
          <p>We've received your request for "${customPlan.planName}" and our architects will review it shortly.</p>
          <p>You'll receive your personalized design once it's ready.</p>
          
          <h3>Your Request Details:</h3>
          <ul>
            <li><strong>Plan Name:</strong> ${customPlan.planName}</li>
            <li><strong>Bedrooms:</strong> ${customPlan.bedrooms}</li>
            <li><strong>Bathrooms:</strong> ${customPlan.bathrooms}</li>
            <li><strong>Floors:</strong> ${customPlan.floors}</li>
            <li><strong>Area:</strong> ${customPlan.area} sq ft</li>
            <li><strong>Estimated Cost:</strong> $${customPlan.totalCost}</li>
          </ul>
          
          <p>If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>
          
          <p>Thank you for choosing The Plan Cave!</p>
        `
      };
      
      try {
        await transporter.sendMail(customerMailOptions);
        console.log('Customer confirmation email sent');
      } catch (customerEmailError) {
        console.error('Failed to send customer confirmation email:', customerEmailError);
        // Continue even if customer email fails
      }
      
      return res.status(200).json({ 
        message: 'Custom plan submitted successfully',
        emailSent: true,
        emailId: info.messageId,
        planId: customPlan.id,
        success: true
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      
      // Return success even if email fails, but note the email failure
      return res.status(200).json({ 
        message: 'Custom plan submitted successfully, but email notification failed',
        emailSent: false,
        planId: customPlan.id,
        success: true,
        emailError: emailError.message
      });
    }
    
  } catch (error) {
    console.error('Error handling custom plan submission:', error);
    return res.status(500).json({ 
      message: 'Failed to submit custom plan',
      error: error.message,
      success: false
    });
  }
}