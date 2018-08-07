package de.b4.justmusic.service;

import de.b4.justmusic.entity.*;

import java.util.Collection;

public interface LibraryService {
  void loadLibrary();

  void saveLibrary();

  /*
    SONG
     */
  SongCollection getSongs(AbstractCollection.Paging paging);

  Collection<Song> getSongs();

  Song getSongById(String id);

  Song createSong(Song song);

  Song updateSong(Song song);

  boolean deleteSongById(String id);

  Song findSongByPath(String path);

  SearchResult search(String query);

  /*
    ALBUM
     */
  AlbumCollection getAlbums(AbstractCollection.Paging paging);

  Album getAlbumById(String id);

  Album createAlbum(Album album);

  Album updateAlbum(Album album);

  boolean deleteAlbumById(String id);

  SongCollection getSongsForAlbum(String id, AbstractCollection.Paging paging);

  /*
    ARTIST
     */
  ArtistCollection getArtists(AbstractCollection.Paging paging);

  Artist getArtistById(String id);

  Artist createArtist(Artist artist);

  Artist updateArtist(Artist artist);

  boolean deleteArtistById(String id);

  SongCollection getSongsForArtist(String id, AbstractCollection.Paging paging);

  boolean scanMedia();

  Cover getCoverForSong(Song song);

  Cover getCoverForAlbum(Album album);
}
