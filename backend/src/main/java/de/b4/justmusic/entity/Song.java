package de.b4.justmusic.entity;

import java.io.Serializable;

public class Song implements Serializable {
  private String songId;
  private String title;
  private String path;
  private Integer duration;
  private Integer bitrate;
  private Integer sampleRate;
  private Integer track;
  private Album album;
  private Artist artist;
  private String genre;
  private long added;
  private String yearPublished;
  private boolean vbr;
  private Integer rating;
  private long filedate;

  public String getSongId() {
    return songId;
  }

  public void setSongId(String songId) {
    this.songId = songId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public Integer getDuration() {
    return duration;
  }

  public void setDuration(Integer duration) {
    this.duration = duration;
  }

  public Integer getBitrate() {
    return bitrate;
  }

  public void setBitrate(Integer bitrate) {
    this.bitrate = bitrate;
  }

  public Integer getSampleRate() {
    return sampleRate;
  }

  public void setSampleRate(Integer sampleRate) {
    this.sampleRate = sampleRate;
  }

  public Integer getTrack() {
    return track;
  }

  public void setTrack(Integer track) {
    this.track = track;
  }

  public Album getAlbum() {
    return album;
  }

  public void setAlbum(Album album) {
    this.album = album;
  }

  public Artist getArtist() {
    return artist;
  }

  public void setArtist(Artist artist) {
    this.artist = artist;
  }

  public String getGenre() {
    return genre;
  }

  public void setGenre(String genre) {
    this.genre = genre;
  }

  public long getAdded() {
    return added;
  }

  public void setAdded(long added) {
    this.added = added;
  }

  public String getYearPublished() {
    return yearPublished;
  }

  public void setYearPublished(String yearPublished) {
    this.yearPublished = yearPublished;
  }

  public boolean isVbr() {
    return vbr;
  }

  public void setVbr(boolean vbr) {
    this.vbr = vbr;
  }

  public Integer getRating() {
    return rating;
  }

  public void setRating(Integer rating) {
    this.rating = rating;
  }

  public long getFiledate() {
    return filedate;
  }

  public void setFiledate(long filedate) {
    this.filedate = filedate;
  }
}
