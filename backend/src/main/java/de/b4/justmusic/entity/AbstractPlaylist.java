package de.b4.justmusic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.stream.Collectors;

public abstract class AbstractPlaylist {
  private String name;
  private String filename;

  @JsonProperty("id")
  private String playlistId;

  public AbstractPlaylist() {
  }

  public AbstractPlaylist(String name, String filename) {
    this.name = name;
    this.filename = filename;
  }

  public String getPlaylistId() {
    return playlistId;
  }

  public void setPlaylistId(String playlistId) {
    this.playlistId = playlistId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @JsonIgnore
  public abstract List<Song> getSongs();

  @JsonIgnore
  public List<String> getSongIds() {
    return getSongs().stream().map(Song::getSongId).collect(Collectors.toList());
  }

  public String getFilename() {
    return filename;
  }

  public void setFilename(String filename) {
    this.filename = filename;
  }

  @Override
  public String toString() {
    return name;
  }
}
