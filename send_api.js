const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

code = '1eiojfwoiefj293uroijffe';

const send = async () => {

  const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', `code=${ encodeURIComponent( `${ code }` ) }&grant_type=${ encodeURIComponent("authorization_code") }&redirect_uri=${ encodeURIComponent( `${ process.env.REDIRECT_URI }` ) }`, {
    headers: { 
      'Authorization': `Basic ${ Buffer.from(`${ process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET }`).toString('base64') }`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });

  console.log(tokenResponse.data);

};

send();
