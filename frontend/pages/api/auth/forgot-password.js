import { sendPasswordResetEmail } from '../../../lib/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // First, check if user exists and generate reset token via Flask backend
    const flaskResponse = await fetch(`${process.env.DATABASE_URL}/api/auth/generate-reset-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await flaskResponse.json();

    if (!flaskResponse.ok) {
      return res.status(flaskResponse.status).json({
        message: data.message || 'Failed to process reset request'
      });
    }

    // If user exists and token generated, send email using the imported mailer
    if (data.token) {
      await sendPasswordResetEmail(email, data.token);
      
      return res.status(200).json({
        message: 'Password reset link sent to your email'
      });
    } else {
      return res.status(400).json({
        message: 'Failed to generate reset token'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Check if it's a mailer error specifically
    if (error.message && error.message.includes('mail')) {
      return res.status(500).json({
        message: 'Failed to send email. Please try again.'
      });
    }
    
    return res.status(500).json({
      message: 'An error occurred. Please try again.'
    });
  }
}