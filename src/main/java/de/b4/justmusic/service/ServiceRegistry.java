package de.b4.justmusic.service;

import de.b4.justmusic.service.impl.LibraryServiceImpl;

public class ServiceRegistry {
  private static LibraryService libraryService;
  private static PlaylistService playlistService;
  private static UserService userService;


  public static LibraryService getLibraryService() {
    if (libraryService == null)
      libraryService = LibraryServiceImpl.create();
    return libraryService;
  }

  public static PlaylistService getPlaylistService() {
    if (playlistService == null)
      playlistService = new PlaylistService();
    return playlistService;
  }

  public static UserService getUserService() {
    if (userService == null) {
      userService = new UserService();
    }
    return userService;
  }
}
