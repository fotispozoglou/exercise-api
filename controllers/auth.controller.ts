import { Request, Response } from "express";
import { Buffer } from "buffer";
import crypto from 'crypto';
import axios from 'axios';
import querystring from 'querystring';
import { SpotifyTokenResponse } from "../types/spotify";

const SCOPES = `streaming user-read-playback-position user-modify-playback-state user-read-playback-state user-read-email`;

const login = ( request : Request, response : Response ) => {

  const state = crypto.randomBytes(16).toString('hex');

  response.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: SCOPES,
      redirect_uri: process.env.REDIRECT_URI,
      state: state
  }));

};

const spotifyCallback = async ( request : Request, response : Response ) => {

  var code = request.query.code || null;
  var state = request.query.state || null;  
  
  if (state === null) {

    response.send(JSON.stringify({ error: 'state_mismatch' }));
  
  } else {

    const tokenResponse = await axios.post< any, SpotifyTokenResponse >('https://accounts.spotify.com/api/token', `code=${ encodeURIComponent( `${ code }` ) }&grant_type=${ encodeURIComponent("authorization_code") }&redirect_uri=${ encodeURIComponent( `${ process.env.REDIRECT_URI }` ) }`, {
      headers: { 
        'Authorization': `Basic ${ Buffer.from(`${ process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET }`).toString('base64') }`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000
    });   

    if ( tokenResponse.status != 200 ) return response.send(JSON.stringify({ error: 'Error' })); 

    response.cookie('token', tokenResponse.data.refresh_token);

    response.send(JSON.stringify({ token: tokenResponse.data.access_token }));

  }

};

const refreshSpotifyToken = async ( request : Request, response : Response ) => {  

  if ( !request.cookies.token ) return response.send(JSON.stringify({ error: 1 }));

  const refresh_token = String(request.cookies.token) || '';

  const refreshTokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
    querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
    {
      headers: { 
        'Authorization': `Basic ${ Buffer.from(`${ process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET }`).toString('base64') }`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  if ( refreshTokenResponse && refreshTokenResponse.status === 200) {

    const { expires_in, access_token } = refreshTokenResponse.data;
    
    response.send(JSON.stringify({
      'access_token': access_token,
      'expiresIn': expires_in
    }));

  }

};

export default {
  login,
  spotifyCallback,
  refreshSpotifyToken
};