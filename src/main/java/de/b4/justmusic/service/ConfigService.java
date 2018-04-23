package de.b4.justmusic.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
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
      config.setLibraryFile((String) map.get("libraryFile"));
      log.info("Libraryfile: " + config.getLibraryFile());
      config.setMediaPath((String) map.get("mediaPath"));
      log.info("MediaPath: " + config.getMediaPath());
    }
    return config;
  }

  public static class Config {
    private String libraryFile;

    public String getLibraryFile() {
      return libraryFile;
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

    private String mediaPath;
  }
}
