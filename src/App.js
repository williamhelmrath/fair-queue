import React from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

function App() {
  const handleLogin = () => {
    console.log("ahhh");
  };
  console.log("rendered");
  return (
    <div style={{ textAlign: "center" }}>
      <a href="http://localhost:8888/login">Login</a>
    </div>
  );
}

export default App;
