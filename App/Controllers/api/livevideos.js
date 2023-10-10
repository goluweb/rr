const express = require('express');
const app = express();
const axios = require('axios');

const CLIENT_ID = '2QzXoasoQBimWPtbXIsg';
const CLIENT_SECRET = '7JP72COlmOyFbFjSOETepQr3eyADgp4G';
const crypto = require('crypto');


// Function 


const querystring = require('querystring');  
app.get('/authorize', (req, res) => {
  const redirectUri = encodeURIComponent('https://node-project-rc3o.onrender.com/api/live/callback');
  const state = crypto.randomBytes(16).toString('hex');
  const authorizeUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}`;
  res.redirect(authorizeUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  // Exchange the code for an access token
  const tokenParams = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'https://node-project-rc3o.onrender.com/api/live/callback', // Must match the redirect URI you used in the authorize request
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const authString = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const base64Auth = Buffer.from(authString).toString('base64');
  headers.Authorization = `Basic ${base64Auth}`;
  try {
    const response = await axios.post('https://zoom.us/oauth/token', querystring.stringify(tokenParams), { headers });
    const accessToken = response.data.access_token;
    console.log('Access Token:', accessToken);
    res.send('Access Token: ' + accessToken);
     } 
    catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error');
  }
});








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
    let BEARER_TOKEN ='eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjdmMWE1ZGRhLTc3N2YtNGExMC1iMzYyLTJlMDE2NDk2NGVkOCJ9.eyJ2ZXIiOjksImF1aWQiOiJhZGNhOThiNzM4OGVjYzg4OThmNmViZmU2MGI3ODZmNyIsImNvZGUiOiJ4bmIyRGNaeDU3MXJBb1BKY3JqUUxpd3R2dnNGYWZ4TEEiLCJpc3MiOiJ6bTpjaWQ6MlF6WG9hc29RQmltV1B0YlhJc2ciLCJnbm8iOjAsInR5cGUiOjAsInRpZCI6MCwiYXVkIjoiaHR0cHM6Ly9vYXV0aC56b29tLnVzIiwidWlkIjoiUS03VkxIaWVSLVdNdThTU292M2NqQSIsIm5iZiI6MTY5NjkyMzU0OCwiZXhwIjoxNjk2OTI3MTQ4LCJpYXQiOjE2OTY5MjM1NDgsImFpZCI6ImZCTFVGS3JHUldXZVg1LTA3TWRQb2cifQ.v3mGPoQLJwUE-U8snAaam_dgODeyUyE9lR6nBkAQj7aGvqIt-i31Bnljkb-cRwddJPJKdws3EoDO_kSi-rQCDA';

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
