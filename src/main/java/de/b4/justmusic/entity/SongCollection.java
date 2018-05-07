package de.b4.justmusic.entity;

import java.util.List;

public class SongCollection extends AbstractCollection {
  private List<Song> songs;

  public List<Song> getSongs() {
    return songs;
  }

  public void setSongs(List<Song> songs) {
    this.songs = songs;
  }
}
