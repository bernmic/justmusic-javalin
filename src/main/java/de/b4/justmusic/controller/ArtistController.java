package de.b4.justmusic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.b4.justmusic.entity.Artist;
import de.b4.justmusic.service.LibraryService;
import io.javalin.Handler;
import io.javalin.Javalin;

import static io.javalin.ApiBuilder.*;

public class ArtistController {

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        //before("*", SecurityService.checkToken);
        path("artist", () -> {
          get("", ArtistController.getAll);
          post("", ArtistController.createArtist);
          put("", ArtistController.updateArtist);
          get(":id", ArtistController.getById);
          get(":id/songs", ArtistController.getSongs);
          delete(":id", ArtistController.deleteById);
        });
      });
    });
  }

  public static Handler getAll = ctx -> {
    ctx.json(LibraryService.getLibraryService().getArtists());
  };

  public static Handler getById = ctx -> {
    Artist artist = LibraryService.getLibraryService().getArtistById(ctx.param("id"));
    if (artist != null) {
      ctx.json(artist);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler createArtist = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    Artist artist = mapper.readValue(ctx.body(), Artist.class);
    artist = LibraryService.getLibraryService().createArtist(artist);
    ctx.status(201);
    ctx.json(artist);
  };

  public static Handler updateArtist = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    Artist artist = mapper.readValue(ctx.body(), Artist.class);
    artist = LibraryService.getLibraryService().updateArtist(artist);
    if (artist != null) {
      ctx.status(200);
      ctx.json(artist);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler deleteById = ctx -> {
    String id = ctx.param("id");
    ctx.status(LibraryService.getLibraryService().deleteArtistById(id) ? 200 : 404);
  };

  public static Handler getSongs = ctx -> {
    String id = ctx.param("id");
    ctx.json(LibraryService.getLibraryService().getSongsForArtist(id));
  };
}
