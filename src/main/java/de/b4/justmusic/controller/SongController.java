package de.b4.justmusic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.b4.justmusic.entity.Cover;
import de.b4.justmusic.entity.Song;
import de.b4.justmusic.security.SecurityService;
import de.b4.justmusic.service.LibraryService;
import io.javalin.Handler;
import io.javalin.Javalin;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static io.javalin.ApiBuilder.*;

public class SongController {

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        //before("*", SecurityService.checkToken);
        path("song", () -> {
          get("", SongController.getAll);
          post("", SongController.createSong);
          put("", SongController.updateSong);
          get(":id", SongController.getById);
          get(":id/stream", SongController.stream);
          get(":id/cover", SongController.cover);
          delete(":id", SongController.deleteById);
        });
      });
    });
  }

  public static Handler getAll = ctx -> {
    ctx.json(LibraryService.getLibraryService().getSongs());
  };

  public static Handler getById = ctx -> {
    Song song = LibraryService.getLibraryService().getSongById(ctx.param("id"));
    if (song != null) {
      ctx.json(song);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler createSong = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    Song song = mapper.readValue(ctx.body(), Song.class);
    song = LibraryService.getLibraryService().createSong(song);
    ctx.status(201);
    ctx.json(song);
  };

  public static Handler updateSong = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    Song song = mapper.readValue(ctx.body(), Song.class);
    song = LibraryService.getLibraryService().updateSong(song);
    if (song != null) {
      ctx.status(200);
      ctx.json(song);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler deleteById = ctx -> {
    String id = ctx.param("id");
    ctx.status(LibraryService.getLibraryService().deleteSongById(id) ? 200 : 404);
  };

  public static Handler cover = ctx -> {
    String id = ctx.param("id");
    Song song = LibraryService.getLibraryService().getSongById(id);
    if (song == null) {
      ctx.status(404);
    }
    else {
      Cover cover = LibraryService.getLibraryService().getCoverForSong(song);
      ctx.contentType(cover.getMimetype());
      ctx.status(200);
      ctx.result(new ByteArrayInputStream(cover.getImage()));
    }
  };

  public static Handler stream = ctx -> {
    String id = ctx.param("id");
    Song song = LibraryService.getLibraryService().getSongById(id);
    if (song == null) {
      ctx.status(404);
    }
    else {
      ctx.contentType("audio/mpeg");
      ctx.status(200);
      ctx.result(new FileInputStream(song.getPath()));
    }
  };
}
