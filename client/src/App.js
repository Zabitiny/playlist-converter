/* global gapi */

import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const SpotifyWebApi = new Spotify();
const YtApiKey = 'AIzaSyBlzDF533AfjVyqrzKOmlMm2QpZneMeClU';

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      transferStatus: {
        status: 'incomplete',
        image: ''
      },
      gapiReady: false
    };
    if (params.access_token) {
      SpotifyWebApi.setAccessToken(params.access_token);
    }
  }

  loadYoutubeApi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";
    
    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.setApiKey(YtApiKey);
        gapi.client.load('youtube', 'v3', () => {
            this.setState({ gapiReady: true});
        })
      });
    };
  }

  componentDidMount() {
    this.loadYoutubeApi();
  }

  // coping from spotify-auth-server/authorization_code/app.js
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    // eslint-disable-next-line
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  transferPlaylist() {
    var request = require("request");
    var userId = "gam3freak";
    var token = "Bearer ";
    var playlistsUrl = "https://api.spotify.com/v1/users/"+userId+"/playlists";

    request({url: playlistsUrl, headers:{"Authorization": token}}, function(err, res) { 
      if(res) {
        var playlists = JSON.parse(res.body);
        var playlistUrl = playlists.href;
        request({url: playlistUrl, headers:{"Authorization": token}}, function(err, res) {
          if(res) {
            var playlist = JSON.parse(res.body);
            console.log("playlist: " + playlist.name);
            playlist.tracks.forEach(function(track) {
              console.log(track.track.name);
            });
          }
        })
      }
    });
  }

  render() {
    return (
      <div className="App">
        <a href="http://localhost:8888">
          <button>login with Spotify</button>
        </a>
        <div>
          transfer from 
          <select name="from" defaultValue="" id="platform1">
            <option value="blank"></option>
            <option value="spotify">Spotify</option>
            <option value="youtube">YouTube</option>
          </select>
          to
          <select name="to" id="platform2">
            <option value="blank"></option>
            <option value="spotify">Spotify</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
        <label htmlFor="playlistName">Playlist Name:</label>
        <input type="text" id="playlistName"></input>
        <div>
          <button onClick={() => this.transferPlaylist()}>transfer</button>
        </div>
      </div>
    );
  }
}

export default App;
