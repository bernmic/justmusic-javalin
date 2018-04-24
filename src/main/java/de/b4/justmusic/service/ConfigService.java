package de.b4.justmusic.service;

import org.apache.commons.text.StringSubstitutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

public class ConfigService {
  private final static Logger log = LoggerFactory.getLogger(ConfigService.class);

  private final static String CONFIG_FILE = "justmusic.yaml";

  private static Config config;

  private ConfigService() {}

  public static Config getConfig() {
    // load config from:
    // 1. system parameter -Dconfig=...
    // 2. current path
    // 3. classpath
    if (config == null) {
      Yaml yaml = new Yaml();
      Map<String,Object> map;
      try {
        map = yaml.load(new FileInputStream(System.getProperty("config", CONFIG_FILE)));
        log.info("Get configuration from " + System.getProperty("config", CONFIG_FILE));
      } catch (FileNotFoundException e) {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        map = yaml.load(classLoader.getResourceAsStream(CONFIG_FILE));
        log.info("Get configuration from classpath");
      }
      config = new Config();
      String homePath = (String) map.get("homePath");
      homePath = StringSubstitutor.replaceSystemProperties(homePath);
      config.setHomePath(homePath);
      log.info("HomePath: " + config.getHomePath());
      String mediaPath = (String) map.get("mediaPath");
      mediaPath = StringSubstitutor.replaceSystemProperties(mediaPath);
      config.setMediaPath(mediaPath);
      log.info("MediaPath: " + config.getMediaPath());

      Path path = Paths.get(config.getHomePath());
      if (!Files.exists(path)) {
        try {
          Files.createDirectories(path);
        } catch (IOException e) {
          log.error("Error creating home dir " + config.getHomePath(), e);
        }
      }

      path = Paths.get(config.getPlaylistPath());
      if (!Files.exists(path)) {
        try {
          Files.createDirectories(path);
        } catch (IOException e) {
          log.error("Error creating playlist dir " + config.getPlaylistPath(), e);
        }
      }
    }
    return config;
  }

  public static class Config {
    private String homePath;
    private String mediaPath;
    private String libraryFile;
    private String playlistPath;

    public String getHomePath() {
      return homePath;
    }

    public void setHomePath(String homePath) {
      this.homePath = homePath;
    }

    public String getLibraryFile() {
      return libraryFile == null ? homePath + "/justmusic.json" : libraryFile;
    }

    public void setLibraryFile(String libraryFile) {
      this.libraryFile = libraryFile;
    }

    public String getMediaPath() {
      return mediaPath;
    }

    public void setMediaPath(String mediaPath) {
      this.mediaPath = mediaPath;
    }

    public String getPlaylistPath() {
      return playlistPath == null ? homePath + "/playlists" : playlistPath;
    }

    public void setPlaylistPath(String playlistPath) {
      this.playlistPath = playlistPath;
    }
  }
}
