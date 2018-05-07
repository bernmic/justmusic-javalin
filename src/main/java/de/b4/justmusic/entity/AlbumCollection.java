package de.b4.justmusic.entity;

import java.util.List;

public class AlbumCollection extends AbstractCollection {
  private List<Album> albums;

  public List<Album> getAlbums() {
    return albums;
  }

  public void setAlbums(List<Album> albums) {
    this.albums = albums;
  }
}
