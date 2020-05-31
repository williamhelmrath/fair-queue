import React from "react";
import { Layer, Box, TextInput, Button } from "grommet";

export default function CreatePlaylistForm({
  setPlaylistTitle,
  playlistTitle,
  spotifyApi,
  userId,
  setActiveStep,
}) {
  const handleSave = () => {
    spotifyApi.createPlaylist(userId, {
      name: playlistTitle,
      public: true,
    });
    setActiveStep(2);
  };

  return (
    <Layer margin="small">
      <form onSubmit={handleSave}>
        <Box gap="small" margin="medium" width="40vw">
          <TextInput
            placeholder="Title"
            value={playlistTitle}
            onChange={(event) => setPlaylistTitle(event.target.value)}
            required
          />

          <Button
            primary
            label="Save"
            onClick={handleSave}
            disabled={playlistTitle.length < 1}
          />
        </Box>
      </form>
    </Layer>
  );
}
