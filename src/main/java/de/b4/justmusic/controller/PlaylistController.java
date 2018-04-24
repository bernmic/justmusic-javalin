package de.b4.justmusic.controller;

import de.b4.justmusic.entity.AbstractPlaylist;
import de.b4.justmusic.service.PlaylistService;
import io.javalin.Handler;
import io.javalin.Javalin;

import static io.javalin.ApiBuilder.get;
import static io.javalin.ApiBuilder.path;

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
    ctx.json(PlaylistService.getPlaylistService().getPlaylists());
  };

  public static Handler getById = ctx -> {
    AbstractPlaylist playlist = PlaylistService.getPlaylistService().getPlaylistById(ctx.param("id"));
    if (playlist != null) {
      ctx.json(playlist);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler getSongs = ctx -> {
    String id = ctx.param("id");
    AbstractPlaylist playlist = PlaylistService.getPlaylistService().getPlaylistById(id);
    if (playlist != null) {
      ctx.json(playlist.getSongs());
    }
    else {
      ctx.status(404);
    }
  };
}
