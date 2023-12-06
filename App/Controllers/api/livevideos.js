const express = require('express');
const app = express();
const axios = require('axios');

const clientId = '2QzXoasoQBimWPtbXIsg';
const clientSecret = '7JP72COlmOyFbFjSOETepQr3eyADgp4G';
const redirectUri = 'https://node-project-rc3o.onrender.com/api/live/callback';

// Function to refresh the Zoom access token using the refresh token
async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

app.get('/authorize', (req, res) => {
  res.redirect(`https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      },
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    console.log(accessToken)
    console.log("refresh"+refreshToken)
    // Save the refresh token securely for future use

    // Redirect to a success page or handle as needed
    res.send('Authorization successful');
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/golive', async (req, res) => {
  try {
    // Replace <your_refresh_token> with the actual refresh token obtained during OAuth
    const refreshToken = 'eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImNlODg1YmUyLWJlNTAtNDZhNy1iOWEyLWY2YTRmNjBiNzA4OCJ9.eyJ2ZXIiOjksImF1aWQiOiJhZGNhOThiNzM4OGVjYzg4OThmNmViZmU2MGI3ODZmNyIsImNvZGUiOiJEV2xSTWhjc3dRZEFVRmZCdGQxUTltaU1ycjFVWTh1X0EiLCJpc3MiOiJ6bTpjaWQ6MlF6WG9hc29RQmltV1B0YlhJc2ciLCJnbm8iOjAsInR5cGUiOjEsInRpZCI6MCwiYXVkIjoiaHR0cHM6Ly9vYXV0aC56b29tLnVzIiwidWlkIjoiUS03VkxIaWVSLVdNdThTU292M2NqQSIsIm5iZiI6MTcwMTg0ODY3OCwiZXhwIjoxNzA5NjI0Njc4LCJpYXQiOjE3MDE4NDg2NzgsImFpZCI6ImZCTFVGS3JHUldXZVg1LTA3TWRQb2cifQ.9B3rBRbV-AIODuXvbukCENRyKQEMS-us_cf20xMliuM8xOwBXpwoTSnl_X-GpaXFV3cDG3yHMRkxII8gprUGQg';
    const accessToken = await refreshAccessToken(refreshToken);

    const meetingParams = {
      host_id: 'me',
      topic: 'dinesh Pahadi',
      type: 2,
      start_time: '2023-08-05T12:00:00Z',
      timezone: 'IST',
    };

    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingParams, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Meeting created:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
  }
});

module.exports = app;
