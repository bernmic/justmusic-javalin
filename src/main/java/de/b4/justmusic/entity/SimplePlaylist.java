package de.b4.justmusic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

public class SimplePlaylist extends AbstractPlaylist {
  private List<Song> songs = new ArrayList<>();

  public SimplePlaylist() {
  }

  public SimplePlaylist(String name, String filename) {
    super(name, filename);
  }

  @Override
  @JsonIgnore
  public List<Song> getSongs() {
    return songs;
  }

  public void setSongs(List<Song> songs) {
    this.songs = songs;
  }

  @JsonIgnore
  public void addSong(Song song) {
    this.songs.add(song);
  }

  @JsonIgnore
  public boolean containsSong(AbstractPlaylist playlist, Song song) {
    Song found = songs.stream().filter(s -> s.getSongId().equals(song.getSongId())).findFirst().orElse(null);
    return found != null;
  }
}
