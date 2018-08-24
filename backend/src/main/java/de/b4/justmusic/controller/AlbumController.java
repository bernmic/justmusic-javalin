package de.b4.justmusic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.b4.justmusic.entity.AbstractCollection;
import de.b4.justmusic.entity.Album;
import de.b4.justmusic.entity.Cover;
import de.b4.justmusic.security.SecurityService;
import de.b4.justmusic.service.ServiceRegistry;
import io.javalin.Handler;
import io.javalin.Javalin;

import java.io.ByteArrayInputStream;

import static io.javalin.apibuilder.ApiBuilder.*;

public class AlbumController extends AbstractController {

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        before("*", SecurityService.checkToken);
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
    AbstractCollection.Paging paging = createPagingObject(ctx.queryParamMap());
    if (paging.getSort() == null) {
      paging.setSort("title");
    }
    ctx.json(ServiceRegistry.getLibraryService().getAlbums(paging));
  };

  public static Handler getById = ctx -> {
    Album album = ServiceRegistry.getLibraryService().getAlbumById(ctx.pathParam("id"));
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
    album = ServiceRegistry.getLibraryService().createAlbum(album);
    ctx.status(201);
    ctx.json(album);
  };

  public static Handler updateAlbum = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    Album album = mapper.readValue(ctx.body(), Album.class);
    album = ServiceRegistry.getLibraryService().updateAlbum(album);
    if (album != null) {
      ctx.status(200);
      ctx.json(album);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler deleteById = ctx -> {
    String id = ctx.pathParam("id");
    ctx.status(ServiceRegistry.getLibraryService().deleteAlbumById(id) ? 200 : 404);
  };

  public static Handler getSongs = ctx -> {
    String id = ctx.pathParam("id");
    AbstractCollection.Paging paging = createPagingObject(ctx.queryParamMap());
    if (paging.getSort() == null) {
      paging.setSort("track");
    }

    ctx.json(ServiceRegistry.getLibraryService().getSongsForAlbum(id, paging));
  };

  public static Handler cover = ctx -> {
    String id = ctx.pathParam("id");
    Album album = ServiceRegistry.getLibraryService().getAlbumById(id);
    if (album == null) {
      ctx.status(404);
    }
    else {
      Cover cover = ServiceRegistry.getLibraryService().getCoverForAlbum(album);
      ctx.contentType(cover.getMimetype());
      ctx.status(200);
      ctx.result(new ByteArrayInputStream(cover.getImage()));
    }
  };
}
