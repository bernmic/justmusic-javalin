package de.b4.justmusic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.b4.justmusic.entity.AbstractCollection;
import de.b4.justmusic.entity.Artist;
import de.b4.justmusic.service.ServiceRegistry;
import io.javalin.Handler;
import io.javalin.Javalin;

import static io.javalin.apibuilder.ApiBuilder.*;

public class ArtistController extends AbstractController {

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
    AbstractCollection.Paging paging = createPagingObject(ctx.queryParamMap());
    if (paging.getSort() == null) {
      paging.setSort("name");
    }
    ctx.json(ServiceRegistry.getLibraryService().getArtists(paging));
  };

  public static Handler getById = ctx -> {
    Artist artist = ServiceRegistry.getLibraryService().getArtistById(ctx.pathParam("id"));
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
    artist = ServiceRegistry.getLibraryService().createArtist(artist);
    ctx.status(201);
    ctx.json(artist);
  };

  public static Handler updateArtist = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    Artist artist = mapper.readValue(ctx.body(), Artist.class);
    artist = ServiceRegistry.getLibraryService().updateArtist(artist);
    if (artist != null) {
      ctx.status(200);
      ctx.json(artist);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler deleteById = ctx -> {
    String id = ctx.pathParam("id");
    ctx.status(ServiceRegistry.getLibraryService().deleteArtistById(id) ? 200 : 404);
  };

  public static Handler getSongs = ctx -> {
    String id = ctx.pathParam("id");
    AbstractCollection.Paging paging = createPagingObject(ctx.queryParamMap());
    if (paging.getSort() == null) {
      paging.setSort("title");
    }
    ctx.json(ServiceRegistry.getLibraryService().getSongsForArtist(id, paging));
  };
}
