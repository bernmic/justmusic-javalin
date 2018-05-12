package de.b4.justmusic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class User implements Serializable {
  private String username;
  private String password;
  private String roles;

  private String theme;

  @JsonIgnore
  private List<Song> playQueue;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getRoles() {
    return roles;
  }

  public void setRoles(String roles) {
    this.roles = roles;
  }

  public String getTheme() {
    return theme;
  }

  public void setTheme(String theme) {
    this.theme = theme;
  }

  public List<Song> getPlayQueue() {
    return playQueue;
  }

  public void setPlayQueue(List<Song> playQueue) {
    this.playQueue = playQueue;
  }
}
