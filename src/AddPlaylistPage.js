import React, { useState } from "react";
import { Box, TextInput, Image, Text, Button } from "grommet";
import { FormSearch } from "grommet-icons";

export default function AddPlaylistPage({
  selectedPlaylists,
  spotifyApi,
  setActiveStep,
  setSelectedPlaylists,
}) {
  const [username, setUsername] = useState("");
  const [playlists, setPlaylists] = useState([]);

  const handleSearch = () => {
    spotifyApi.getUserPlaylists(username).then((res) => {
      console.log(res);
      setPlaylists(res.items);
    });
  };

  const handleAddPlaylist = (id) => {
    let tempPlaylists = [...selectedPlaylists, id];
    setSelectedPlaylists(tempPlaylists);
    console.log(selectedPlaylists);
  };
  return (
    <div>
      <form onSubmit={handleSearch}>
        <Box gap="small" margin="medium" width="40vw">
          <TextInput
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            icon={<FormSearch />}
          />
        </Box>
      </form>
      {playlists.map((playlist) => {
        return (
          <Box
            direction="row"
            animation="fadeIn"
            margin="4vh"
            key={playlist.id}
            border={{ color: "brand", size: "small", style: "groove" }}
            elevation="medium"
            pad="medium"
            round="small"
            background="light-3"
          >
            {" "}
            {playlist.images.length !== 0 ? (
              <Image
                style={{ width: "auto", maxHeight: "12vh" }}
                src={playlist.images[0].url}
                fallback="https://lh3.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM"
              />
            ) : (
              <Image
                style={{ width: "auto", maxHeight: "12vh" }}
                src="https://lh3.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM"
              />
            )}
            <Text>{playlist.name}</Text>
            <Button
              label="Add"
              primary
              onClick={() => handleAddPlaylist(playlist.id)}
              disabled={selectedPlaylists.includes(playlist.id)}
              color="accent-1"
            />
          </Box>
        );
      })}
    </div>
  );
}
