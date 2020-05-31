import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { Grommet, Header, Text, Button, Main, Heading } from "grommet";
import "./App.css";
import CreatePlaylistForm from "./CreatePlaylistForm";
import AddPlaylistPage from "./AddPlaylistPage";
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
  const [user, setUser] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div style={{ textAlign: "center", marginTop: "4vh" }}>
            <Button
              href="http://localhost:8080/login"
              label="Login with Spotify"
            ></Button>
          </div>
        );
      case 1:
        return (
          <CreatePlaylistForm
            setPlaylistTitle={setPlaylistTitle}
            playlistTitle={playlistTitle}
            spotifyApi={spotifyApi}
            userId={user.id}
            setActiveStep={setActiveStep}
          />
        );
      case 2:
        return (
          <div>
            <Heading>{playlistTitle}</Heading>
            <AddPlaylistPage
              spotifyApi={spotifyApi}
              setActiveStep={setActiveStep}
              setSelectedPlaylists={setSelectedPlaylists}
              selectedPlaylists={selectedPlaylists}
            />
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  useEffect(() => {
    const params = getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      setActiveStep(2);
      spotifyApi.getMe().then((response) => {
        setUser(response);
      });
    }
  }, []);

  return (
    <Grommet theme={theme}>
      <Header background="brand" justify="end" style={{ marginBottom: "3vh" }}>
        <Text>{user.email}</Text>
      </Header>
      <Main align="center">{getStepContent(activeStep)}</Main>
    </Grommet>
  );
}
