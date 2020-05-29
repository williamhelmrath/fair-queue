import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";

const spotifyApi = new SpotifyWebApi();

const getHashParams = () => {
  let hashParams = {};
  let e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  e = r.exec(q);
  while (e) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
    e = r.exec(q);
  }
  return hashParams;
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({
    name: "Not Checked",
    albumArt: "",
  });

  useEffect(() => {
    const params = getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      console.log("token", spotifyApi.getAccessToken());
      setLoggedIn(true);
    }
  }, []);

  const getNowPlaying = () => {
    console.log("getting now playing");
    spotifyApi.getMyCurrentPlayingTrack().then((response) => {
      console.log(response);
      setNowPlaying({
        name: response.item.name,
        albumArt: response.item.album.images[0].url,
      });
    });
  };

  if (!loggedIn) {
    return (
      <div style={{ textAlign: "center" }}>
        <a href="http://localhost:8888/login">Login</a>
      </div>
    );
  }
  return (
    <div style={{ textAlign: "center" }}>
      <div>Now Playing: {nowPlaying.name}</div>
      <div>
        <img
          src={nowPlaying.albumArt}
          style={{ height: 150 }}
          alt="album art"
        />
      </div>
      <button onClick={getNowPlaying}>Check Now Playing</button>
    </div>
  );
}
