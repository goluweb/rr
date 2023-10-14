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
    console.log('tt:', response.data);
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
    let BEARER_TOKEN ='eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjJlMjdkY2M1LTE0NmYtNDc5Ni1iYzcyLWM0MjEwYTMwMzZjZCJ9.eyJ2ZXIiOjksImF1aWQiOiJhZGNhOThiNzM4OGVjYzg4OThmNmViZmU2MGI3ODZmNyIsImNvZGUiOiJZYTJNOUVGMldCNHZoUjhFRDk3UXJPazNuN1k0a3lTTlEiLCJpc3MiOiJ6bTpjaWQ6MlF6WG9hc29RQmltV1B0YlhJc2ciLCJnbm8iOjAsInR5cGUiOjEsInRpZCI6MCwiYXVkIjoiaHR0cHM6Ly9vYXV0aC56b29tLnVzIiwidWlkIjoiUS03VkxIaWVSLVdNdThTU292M2NqQSIsIm5iZiI6MTY5NjkyNDYxNSwiZXhwIjoxNzA0NzAwNjE1LCJpYXQiOjE2OTY5MjQ2MTUsImFpZCI6ImZCTFVGS3JHUldXZVg1LTA3TWRQb2cifQ.vRTH3pgEK5TsJqVWVt1QraKHNJeFK-ciw91_zDXojsxpZnP6fw-HYUS_XSejTXuT782792LqNppXssaulL4b1g';

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




// Define a route to generate the Zoom signature
app.get('/generate-signature', (req, res) => {

  const apiKey = 'Pm0aZWzoS0C6YKxtlUFEJw';
  const apiSecret = 'HhJR497swnjN84mn3RowBT8vprBf8mUw';

  const timestamp = new Date().getTime() - 30000; // 30 seconds in the past
  const message = Buffer.from(apiKey + req.query.meetingNumber + timestamp + req.query.role).toString('base64');
  const signature = crypto.createHmac('sha256', apiSecret).update(message).digest('base64');

  res.json({ signature });
});


module.exports=app;
