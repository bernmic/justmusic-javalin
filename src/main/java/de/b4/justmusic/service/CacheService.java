package de.b4.justmusic.service;

import com.hazelcast.config.Config;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;
import de.b4.justmusic.entity.AbstractPlaylist;
import de.b4.justmusic.entity.Album;
import de.b4.justmusic.entity.Artist;
import de.b4.justmusic.entity.Song;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class CacheService {
  private final static Logger log = LoggerFactory.getLogger(CacheService.class);

  private final static String SONG_MAP = "justmusic-song";
  private final static String ALBUM_MAP = "justmusic-album";
  private final static String ARTIST_MAP = "justmusic-artist";
  private final static String PLAYLIST_MAP = "justmusic-playlist";

  private static HazelcastInstance hazelcastInstance;

  public static Map<String,Song> getSongMap() {
    if (hazelcastInstance == null) {
      initCacheService();
    }
    return hazelcastInstance.getMap(SONG_MAP);
  }

  public static Map<String,Album> getAlbumMap() {
    if (hazelcastInstance == null) {
      initCacheService();
    }
    return hazelcastInstance.getMap(ALBUM_MAP);
  }

  public static Map<String,Artist> getArtistMap() {
    if (hazelcastInstance == null) {
      initCacheService();
    }
    return hazelcastInstance.getMap(ARTIST_MAP);
  }

  public static Map<String,AbstractPlaylist> getPlaylistMap() {
    if (hazelcastInstance == null) {
      initCacheService();
    }
    return hazelcastInstance.getMap(PLAYLIST_MAP);
  }

  private CacheService() {}

  private static void initCacheService() {
    Config config = new Config();
    hazelcastInstance = Hazelcast.newHazelcastInstance(config);
  }
}
