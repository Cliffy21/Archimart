
// pages/api/auth/signup.js
import clientPromise from '../../../lib/mongodb';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // Make sure this matches your DB name
    
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password (with salt rounds of 12)
    const hashedPassword = await hash(password, 12);

    // Create new user with hashed password
    const newUser = await db.collection('users').insertOne({
      email,
      password: hashedPassword, // Now properly hashed
      name,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ 
      message: 'User created successfully',
      userId: newUser.insertedId 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
