import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { Grommet, Header, Text, Button, Main } from "grommet";
import "./App.css";
import CreatePlaylistForm from "./CreatePlaylistForm";
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

const theme = {
  global: {
    colors: { brand: "#1DB954" },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [create, setCreate] = useState(false);
  const [user, setUser] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");

  useEffect(() => {
    const params = getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      setLoggedIn(true);
      spotifyApi.getMe().then((response) => {
        setUser(response);
      });
    }
  }, []);

  if (!loggedIn) {
    return (
      <Grommet theme={theme}>
        <div style={{ textAlign: "center", marginTop: "4vh" }}>
          <Button
            href="http://localhost:8080/login"
            label="Login with Spotify"
          ></Button>
        </div>
      </Grommet>
    );
  }
  return (
    <Grommet theme={theme}>
      <Header background="brand" justify="end" style={{ marginBottom: "3vh" }}>
        <Text>{user.email}</Text>
      </Header>
      <Main align="center">
        <Button
          primary
          label="Create a fair queue!"
          onClick={() => setCreate(true)}
          size="large"
          style={{ width: "40vw" }}
        ></Button>
      </Main>

      {create && (
        <CreatePlaylistForm
          setCreate={setCreate}
          setPlaylistTitle={setPlaylistTitle}
          playlistTitle={playlistTitle}
          spotifyApi={spotifyApi}
          userId={user.id}
        />
      )}
    </Grommet>
  );
}
