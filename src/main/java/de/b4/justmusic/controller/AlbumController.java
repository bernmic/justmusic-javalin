package de.b4.justmusic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.b4.justmusic.entity.Album;
import de.b4.justmusic.entity.Cover;
import de.b4.justmusic.service.LibraryService;
import io.javalin.Handler;
import io.javalin.Javalin;

import java.io.ByteArrayInputStream;

import static io.javalin.ApiBuilder.*;

public class AlbumController {

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        //before("*", SecurityService.checkToken);
        path("album", () -> {
          get("", AlbumController.getAll);
          post("", AlbumController.createAlbum);
          put("", AlbumController.updateAlbum);
          get(":id", AlbumController.getById);
          get(":id/songs", AlbumController.getSongs);
          get(":id/cover", AlbumController.cover);
          delete(":id", AlbumController.deleteById);
        });
      });
    });
  }

  public static Handler getAll = ctx -> {
    ctx.json(LibraryService.getLibraryService().getAlbums());
  };

  public static Handler getById = ctx -> {
    Album album = LibraryService.getLibraryService().getAlbumById(ctx.param("id"));
    if (album != null) {
      ctx.json(album);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler createAlbum = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    Album album = mapper.readValue(ctx.body(), Album.class);
    album = LibraryService.getLibraryService().createAlbum(album);
    ctx.status(201);
    ctx.json(album);
  };

  public static Handler updateAlbum = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    Album album = mapper.readValue(ctx.body(), Album.class);
    album = LibraryService.getLibraryService().updateAlbum(album);
    if (album != null) {
      ctx.status(200);
      ctx.json(album);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler deleteById = ctx -> {
    String id = ctx.param("id");
    ctx.status(LibraryService.getLibraryService().deleteAlbumById(id) ? 200 : 404);
  };

  public static Handler getSongs = ctx -> {
    String id = ctx.param("id");
    ctx.json(LibraryService.getLibraryService().getSongsForAlbum(id));
  };

  public static Handler cover = ctx -> {
    String id = ctx.param("id");
    Album album = LibraryService.getLibraryService().getAlbumById(id);
    if (album == null) {
      ctx.status(404);
    }
    else {
      Cover cover = LibraryService.getLibraryService().getCoverForAlbum(album);
      ctx.contentType(cover.getMimetype());
      ctx.status(200);
      ctx.result(new ByteArrayInputStream(cover.getImage()));
    }
  };
}
