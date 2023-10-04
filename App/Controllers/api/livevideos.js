const express = require('express');
const app = express();
const axios = require('axios');

const CLIENT_ID = 'y_406UKfROiEzqDXKcfT2A';
const CLIENT_SECRET = 'TjZUOBLkI9387sf4Ftwlb2SaK9DU8kti';

// Function to generate a new access token
const generateAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://zoom.us/oauth/token',
      null,
      {
        params: {
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating access token:', error.response.data);
    throw error;
  }
};

let BEARER_TOKEN = null;

const ensureValidToken = async () => {
  if (!BEARER_TOKEN) {
    BEARER_TOKEN = await generateAccessToken();
  }
};

app.post('/golive', async (req, res) => {
  try {
    await ensureValidToken();

    const meetingParams = {
      host_id: 'me',
      topic: 'Arvind Pahadi',
      type: 2,
      start_time: '2023-08-05T12:00:00Z',
      timezone: 'IST',
    };

    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingParams, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });

    console.log('Meeting created:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating meeting:', error.response.data);
    res.status(error.response.status).json(error.response.data);
  }
});

module.exports=app;
