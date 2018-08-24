package de.b4.justmusic.controller;

import de.b4.justmusic.entity.AbstractCollection;
import de.b4.justmusic.entity.AbstractPlaylist;
import de.b4.justmusic.entity.SongCollection;
import de.b4.justmusic.service.ServiceRegistry;
import io.javalin.Handler;
import io.javalin.Javalin;

import static io.javalin.apibuilder.ApiBuilder.get;
import static io.javalin.apibuilder.ApiBuilder.path;

public class PlaylistController {

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        //before("*", SecurityService.checkToken);
        path("playlist", () -> {
          get("", PlaylistController.getAll);
          get(":id", PlaylistController.getById);
          get(":id/songs", PlaylistController.getSongs);
        });
      });
    });
  }

  public static Handler getAll = ctx -> {
    ctx.json(ServiceRegistry.getPlaylistService().getPlaylists());
  };

  public static Handler getById = ctx -> {
    AbstractPlaylist playlist = ServiceRegistry.getPlaylistService().getPlaylistById(ctx.pathParam("id"));
    if (playlist != null) {
      ctx.json(playlist);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler getSongs = ctx -> {
    String id = ctx.pathParam("id");
    AbstractPlaylist playlist = ServiceRegistry.getPlaylistService().getPlaylistById(id);
    if (playlist != null) {
      SongCollection songCollection = new SongCollection();
      songCollection.setSongs(playlist.getSongs());
      songCollection.setPaging(new AbstractCollection.Paging());
      songCollection.getPaging().setSize(songCollection.getSongs().size());
      ctx.json(songCollection);
    }
    else {
      ctx.status(404);
    }
  };
}
