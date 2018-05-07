package de.b4.justmusic.service;

import de.b4.justmusic.entity.*;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class PlaylistService {
  private final static Logger log = LoggerFactory.getLogger(PlaylistService.class);

  private static PlaylistService playlistService;

  private List<AbstractPlaylist> playlists;

  private PlaylistService() {}

  public static PlaylistService getPlaylistService() {
    if (playlistService == null) {
      playlistService = new PlaylistService();
    }
    return playlistService;
  }

  public PlaylistCollection getPlaylists() {
    PlaylistCollection playlistCollection = new PlaylistCollection();
    playlistCollection.setPlaylists(playlists);
    playlistCollection.setPaging(new AbstractCollection.Paging());
    playlistCollection.getPaging().setSize(playlists.size());
    return playlistCollection;
  }

  public AbstractPlaylist getPlaylistById(String id) {
    Optional<AbstractPlaylist> optionalAbstractPlaylist = playlists.stream().filter(p -> p.getPlaylistId().equals(id)).findFirst();
    return optionalAbstractPlaylist.isPresent() ? optionalAbstractPlaylist.get() : null;
  }

  public boolean loadPlaylists() {
    log.info("Loading playlists from " + ConfigService.getConfig().getPlaylistPath());
    playlists = new ArrayList<>();
    if (!loadDynamicPlaylists()) {
      return false;
    }
    if (!loadSimplePlaylists()) {
      return false;
    }
    playlists.forEach(p -> p.setPlaylistId(createHashForString(p.getFilename())));

    return true;
  }

  private boolean loadSimplePlaylists() {
    Path path = Paths.get(ConfigService.getConfig().getPlaylistPath());
    try {
      List<Path> playlistFiles = Files.list(path).filter(p -> p.toString().toLowerCase().endsWith(".m3u")).collect(Collectors.toList());
      for (Path p : playlistFiles) {
        SimplePlaylist playlist = readSimplePlaylist(p);
        if (playlist != null) {
          playlists.add(playlist);
        }
      }
    } catch (IOException e) {
      log.error("Could not list files in " + path.toString(), e);
    }
    return true;
  }

  private boolean loadDynamicPlaylists() {
    Path path = Paths.get(ConfigService.getConfig().getPlaylistPath());
    try {
      List<Path> playlistFiles = Files.list(path).filter(p -> p.toString().toLowerCase().endsWith(".js")).collect(Collectors.toList());
      for (Path p : playlistFiles) {
        DynamicPlaylist playlist = readDynamicPlaylist(p);
        if (playlist != null) {
          playlists.add(playlist);
        }
      }
    } catch (IOException e) {
      log.error("Could not list files in " + path.toString(), e);
    }
    return true;
  }

  private DynamicPlaylist readDynamicPlaylist(Path path) {
    try {
      DynamicPlaylist playlist = new DynamicPlaylist();
      playlist.setFilename(path.toString());
      String content = new String(Files.readAllBytes(path));
      playlist.setScript(content);
      return playlist;
    } catch (IOException e) {
      log.error("Error reading playlist " + path.toString(), e);
    }
    return null;
  }

  private SimplePlaylist readSimplePlaylist(Path path) {
    try {
      List<String> lines = Files.lines(path).collect(Collectors.toList());
      String name = FilenameUtils.removeExtension(path.getFileName().toString());
      SimplePlaylist playlist = new SimplePlaylist(name, path.toString());
      if (lines.size() > 0) {
        if (lines.get(0).equals("#EXTM3U")) {
          for (int i = 1; i < lines.size(); i += 2) {
            Song song = LibraryService.getLibraryService().findSongByPath(lines.get(i + 1));
            if (song != null) {
              playlist.addSong(song);
            }
          }
        }
        else {
          for (String line : lines) {
            Song song = LibraryService.getLibraryService().findSongByPath(line);
            if (song != null) {
              playlist.addSong(song);
            }
          }
        }
      }
      return playlist;
    } catch (IOException e) {
      log.error("Error reading playlist " + path.toString(), e);
    }
    return null;
  }

  private final String createHashForString(String s) {
    try {
      MessageDigest digest = MessageDigest.getInstance("MD5");
      digest.update(s.getBytes("UTF-8"));
      byte[] hash = digest.digest();
      StringBuilder sb = new StringBuilder();
      for(int i=0; i< hash.length ;i++)
      {
        sb.append(Integer.toString((hash[i] & 0xff) + 0x100, 16).substring(1));
      }
      //Get complete hashed password in hex format
      return sb.toString();
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return s;
  }

}
