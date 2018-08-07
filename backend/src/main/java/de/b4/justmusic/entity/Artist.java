package de.b4.justmusic.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;
import java.util.List;

public class Artist implements Serializable {
  private String artistId;
  private String name;
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<Song> songs;

  public String getArtistId() {
    return artistId;
  }

  public void setArtistId(String artistId) {
    this.artistId = artistId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<Song> getSongs() {
    return songs;
  }

  public void setSongs(List<Song> songs) {
    this.songs = songs;
  }
}
