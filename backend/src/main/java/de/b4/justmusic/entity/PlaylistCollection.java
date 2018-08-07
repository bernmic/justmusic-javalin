package de.b4.justmusic.entity;

import java.util.List;

public class PlaylistCollection extends AbstractCollection {
  private List<AbstractPlaylist> playlists;

  public List<AbstractPlaylist> getPlaylists() {
    return playlists;
  }

  public void setPlaylists(List<AbstractPlaylist> playlists) {
    this.playlists = playlists;
  }
}
