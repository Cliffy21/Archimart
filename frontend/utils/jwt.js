const axios = require('axios');

const DATABASE_URL = process.env.DATABASE_URL || 'http://localhost:5001';

async function generateJwtForUser(user) {
  try {
    const response = await axios.post(`${DATABASE_URL}/login`, {
      username: user.username,
      password: user.password,
    });

    const token = response.data?.access_token;
    if (!token) throw new Error('No token received from Flask');
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error.response?.data || error.message);
    throw new Error('JWT generation failed');
  }
}

async function verifyJwt(token) {
  try {
    const response = await axios.post(`${DATABASE_URL}/verify_token`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data?.valid) {
      throw new Error('JWT invalid');
    }

    return response.data.payload;
  } catch (error) {
    console.error('Error verifying JWT:', error.response?.data || error.message);
    throw new Error('Token verification failed');
  }
}

module.exports = {
  generateJwtForUser,
  verifyJwt,
};
