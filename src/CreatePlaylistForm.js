import React from "react";
import { Layer, Box, TextInput, Button } from "grommet";

export default function CreatePlaylistForm({
  setCreate,
  setPlaylistTitle,
  playlistTitle,
  spotifyApi,
  userId,
}) {
  const handleSave = () => {
    spotifyApi.createPlaylist(userId, {
      name: playlistTitle,
      public: true,
    });
    setCreate(false);
  };

  return (
    <Layer
      margin="small"
      onEsc={() => setCreate(false)}
      onClickOutside={() => setCreate(false)}
    >
      <Box gap="small" margin="medium" width="40vw">
        <form onSubmit={handleSave}>
          <TextInput
            placeholder="Title"
            value={playlistTitle}
            onChange={(event) => setPlaylistTitle(event.target.value)}
            required
          />

          <Box direction="row" gap="small" margin={{ top: "small" }}>
            <Button
              primary
              label="Save"
              onClick={handleSave}
              disabled={playlistTitle.length < 1}
            />
            <Button label="Cancel" onClick={() => setCreate(false)} />
          </Box>
        </form>
      </Box>
    </Layer>
  );
}
