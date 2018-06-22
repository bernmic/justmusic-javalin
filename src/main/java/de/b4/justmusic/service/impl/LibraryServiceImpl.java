package de.b4.justmusic.service.impl;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mpatric.mp3agic.*;
import de.b4.justmusic.entity.AbstractCollection;
import de.b4.justmusic.entity.*;
import de.b4.justmusic.service.CacheService;
import de.b4.justmusic.service.ConfigService;
import de.b4.justmusic.service.LibraryService;
import de.b4.justmusic.service.ServiceRegistry;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

public class LibraryServiceImpl implements LibraryService {
  private final static Logger log = LoggerFactory.getLogger(LibraryServiceImpl.class);

  private Cover DEFAULT_ALBUM_COVER;

  private LibraryServiceImpl() {}

  public static LibraryService create() {
    return new LibraryServiceImpl();
  }

  @Override
  public void loadLibrary() {
    File file = new File(ConfigService.getConfig().getLibraryFile());
    if (file.exists()) {
      ObjectMapper mapper = new ObjectMapper();
      try {
        Library library = mapper.readValue(file, Library.class);
        CacheService.getSongMap().clear();
        if (library.getSongs() != null) {
          library.getSongs().forEach(song -> {
            CacheService.getSongMap().put(song.getSongId(), song);
            if (song.getAlbum() != null) {
              CacheService.getAlbumMap().putIfAbsent(song.getAlbum().getAlbumId(), song.getAlbum());
            }
            if (song.getArtist() != null) {
              CacheService.getArtistMap().putIfAbsent(song.getArtist().getArtistId(), song.getArtist());
            }
          });
        }
        log.info(String.format("Loaded %d songs from library file.", CacheService.getSongMap().size()));
      } catch (IOException e) {
        log.error("Could not load library from " + ConfigService.getConfig().getHomePath(), e);
      }
    }
  }

  @Override
  public void saveLibrary() {
    log.info("Save library to " + ConfigService.getConfig().getLibraryFile());

    Library library = new Library();
    library.setSongs(CacheService.getSongMap().values());

    File file = new File(ConfigService.getConfig().getLibraryFile());
    ObjectMapper mapper = new ObjectMapper();
    try {
      mapper.writerWithDefaultPrettyPrinter().writeValue(file, library);
    } catch (IOException e) {
      log.error("Error saving library", e);
    }
  }

  /*
  SONG
   */
  @Override
  public SongCollection getSongs(AbstractCollection.Paging paging) {
    SongCollection songCollection = new SongCollection();
    songCollection.setPaging(paging);
    Collection<Song> songs = CacheService.getSongMap().values();
    songCollection.setSongs(createSongCollection(songs, paging));
    return songCollection;
  }

  @Override
  public Collection<Song> getSongs() {
    return CacheService.getSongMap().values();
  }

  @Override
  public Song getSongById(String id) {
    return CacheService.getSongMap().get(id);
  }

  @Override
  public Song createSong(Song song) {
    song.setSongId(createHashForString(song.getPath()));
    return CacheService.getSongMap().putIfAbsent(song.getSongId(), song);
  }

  @Override
  public Song updateSong(Song song) {
    Song librarySong = CacheService.getSongMap().get(song.getSongId());
    if (librarySong == null) {
      return null;
    }
    CacheService.getSongMap().put(song.getSongId(), song);
    return song;
  }

  @Override
  public boolean deleteSongById(String id) {
    Song song =  CacheService.getSongMap().get(id);
    if (song != null) {
      CacheService.getSongMap().remove(song);
      return true;
    }
    return false;
  }

  @Override
  public Song findSongByPath(String path) {
    Optional<Song> optionalSong = CacheService.getSongMap().values().parallelStream().filter(s -> s.getPath().equals(path)).findFirst();
    if (optionalSong.isPresent()) {
      return optionalSong.get();
    }
    return null;
  }

  @Override
  public SearchResult search(String query) {
    SearchResult searchResult = new SearchResult();
    searchResult.setQuery(query);
    searchResult.setSongs(CacheService.getSongMap().values().parallelStream().filter(s -> s.getTitle().toLowerCase().contains(query.toLowerCase())).limit(100).collect(Collectors.toList()));
    searchResult.setAlbums(CacheService.getAlbumMap().values().parallelStream().filter(a -> a.getTitle().toLowerCase().contains(query.toLowerCase())).collect(Collectors.toList()));
    searchResult.setArtists(CacheService.getArtistMap().values().parallelStream().filter(a -> a.getName().toLowerCase().contains(query.toLowerCase())).collect(Collectors.toList()));
    if (searchResult.getSongs().size() == 100) {
      searchResult.setLimited(true);
    }
    return searchResult;
  }

  /*
  ALBUM
   */
  @Override
  public AlbumCollection getAlbums(AbstractCollection.Paging paging) {
    AlbumCollection albumCollection = new AlbumCollection();
    albumCollection.setPaging(paging);
    Collection<Album> albums = CacheService.getAlbumMap().values();
    albumCollection.setAlbums(createAlbumCollection(albums, paging));
    return albumCollection;
  }

  @Override
  public Album getAlbumById(String id) {
    return CacheService.getAlbumMap().get(id);
  }

  @Override
  public Album createAlbum(Album album) {
    album.setAlbumId(createHashForString(album.getPath()));
    return CacheService.getAlbumMap().putIfAbsent(album.getAlbumId(), album);
  }

  @Override
  public Album updateAlbum(Album album) {
    Album libraryAlbum = CacheService.getAlbumMap().get(album.getAlbumId());
    if (libraryAlbum == null) {
      return null;
    }
    CacheService.getAlbumMap().put(album.getAlbumId(), album);
    return album;
  }

  @Override
  public boolean deleteAlbumById(String id) {
    Album album =  CacheService.getAlbumMap().get(id);
    if (album != null) {
      CacheService.getAlbumMap().remove(album);
      return true;
    }
    return false;
  }

  @Override
  public SongCollection getSongsForAlbum(String id, AbstractCollection.Paging paging) {
    SongCollection songCollection = new SongCollection();
    songCollection.setPaging(paging);
    List<Song> songs = CacheService.getSongMap().values().stream().filter(s -> s.getAlbum() != null && id.equals(s.getAlbum().getAlbumId())).collect(Collectors.toList());
    songCollection.setSongs(createSongCollection(songs, paging));
    return songCollection;
  }

  /*
  ARTIST
   */
  @Override
  public ArtistCollection getArtists(AbstractCollection.Paging paging) {
    ArtistCollection artistCollection = new ArtistCollection();
    artistCollection.setPaging(paging);
    Collection<Artist> artists = CacheService.getArtistMap().values();
    artistCollection.setArtists(createArtistCollection(artists, paging));
    return artistCollection;
  }

  @Override
  public Artist getArtistById(String id) {
    return CacheService.getArtistMap().get(id);
  }

  @Override
  public Artist createArtist(Artist artist) {
    artist.setArtistId(createHashForString(artist.getName()));
    return CacheService.getArtistMap().putIfAbsent(artist.getArtistId(), artist);
  }

  @Override
  public Artist updateArtist(Artist artist) {
    Artist libraryArtist = CacheService.getArtistMap().get(artist.getArtistId());
    if (libraryArtist == null) {
      return null;
    }
    CacheService.getArtistMap().put(artist.getArtistId(), artist);
    return artist;
  }

  @Override
  public boolean deleteArtistById(String id) {
    Artist artist =  CacheService.getArtistMap().get(id);
    if (artist != null) {
      CacheService.getArtistMap().remove(artist);
      return true;
    }
    return false;
  }

  @Override
  public SongCollection getSongsForArtist(String id, AbstractCollection.Paging paging) {
    SongCollection songCollection = new SongCollection();
    songCollection.setPaging(paging);
    List<Song> songs = CacheService.getSongMap().values().stream().filter(s -> s.getArtist() != null && id.equals(s.getArtist().getArtistId())).collect(Collectors.toList());
    songCollection.setSongs(createSongCollection(songs, paging));
    return songCollection;
  }

  @Override
  public boolean scanMedia() {
    ConfigService.Config config = ConfigService.getConfig();

    Set<String> allSongsPath = new HashSet<>();
    List<Path> mediaPaths = new ArrayList<>();
    mediaPaths.add(Paths.get(config.getMediaPath()));
    //-------------------------------------------
    log.info(String.format("Update library - Phase 1 - Scanning all files."));
    long millis = System.currentTimeMillis();
    for (Path mediaPath : mediaPaths) {
      try {
        SongFileVisitor songFileVisitor = new SongFileVisitor();
        Files.walkFileTree(mediaPath, songFileVisitor);
        allSongsPath.addAll(songFileVisitor.getNewSongFiles());
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    log.info(String.format("Found %d mp3 in %d seconds.", allSongsPath.size(), (System.currentTimeMillis() - millis) / 1000));
    millis = System.currentTimeMillis();

    //-------------------------------------------
    log.info(String.format("Update library - Phase 2 - Filter new files."));
    Set<String> existingsSongsPath = ServiceRegistry.getLibraryService().getSongs(new AbstractCollection.Paging()).getSongs().stream().map(s -> s.getPath()).collect(Collectors.toSet());

    Set<String> toAddSongsPath = findNotInSet(existingsSongsPath, allSongsPath);
    log.info(String.format("Found %d songs to add in %d seconds.", toAddSongsPath.size(), (System.currentTimeMillis() - millis) / 1000));
    millis = System.currentTimeMillis();

    //-------------------------------------------
    log.info(String.format("Update library - Phase 3 - add files to library."));
    toAddSongsPath.forEach(s -> {
      try {
        Song song = createSongFromFile(s);
        song.setSongId(createHashForString(song.getPath()));
        CacheService.getSongMap().put(song.getSongId(), song);
      } catch (Exception e) {
        log.warn("could not save song: " + s, e);
      }
    });
    log.info(String.format("Added %d new songs in %d seconds.", toAddSongsPath.size(), (System.currentTimeMillis() - millis) / 1000));
    millis = System.currentTimeMillis();

    //-------------------------------------------
    log.info(String.format("Update library - Phase 4 - Filter songs without existing file."));
    millis = System.currentTimeMillis();
    Set<String> removedSongFiles = findNotInSet(allSongsPath, existingsSongsPath);
    log.info(String.format("Found %d removed songs in %d seconds.", removedSongFiles.size(), (System.currentTimeMillis() - millis) / 1000));
    millis = System.currentTimeMillis();

    //-------------------------------------------
    log.info(String.format("Update library - Phase 5 - Remove songs without existing file."));
    removedSongFiles.forEach(s -> {
      Optional<Song> optionalSong = CacheService.getSongMap().values().stream().filter(song -> song.getPath().equals(s)).findFirst();
      if (optionalSong.isPresent()) {
        CacheService.getSongMap().remove(optionalSong.get().getSongId());
      }
    });
    log.info(String.format("Removed %d songs in %d seconds.", removedSongFiles.size(), (System.currentTimeMillis() - millis) / 1000));
    saveLibrary();
    return true;
  }

  private Set<String> findNotInSet(Set<String> main, Set<String> search) {
    Set<String> diff = new HashSet<>();
    search.forEach(s -> {
      if (!main.contains(s)) {
        diff.add(s);
      }
    });

    return diff;
  }

  private Song createSongFromFile(String path) {
    Song song = new Song();
    song.setPath(path);
    try {
      Mp3File mp3File = new Mp3File(path, true);
      song.setAdded(System.currentTimeMillis());
      song.setDuration((int) mp3File.getLengthInSeconds());
      song.setBitrate(mp3File.getBitrate());
      song.setSampleRate(mp3File.getSampleRate());
      song.setVbr(mp3File.isVbr());
      song.setFiledate(mp3File.getLastModified());
      song.setRating(-1);
      if (mp3File.hasId3v2Tag()) {
        song.setTitle(mp3File.getId3v2Tag().getTitle());
        song.setYearPublished(mp3File.getId3v2Tag().getYear());
        song.setArtist(createArtist(mp3File.getId3v2Tag().getArtist()));
        song.setAlbum(createAlbum(mp3File.getId3v2Tag().getAlbum(), path, song.getYearPublished()));
        song.setGenre(mp3File.getId3v2Tag().getGenreDescription());
        song.setYearPublished(mp3File.getId3v2Tag().getYear());
        song.setTrack(extractTrack(mp3File.getId3v2Tag().getTrack()));
        if (mp3File.getId3v2Tag().getFrameSets().get("POPM") != null) {
          ID3v2FrameSet fs = mp3File.getId3v2Tag().getFrameSets().get("POPM");
          ID3v2Frame f = fs.getFrames().stream().findFirst().get();
          byte[] data = f.getData();
          for (int pos = 0; pos < f.getDataLength() - 1; pos++) {
            if (data[pos] == 0) {
              int r = (data[pos + 1] & 0xFF);
              song.setRating(r);
              break;
            }
          }
        }
      } else if (mp3File.hasId3v1Tag()) {
        song.setTitle(mp3File.getId3v1Tag().getTitle());
        song.setYearPublished(mp3File.getId3v1Tag().getYear());
        song.setAlbum(createAlbum(mp3File.getId3v1Tag().getAlbum(), path, song.getYearPublished()));
        song.setArtist(createArtist(mp3File.getId3v1Tag().getArtist()));
        song.setGenre(mp3File.getId3v1Tag().getGenreDescription());
        song.setTrack(extractTrack(mp3File.getId3v1Tag().getTrack()));
      }
    } catch (Exception e) {
      log.warn("Error reading id3 in file " + path, e);
      song.setTitle(Paths.get(path).getFileName().toString());
    }
    return song;
  }

  private int extractTrack(String trackString) {
    if (trackString != null) {
      String[] track = trackString.split("(/|-)");
      if (track.length > 0 && track[0].length() > 0) {
        try {
          return Integer.parseInt(track[0]);
        } catch (NumberFormatException e) {
          log.warn(String.format("Error extracting track %s", trackString), e);
        }
      }
    }
    return 0;
  }

  private Album createAlbum(String title, String path, String yearPublished) {
    if (title == null) {
      return null;
    }
    String albumPath = Paths.get(path).getParent().toString();
    Optional<Album> optionalAlbum = CacheService.getAlbumMap().values().stream().filter( a -> a.getPath().equals(path)).findFirst();
    if (!optionalAlbum.isPresent()) {
      Album album = new Album();
      album.setTitle(title);
      album.setPath(albumPath);
      album.setYearPublished(yearPublished);
      album.setAlbumId(createHashForString(album.getPath()));
      CacheService.getAlbumMap().put(album.getAlbumId(), album);
      return album;
    }
    return optionalAlbum.get();
  }

  private Artist createArtist(String name) {
    if (name == null) {
      return null;
    }
    Optional<Artist> optionalArtist = CacheService.getArtistMap().values().stream().filter(a -> a.getName().equals(name)).findFirst();
    if (!optionalArtist.isPresent()) {
      Artist artist = new Artist();
      artist.setName(name);
      artist.setArtistId(createHashForString(name));
      CacheService.getArtistMap().put(artist.getArtistId(), artist);
      return artist;
    }
    return optionalArtist.get();
  }

  protected final String createHashForString(String s) {
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

  private class SongFileVisitor extends SimpleFileVisitor<Path> {

    private Set<String> newSongFiles = new HashSet<>();

    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
      if (!attrs.isDirectory() && file.toString().toLowerCase().endsWith(".mp3")) {
        newSongFiles.add(file.toString());
      }
      return FileVisitResult.CONTINUE;
    }

    public Set<String> getNewSongFiles() {
      return newSongFiles;
    }
  }

  @Override
  public Cover getCoverForSong(Song song) {
    try {
      Mp3File mp3File = new Mp3File(song.getPath());
      if (mp3File.hasId3v2Tag()) {
        byte[] image = mp3File.getId3v2Tag().getAlbumImage();
        String mimetype = mp3File.getId3v2Tag().getAlbumImageMimeType();
        if (image != null && mimetype != null) {
          return new Cover(mimetype, image);
        }
      }
      String nativeDir = song.getPath().substring(0, song.getPath().lastIndexOf(File.separator));
      List<Path> paths = Files.find(Paths.get(nativeDir), 1, (p, attr) -> {
        String filename = p.getFileName().toString().toLowerCase();
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".gif")) {
          return true;
        }
        return false;
      }).collect(Collectors.toList());
      Path coverPath = null;
      for (Path path : paths) {
        String filename = path.getFileName().toString().toLowerCase();
        if (filename.contains("cover") || filename.contains("front") || filename.contains("album") || filename.contains("folder")) {
          coverPath = path;
          break;
        }
      }
      if (coverPath == null && paths.size() > 0) {
        coverPath = paths.get(0);
      }
      if (coverPath != null) {
        byte[] imageData = Files.readAllBytes(coverPath);
        String mimetype;
        String filename = coverPath.getFileName().toString().toLowerCase();
        if (filename.endsWith(".gif")) {
          return new Cover("image/gif", imageData);
        }
        if (filename.endsWith(".png")) {
          return new Cover("image/png", imageData);
        }
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
          return new Cover("image/jpeg", imageData);
        }
      }
    } catch (IOException e) {
      log.error("Error getting cover for " + song.getPath(), e);
    } catch (UnsupportedTagException e) {
      log.info("Unsupport ID3 tag in " + song.getPath(), e);
    } catch (InvalidDataException e) {
      log.info("No cover for " + song.getPath(), e);
    }
    return getDefaultCover();
  }
  @Override
  public Cover getCoverForAlbum(Album album) {
    Optional<Song> optionalSong = CacheService.getSongMap().values().parallelStream()
            .filter(song -> song.getAlbum() != null && album.getAlbumId().equals(song.getAlbum().getAlbumId()))
            .findAny();
      if (!optionalSong.isPresent()) {
      return getDefaultCover();
    }
    return getCoverForSong(optionalSong.get());
  }

  private Cover getDefaultCover() {
    if (DEFAULT_ALBUM_COVER == null) {
      byte[] imageData = new byte[0];
      try {
        imageData = IOUtils.toByteArray(this.getClass().getResourceAsStream("/defaultAlbum.png"));
      } catch (IOException e) {
        log.error("Default album image not found!", e);
      }
      DEFAULT_ALBUM_COVER = new Cover("image/png", imageData);
    }
    return DEFAULT_ALBUM_COVER;
  }

  @JsonInclude(JsonInclude.Include.NON_NULL)
  public static class Library {
    private Collection<Song> songs;

    public Collection<Song> getSongs() {
      return songs;
    }

    public void setSongs(Collection<Song> songs) {
      this.songs = songs;
    }
  }

  private List<Song> createSongCollection(Collection<Song> songs, AbstractCollection.Paging paging) {
    List<Song> songList = new ArrayList<>(songs);
    if (paging.getSort() != null) {
        boolean desc = paging.getDirection() != null && "asc".equalsIgnoreCase(paging.getDirection());
        if (paging.getSort().equals("title")) {
          Collections.sort(songList, (s1, s2) ->
                  desc ? s2.getTitle().compareTo(s1.getTitle()) : s1.getTitle().compareTo(s2.getTitle()));
        }
        else if (paging.getSort().equals("album")) {
          Collections.sort(songList, (s1, s2) -> {
            String a1 = s1.getAlbum() == null ? "" : s1.getAlbum().getTitle();
            String a2 = s2.getAlbum() == null ? "" : s2.getAlbum().getTitle();
            return desc ? a2.compareTo(a1) : a1.compareTo(a2);
          });
        }
        else if (paging.getSort().equals("artist")) {
          Collections.sort(songList, (s1, s2) -> {
            String a1 = s1.getArtist() == null ? "" : s1.getArtist().getName();
            String a2 = s2.getArtist() == null ? "" : s2.getArtist().getName();
            return desc ? a2.compareTo(a1) : a1.compareTo(a2);
          });
        }
        else if (paging.getSort().equals("duration")) {
          Collections.sort(songList, (s1, s2) ->
                  desc ? s2.getDuration() - s1.getDuration() : s1.getDuration() - s2.getDuration());
        }
        else if (paging.getSort().equals("track")) {
          Collections.sort(songList, (s1, s2) ->
                  desc ? s2.getTrack() - s1.getTrack() : s1.getTrack() - s2.getTrack());
        }
        else if (paging.getSort().equals("genre")) {
          Collections.sort(songList, (s1, s2) ->
                  desc ? s2.getGenre().compareTo(s1.getGenre()) : s1.getGenre().compareTo(s2.getGenre()));
        }
        else if (paging.getSort().equals("yearPublished")) {
          Collections.sort(songList, (s1, s2) ->
                  desc ? s2.getYearPublished().compareTo(s1.getYearPublished()) : s1.getYearPublished().compareTo(s2.getYearPublished()));
        }
    }
    paging.setSize(Math.min(paging.getSize(), songs.size()));
    int start = Math.min((paging.getPage() - 1) * paging.getSize(), songs.size() - 1);
    int end = Math.min(paging.getSize() * paging.getPage(), songs.size());
    return songList.subList(start, end);
  }

  private List<Album> createAlbumCollection(Collection<Album> albums, AbstractCollection.Paging paging) {
    List<Album> albumList = new ArrayList<>(albums);
    if (paging.getSort() != null) {
      boolean desc = paging.getDirection() != null && "asc".equalsIgnoreCase(paging.getDirection());
      if (paging.getSort().equals("title")) {
        Collections.sort(albumList, (s1, s2) ->
                desc ? s2.getTitle().compareTo(s1.getTitle()) : s1.getTitle().compareTo(s2.getTitle()));
      }
      else if (paging.getSort().equals("yearPublished")) {
        Collections.sort(albumList, (s1, s2) ->
                desc ? s2.getYearPublished().compareTo(s1.getYearPublished()) : s1.getYearPublished().compareTo(s2.getYearPublished()));
      }
    }
    paging.setSize(Math.min(paging.getSize(), albumList.size()));
    int start = Math.min((paging.getPage() - 1) * paging.getSize(), albumList.size() - 1);
    int end = Math.min(paging.getSize() * paging.getPage(), albumList.size());
    return albumList.subList(start, end);
  }

  private List<Artist> createArtistCollection(Collection<Artist> artists, AbstractCollection.Paging paging) {
    List<Artist> artistList = new ArrayList<>(artists);
    if (paging.getSort() != null) {
      boolean desc = paging.getDirection() != null && "asc".equalsIgnoreCase(paging.getDirection());
      if (paging.getSort().equals("name")) {
        Collections.sort(artistList, (s1, s2) ->
                desc ? s2.getName().compareTo(s1.getName()) : s1.getName().compareTo(s2.getName()));
      }
    }
    paging.setSize(Math.min(paging.getSize(), artistList.size()));
    int start = Math.min((paging.getPage() - 1) * paging.getSize(), artistList.size() - 1);
    int end = Math.min(paging.getSize() * paging.getPage(), artistList.size());
    return artistList.subList(start, end);
  }
}
