package de.b4.justmusic.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;
import java.util.List;

public class Album implements Serializable {
  private String albumId;
  private String title;
  private String yearPublished;
  private String path;
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<Song> songs;

  public String getAlbumId() {
    return albumId;
  }

  public void setAlbumId(String albumId) {
    this.albumId = albumId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getYearPublished() {
    return yearPublished;
  }

  public void setYearPublished(String yearPublished) {
    this.yearPublished = yearPublished;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public List<Song> getSongs() {
    return songs;
  }

  public void setSongs(List<Song> songs) {
    this.songs = songs;
  }
}
