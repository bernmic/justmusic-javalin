package de.b4.justmusic.entity;

import java.util.List;

public class ArtistCollection extends AbstractCollection {
  private List<Artist> artists;

  public List<Artist> getArtists() {
    return artists;
  }

  public void setArtists(List<Artist> artists) {
    this.artists = artists;
  }
}
