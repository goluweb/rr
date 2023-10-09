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
module.exports=app;
